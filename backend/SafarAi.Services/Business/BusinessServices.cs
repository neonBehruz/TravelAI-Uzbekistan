using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using SafarAi.Core.DTOs;
using SafarAi.Core.Entities;
using SafarAi.Core.Enums;
using SafarAi.Core.Interfaces;
using SafarAi.Infrastructure.Data;
using SafarAi.Infrastructure.Security;

namespace SafarAi.Services.Business;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(ApplicationDbContext dbContext, IJwtTokenGenerator jwtTokenGenerator)
    {
        _dbContext = dbContext;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        if (await _dbContext.Users.AnyAsync(u => u.Email.ToLower() == request.Email.ToLower()))
        {
            throw new InvalidOperationException("User with this email already exists.");
        }

        var role = UserRole.User;
        if (!string.IsNullOrEmpty(request.Role) && Enum.TryParse<UserRole>(request.Role, true, out var parsedRole))
        {
            role = parsedRole;
        }

        var user = new User
        {
            Name = request.Name,
            Email = request.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Country = string.IsNullOrWhiteSpace(request.Country) ? "Uzbekistan" : request.Country,
            PreferredLanguage = string.IsNullOrWhiteSpace(request.Language) ? "en" : request.Language,
            Role = role,
            CreatedAt = DateTime.UtcNow,
            LastLoginAt = DateTime.UtcNow
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        var (token, expiresAt) = _jwtTokenGenerator.GenerateAccessToken(user);
        var rawRefreshToken = _jwtTokenGenerator.GenerateRefreshToken();

        var refreshTokenEntity = new RefreshToken
        {
            Token = rawRefreshToken,
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(30),
            CreatedAt = DateTime.UtcNow
        };
        _dbContext.RefreshTokens.Add(refreshTokenEntity);
        await _dbContext.SaveChangesAsync();

        return new AuthResponseDto(
            Token: token,
            RefreshToken: rawRefreshToken,
            ExpiresAt: expiresAt,
            UserId: user.Id,
            Name: user.Name,
            Email: user.Email,
            Country: user.Country,
            Language: user.PreferredLanguage,
            Role: user.Role.ToString(),
            AvatarUrl: user.AvatarUrl
        );
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        var identifier = (request.Email ?? "").Trim().ToLower();
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => 
            u.Email.ToLower() == identifier || 
            u.Name.ToLower() == identifier ||
            u.Email.ToLower().StartsWith(identifier + "@")
        );

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Noto'g'ri login yoki parol kiritildi.");
        }

        user.LastLoginAt = DateTime.UtcNow;

        var (token, expiresAt) = _jwtTokenGenerator.GenerateAccessToken(user);
        var rawRefreshToken = _jwtTokenGenerator.GenerateRefreshToken();

        var refreshTokenEntity = new RefreshToken
        {
            Token = rawRefreshToken,
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(30),
            CreatedAt = DateTime.UtcNow
        };
        _dbContext.RefreshTokens.Add(refreshTokenEntity);
        await _dbContext.SaveChangesAsync();

        return new AuthResponseDto(
            Token: token,
            RefreshToken: rawRefreshToken,
            ExpiresAt: expiresAt,
            UserId: user.Id,
            Name: user.Name,
            Email: user.Email,
            Country: user.Country,
            Language: user.PreferredLanguage,
            Role: user.Role.ToString(),
            AvatarUrl: user.AvatarUrl
        );
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
    {
        var tokenRecord = await _dbContext.RefreshTokens
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Token == refreshToken);

        if (tokenRecord == null || !tokenRecord.IsActive || tokenRecord.User == null)
        {
            throw new UnauthorizedAccessException("Invalid, expired, or revoked refresh token.");
        }

        tokenRecord.IsRevoked = true;

        var user = tokenRecord.User;
        var (newToken, expiresAt) = _jwtTokenGenerator.GenerateAccessToken(user);
        var newRefreshToken = _jwtTokenGenerator.GenerateRefreshToken();

        tokenRecord.ReplacedByToken = newRefreshToken;

        var newRefreshTokenEntity = new RefreshToken
        {
            Token = newRefreshToken,
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(30),
            CreatedAt = DateTime.UtcNow
        };
        _dbContext.RefreshTokens.Add(newRefreshTokenEntity);
        await _dbContext.SaveChangesAsync();

        return new AuthResponseDto(
            Token: newToken,
            RefreshToken: newRefreshToken,
            ExpiresAt: expiresAt,
            UserId: user.Id,
            Name: user.Name,
            Email: user.Email,
            Country: user.Country,
            Language: user.PreferredLanguage,
            Role: user.Role.ToString(),
            AvatarUrl: user.AvatarUrl
        );
    }

    public async Task<bool> LogoutAsync(string? refreshToken, Guid? userId = null)
    {
        if (!string.IsNullOrEmpty(refreshToken))
        {
            var tokenRecord = await _dbContext.RefreshTokens.FirstOrDefaultAsync(r => r.Token == refreshToken);
            if (tokenRecord != null)
            {
                tokenRecord.IsRevoked = true;
                await _dbContext.SaveChangesAsync();
                return true;
            }
        }
        else if (userId.HasValue)
        {
            var activeTokens = await _dbContext.RefreshTokens
                .Where(r => r.UserId == userId.Value && !r.IsRevoked)
                .ToListAsync();

            foreach (var t in activeTokens) t.IsRevoked = true;
            await _dbContext.SaveChangesAsync();
            return true;
        }

        return false;
    }

    public async Task<UserProfileDto> GetProfileAsync(Guid userId)
    {
        var user = await _dbContext.Users
            .Include(u => u.SavedPlaces)
            .Include(u => u.Trips)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        return new UserProfileDto(
            Id: user.Id,
            Name: user.Name,
            Email: user.Email,
            Country: user.Country,
            PreferredLanguage: user.PreferredLanguage,
            Role: user.Role.ToString(),
            PreferredInterests: user.PreferredInterests,
            PreferredStyle: user.PreferredStyle.ToString(),
            PreferredTransport: user.PreferredTransport.ToString(),
            SavedPlacesCount: user.SavedPlaces.Count,
            TripsCount: user.Trips.Count,
            AvatarUrl: user.AvatarUrl,
            CreatedAt: user.CreatedAt
        );
    }

    public async Task<UserProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileRequestDto request)
    {
        var user = await _dbContext.Users
            .Include(u => u.SavedPlaces)
            .Include(u => u.Trips)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        user.Name = request.Name;
        user.Country = request.Country;
        user.PreferredLanguage = request.PreferredLanguage;
        user.PreferredInterests = request.PreferredInterests;
        if (!string.IsNullOrEmpty(request.AvatarUrl)) user.AvatarUrl = request.AvatarUrl;

        if (Enum.TryParse<TravelStyle>(request.PreferredStyle, true, out var style)) user.PreferredStyle = style;
        if (Enum.TryParse<TransportMode>(request.PreferredTransport, true, out var transport)) user.PreferredTransport = transport;

        await _dbContext.SaveChangesAsync();

        return new UserProfileDto(
            Id: user.Id,
            Name: user.Name,
            Email: user.Email,
            Country: user.Country,
            PreferredLanguage: user.PreferredLanguage,
            Role: user.Role.ToString(),
            PreferredInterests: user.PreferredInterests,
            PreferredStyle: user.PreferredStyle.ToString(),
            PreferredTransport: user.PreferredTransport.ToString(),
            SavedPlacesCount: user.SavedPlaces.Count,
            TripsCount: user.Trips.Count,
            AvatarUrl: user.AvatarUrl,
            CreatedAt: user.CreatedAt
        );
    }

    public async Task<ForgotPasswordResponseDto> ForgotPasswordAsync(ForgotPasswordRequestDto request)
    {
        var raw = (request.Identifier ?? "").Trim().ToLower();
        if (string.IsNullOrWhiteSpace(raw))
        {
            throw new InvalidOperationException("Foydalanuvchi nomi yoki email kiritilmadi.");
        }

        var user = await _dbContext.Users.FirstOrDefaultAsync(u =>
            u.Email.ToLower() == raw ||
            u.Name.ToLower() == raw ||
            u.Email.ToLower().StartsWith(raw + "@") ||
            u.Name.ToLower().Contains(raw)
        );

        if (user == null)
        {
            throw new InvalidOperationException($"'{request.Identifier}' nomli foydalanuvchi topilmadi. Iltimos oldin ro'yxatdan o'ting.");
        }

        var resetCode = Random.Shared.Next(100000, 999999).ToString();
        user.PasswordResetCode = resetCode;
        user.PasswordResetExpiresAt = DateTime.UtcNow.AddMinutes(15);
        await _dbContext.SaveChangesAsync();

        return new ForgotPasswordResponseDto(
            Success: true,
            Message: "Tiklash kodi muvaffaqiyatli shakllantirildi.",
            ResetCode: resetCode,
            TargetEmail: user.Email
        );
    }

    public async Task<bool> ResetPasswordAsync(ResetPasswordRequestDto request)
    {
        var raw = (request.Identifier ?? "").Trim().ToLower();
        if (string.IsNullOrWhiteSpace(raw))
        {
            throw new InvalidOperationException("Foydalanuvchi nomi yoki email kiritilmadi.");
        }

        var user = await _dbContext.Users.FirstOrDefaultAsync(u =>
            u.Email.ToLower() == raw ||
            u.Name.ToLower() == raw ||
            u.Email.ToLower().StartsWith(raw + "@") ||
            u.Name.ToLower().Contains(raw)
        );

        if (user == null)
        {
            throw new InvalidOperationException($"'{request.Identifier}' nomli foydalanuvchi topilmadi.");
        }

        if (string.IsNullOrWhiteSpace(user.PasswordResetCode) || 
            user.PasswordResetCode.Trim() != request.ResetCode.Trim() ||
            user.PasswordResetExpiresAt == null ||
            user.PasswordResetExpiresAt < DateTime.UtcNow)
        {
            throw new InvalidOperationException("Noto'g'ri yoki muddati o'tgan tasdiqlash kodi.");
        }

        if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 6)
        {
            throw new InvalidOperationException("Yangi parol kamida 6 belgidan iborat bo'lishi kerak.");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        user.PasswordResetCode = null;
        user.PasswordResetExpiresAt = null;

        await _dbContext.SaveChangesAsync();
        return true;
    }
}

public class PlaceService : IPlaceService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapService _mapService;
    private readonly ICacheService _cacheService;

    public PlaceService(
        ApplicationDbContext dbContext,
        IMapService mapService,
        ICacheService cacheService)
    {
        _dbContext = dbContext;
        _mapService = mapService;
        _cacheService = cacheService;
    }

    public async Task<List<DestinationDto>> GetDestinationsAsync()
    {
        const string cacheKey = "destinations_all";
        var cached = await _cacheService.GetAsync<List<DestinationDto>>(cacheKey);
        if (cached != null) return cached;

        var list = await _dbContext.Destinations
            .Include(d => d.Places)
            .Select(d => new DestinationDto(
                d.Id,
                d.Name,
                d.Region,
                d.Description,
                d.ImageUrl,
                d.Latitude,
                d.Longitude,
                d.Places.Count,
                d.PopularityScore
            ))
            .ToListAsync();

        await _cacheService.SetAsync(cacheKey, list, TimeSpan.FromMinutes(30));
        return list;
    }

    public async Task<PagedResult<DestinationDto>> GetDestinationsPagedAsync(PaginationQuery query)
    {
        var page = Math.Max(1, query.PageNumber);
        var pageSize = Math.Clamp(query.PageSize, 1, 50);

        var totalCount = await _dbContext.Destinations.CountAsync();
        var items = await _dbContext.Destinations
            .Include(d => d.Places)
            .OrderByDescending(d => d.PopularityScore)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(d => new DestinationDto(
                d.Id,
                d.Name,
                d.Region,
                d.Description,
                d.ImageUrl,
                d.Latitude,
                d.Longitude,
                d.Places.Count,
                d.PopularityScore
            ))
            .ToListAsync();

        return PagedResult<DestinationDto>.Create(items, page, pageSize, totalCount);
    }

    public async Task<DestinationDto?> GetDestinationByIdAsync(Guid id)
    {
        var d = await _dbContext.Destinations.Include(dest => dest.Places).FirstOrDefaultAsync(x => x.Id == id);
        if (d == null) return null;

        return new DestinationDto(
            d.Id,
            d.Name,
            d.Region,
            d.Description,
            d.ImageUrl,
            d.Latitude,
            d.Longitude,
            d.Places.Count,
            d.PopularityScore
        );
    }

    public async Task<List<PlaceDto>> GetPlacesAsync(string? city = null, string? category = null, string? search = null)
    {
        var query = _dbContext.Places
            .Include(p => p.Destination)
            .Include(p => p.Category)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(city))
        {
            query = query.Where(p => p.Destination!.Name.ToLower() == city.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(p => p.Category!.Name.ToLower().Contains(category.ToLower()));
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(s) || p.LocalName.ToLower().Contains(s) || p.ShortDescription.ToLower().Contains(s));
        }

        var list = await query.ToListAsync();
        return list.Select(p => MapToDto(p)).ToList();
    }

    public async Task<PagedResult<PlaceDto>> GetPlacesPagedAsync(PlaceFilterRequestDto filter)
    {
        var page = Math.Max(1, filter.PageNumber);
        var pageSize = Math.Clamp(filter.PageSize, 1, 50);

        var query = _dbContext.Places
            .Include(p => p.Destination)
            .Include(p => p.Category)
            .AsQueryable();

        // 1. Filter by City
        if (!string.IsNullOrWhiteSpace(filter.City))
        {
            query = query.Where(p => p.Destination!.Name.ToLower() == filter.City.ToLower());
        }

        // 2. Filter by Category Type
        if (filter.CategoryType.HasValue)
        {
            query = query.Where(p => p.Category != null && p.Category.Type == filter.CategoryType.Value);
        }

        // 3. Filter by Search Text
        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var s = filter.Search.ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(s) ||
                p.LocalName.ToLower().Contains(s) ||
                p.ShortDescription.ToLower().Contains(s) ||
                (p.Category != null && p.Category.Name.ToLower().Contains(s)));
        }

        // 4. Filter by Price Range
        if (filter.MinPrice.HasValue)
        {
            query = query.Where(p => p.TicketPriceUzs >= filter.MinPrice.Value);
        }
        if (filter.MaxPrice.HasValue)
        {
            query = query.Where(p => p.TicketPriceUzs <= filter.MaxPrice.Value);
        }

        // 5. Filter by Min Rating
        if (filter.MinRating.HasValue)
        {
            query = query.Where(p => p.Rating >= filter.MinRating.Value);
        }

        // 6. Sorting
        query = filter.SortBy?.ToLower() switch
        {
            "price_asc" => query.OrderBy(p => p.TicketPriceUzs),
            "price_desc" => query.OrderByDescending(p => p.TicketPriceUzs),
            "rating_desc" => query.OrderByDescending(p => p.Rating),
            "name_asc" => query.OrderBy(p => p.Name),
            "popular" => query.OrderByDescending(p => p.ReviewCount),
            _ => query.OrderByDescending(p => p.IsMustVisit).ThenByDescending(p => p.Rating)
        };

        var totalCount = await query.CountAsync();
        var rawPlaces = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = rawPlaces.Select(p => MapToDto(p)).ToList();
        return PagedResult<PlaceDto>.Create(items, page, pageSize, totalCount);
    }

    public async Task<PlaceDto?> GetPlaceByIdAsync(Guid id)
    {
        var place = await _dbContext.Places
            .Include(p => p.Destination)
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

        return place == null ? null : MapToDto(place);
    }

    public async Task<List<NearbyPlaceDto>> GetNearbyPlacesAsync(NearbyPlacesRequestDto request)
    {
        var places = await _dbContext.Places
            .Include(p => p.Category)
            .ToListAsync();

        var nearbyList = new List<NearbyPlaceDto>();

        foreach (var p in places)
        {
            var distKm = _mapService.CalculateHaversineDistance(request.Latitude, request.Longitude, p.Latitude, p.Longitude);
            if (distKm <= request.RadiusKm)
            {
                var distMeters = distKm * 1000;
                var formattedDist = distMeters < 1000 ? $"{(int)distMeters} m" : $"{distKm:F1} km";
                var (walkMins, _, _, _) = _mapService.EstimateTransit(distKm);

                nearbyList.Add(new NearbyPlaceDto(
                    p.Id,
                    p.Name,
                    p.Category != null ? p.Category.Name : "Landmark",
                    p.Category != null ? p.Category.Icon : "landmark",
                    p.Latitude,
                    p.Longitude,
                    distMeters,
                    formattedDist,
                    p.ImageUrl,
                    p.Rating,
                    p.TicketPriceUzs,
                    $"{walkMins} min walk"
                ));
            }
        }

        return nearbyList.OrderBy(n => n.DistanceMeters).ToList();
    }

    public async Task<List<ReviewDto>> GetReviewsByPlaceIdAsync(Guid placeId)
    {
        return await _dbContext.Reviews
            .Include(r => r.User)
            .Where(r => r.PlaceId == placeId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto(
                r.Id,
                r.PlaceId,
                r.User != null ? r.User.Name : "Anonymous Traveler",
                r.User != null ? r.User.Country : "Uzbekistan",
                r.Rating,
                r.Comment,
                r.CreatedAt
            ))
            .ToListAsync();
    }

    public async Task<ReviewDto> AddReviewAsync(Guid userId, CreateReviewRequestDto request)
    {
        var user = await _dbContext.Users.FindAsync(userId);
        if (user == null) throw new KeyNotFoundException("User not found.");

        var review = new Review
        {
            PlaceId = request.PlaceId,
            UserId = userId,
            Rating = Math.Clamp(request.Rating, 1, 5),
            Comment = request.Comment,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Reviews.Add(review);

        var place = await _dbContext.Places.FindAsync(request.PlaceId);
        if (place != null)
        {
            var currentTotal = place.Rating * place.ReviewCount;
            place.ReviewCount += 1;
            place.Rating = Math.Round((currentTotal + review.Rating) / place.ReviewCount, 1);
        }

        await _dbContext.SaveChangesAsync();

        return new ReviewDto(
            review.Id,
            review.PlaceId,
            user.Name,
            user.Country,
            review.Rating,
            review.Comment,
            review.CreatedAt
        );
    }

    public async Task<List<PlaceDto>> GetSavedPlacesAsync(Guid userId)
    {
        return await _dbContext.SavedPlaces
            .Where(s => s.UserId == userId)
            .Include(s => s.Place)
                .ThenInclude(p => p!.Destination)
            .Include(s => s.Place)
                .ThenInclude(p => p!.Category)
            .Select(s => MapToDto(s.Place!))
            .ToListAsync();
    }

    public async Task<bool> ToggleSavePlaceAsync(Guid userId, Guid placeId)
    {
        var existing = await _dbContext.SavedPlaces
            .FirstOrDefaultAsync(s => s.UserId == userId && s.PlaceId == placeId);

        if (existing != null)
        {
            _dbContext.SavedPlaces.Remove(existing);
            await _dbContext.SaveChangesAsync();
            return false;
        }

        _dbContext.SavedPlaces.Add(new SavedPlace
        {
            UserId = userId,
            PlaceId = placeId,
            SavedAt = DateTime.UtcNow
        });
        await _dbContext.SaveChangesAsync();
        return true;
    }

    private static PlaceDto MapToDto(Place p)
    {
        List<string> gallery = new();
        List<string> facts = new();

        try
        {
            if (!string.IsNullOrEmpty(p.ImageGalleryJson))
                gallery = JsonSerializer.Deserialize<List<string>>(p.ImageGalleryJson) ?? new();
            if (!string.IsNullOrEmpty(p.InterestingFacts))
            {
                if (p.InterestingFacts.TrimStart().StartsWith("["))
                    facts = JsonSerializer.Deserialize<List<string>>(p.InterestingFacts) ?? new();
                else
                    facts = p.InterestingFacts.Split(new[] { '\n', ';' }, StringSplitOptions.RemoveEmptyEntries).Select(f => f.Trim()).ToList();
            }
        }
        catch { }

        return new PlaceDto(
            p.Id,
            p.Name,
            p.LocalName,
            p.Destination != null ? p.Destination.Name : "Samarkand",
            p.Category != null ? p.Category.Name : "Historic",
            p.Category != null ? p.Category.Type : PlaceCategoryType.HistoricalLandmark,
            p.ShortDescription,
            p.DetailedHistory,
            p.ArchitectureDetails,
            facts,
            p.Latitude,
            p.Longitude,
            p.Address,
            p.ImageUrl,
            gallery,
            p.TicketPriceUzs,
            p.OpeningHours,
            p.RecommendedVisitDurationMinutes,
            p.Rating,
            p.ReviewCount,
            p.AudioGuideScript,
            p.AudioGuideUrl,
            p.IsMustVisit,
            null
        );
    }
}

public class TripService : ITripService
{
    private readonly ApplicationDbContext _dbContext;

    public TripService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Trip> SaveTripAsync(Guid userId, CreateTripRequestDto request)
    {
        var trip = new Trip
        {
            UserId = userId,
            Title = request.Title,
            DestinationName = request.DestinationName,
            NumberOfDays = request.NumberOfDays,
            TotalBudgetUzs = request.TotalBudgetUzs,
            Interests = request.Interests,
            Language = request.Language,
            AiSummary = request.PlanDetails.AiSummary,
            EstimatedSpentUzs = request.PlanDetails.EstimatedSpentUzs,
            TotalDistanceKm = request.PlanDetails.TotalDistanceKm,
            CreatedAt = DateTime.UtcNow
        };

        if (Enum.TryParse<TravelStyle>(request.Style, true, out var style)) trip.Style = style;
        if (Enum.TryParse<TransportMode>(request.Transportation, true, out var transport)) trip.PreferredTransport = transport;

        if (request.PlanDetails.Days != null)
        {
            foreach (var dayDto in request.PlanDetails.Days)
            {
                var day = new TripDay
                {
                    DayNumber = dayDto.DayNumber,
                    Title = dayDto.Title,
                    Summary = dayDto.Summary
                };

                if (dayDto.Activities != null)
                {
                    foreach (var act in dayDto.Activities)
                    {
                        var transitMode = TransportMode.Walking;
                        if (Enum.TryParse<TransportMode>(act.TransitMode, true, out var tm)) transitMode = tm;

                        day.Activities.Add(new TripActivity
                        {
                            Order = act.Order,
                            TimeSlot = act.TimeSlot,
                            PlaceId = act.PlaceId,
                            ActivityTitle = act.ActivityTitle,
                            Description = act.Description,
                            Latitude = act.Latitude,
                            Longitude = act.Longitude,
                            DurationMinutes = act.DurationMinutes,
                            DistanceFromPreviousKm = act.DistanceFromPreviousKm,
                            EstimatedCostUzs = act.EstimatedCostUzs,
                            TransitMode = transitMode
                        });
                    }
                }

                trip.Days.Add(day);
            }
        }

        _dbContext.Trips.Add(trip);
        await _dbContext.SaveChangesAsync();

        return trip;
    }

    public async Task<List<TripSummaryDto>> GetUserTripsAsync(Guid userId)
    {
        return await _dbContext.Trips
            .Include(t => t.Days)
                .ThenInclude(d => d.Activities)
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new TripSummaryDto(
                t.Id,
                t.Title,
                t.DestinationName,
                t.NumberOfDays,
                t.TotalBudgetUzs,
                t.EstimatedSpentUzs,
                t.TotalDistanceKm,
                t.Days.SelectMany(d => d.Activities).Count(),
                t.CreatedAt
            ))
            .ToListAsync();
    }

    public async Task<Trip?> GetTripByIdAsync(Guid tripId, Guid userId)
    {
        return await _dbContext.Trips
            .Include(t => t.Days)
                .ThenInclude(d => d.Activities)
            .FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId);
    }

    public async Task<bool> DeleteTripAsync(Guid tripId, Guid userId)
    {
        var trip = await _dbContext.Trips.FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId);
        if (trip == null) return false;

        _dbContext.Trips.Remove(trip);
        await _dbContext.SaveChangesAsync();
        return true;
    }
}

public class AdminService : IAdminService
{
    private readonly ApplicationDbContext _dbContext;

    public AdminService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<AdminDashboardStatsDto> GetDashboardStatsAsync()
    {
        var totalUsers = await _dbContext.Users.CountAsync();
        var totalDestinations = await _dbContext.Destinations.CountAsync();
        var totalPlaces = await _dbContext.Places.CountAsync();
        var totalTrips = await _dbContext.Trips.CountAsync();

        var touristCountries = new List<CountryStatDto>
        {
            new("Germany", 340, 28.5),
            new("France", 260, 21.8),
            new("United States", 190, 15.9),
            new("Japan", 145, 12.1),
            new("South Korea", 120, 10.0),
            new("Turkey", 95, 7.9),
            new("United Kingdom", 45, 3.8)
        };

        var topVisited = await _dbContext.Places
            .Include(p => p.Destination)
            .OrderByDescending(p => p.ReviewCount)
            .Take(5)
            .Select(p => new PopularPlaceStatDto(p.Name, p.Destination != null ? p.Destination.Name : "Samarkand", p.ReviewCount * 12, p.Rating))
            .ToListAsync();

        var languages = new List<PopularLanguageStatDto>
        {
            new("English", "en", 1450),
            new("Russian", "ru", 890),
            new("Uzbek", "uz", 640),
            new("German", "de", 430),
            new("French", "fr", 310),
            new("Turkish", "tr", 290),
            new("Chinese", "zh", 210),
            new("Korean", "ko", 180)
        };

        var activityTimeline = new List<MonthlyActivityDto>
        {
            new("May", 340, 120, 2450),
            new("Jun", 520, 230, 4890),
            new("Jul", 780, 410, 8920),
            new("Aug", 1150, 680, 14200)
        };

        return new AdminDashboardStatsDto(
            TotalUsers: totalUsers,
            ActiveTourists: Math.Max(totalUsers * 8, 48),
            TotalTripsGenerated: Math.Max(totalTrips * 15, 84),
            TotalAiRequests: 18450,
            TotalDestinations: totalDestinations,
            TotalPlaces: totalPlaces,
            TotalRevenueUzs: 48500000m,
            TouristCountries: touristCountries,
            TopVisitedPlaces: topVisited,
            LanguageDistribution: languages,
            ActivityTimeline: activityTimeline
        );
    }

    public async Task<List<UserProfileDto>> GetAllUsersAsync()
    {
        return await _dbContext.Users
            .Include(u => u.SavedPlaces)
            .Include(u => u.Trips)
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new UserProfileDto(
                u.Id,
                u.Name,
                u.Email,
                u.Country,
                u.PreferredLanguage,
                u.Role.ToString(),
                u.PreferredInterests,
                u.PreferredStyle.ToString(),
                u.PreferredTransport.ToString(),
                u.SavedPlaces.Count,
                u.Trips.Count,
                u.AvatarUrl,
                u.CreatedAt
            ))
            .ToListAsync();
    }

    public async Task<PagedResult<UserProfileDto>> GetUsersPagedAsync(string? search = null, string? role = null, int page = 1, int pageSize = 10)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 50);

        var query = _dbContext.Users
            .Include(u => u.SavedPlaces)
            .Include(u => u.Trips)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower();
            query = query.Where(u => u.Name.ToLower().Contains(s) || u.Email.ToLower().Contains(s) || u.Country.ToLower().Contains(s));
        }

        if (!string.IsNullOrWhiteSpace(role) && Enum.TryParse<UserRole>(role, true, out var r))
        {
            query = query.Where(u => u.Role == r);
        }

        var totalCount = await query.CountAsync();
        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new UserProfileDto(
                u.Id,
                u.Name,
                u.Email,
                u.Country,
                u.PreferredLanguage,
                u.Role.ToString(),
                u.PreferredInterests,
                u.PreferredStyle.ToString(),
                u.PreferredTransport.ToString(),
                u.SavedPlaces.Count,
                u.Trips.Count,
                u.AvatarUrl,
                u.CreatedAt
            ))
            .ToListAsync();

        return PagedResult<UserProfileDto>.Create(users, page, pageSize, totalCount);
    }

    public async Task<bool> DeleteUserAsync(Guid userId, Guid requestingAdminId)
    {
        if (userId == requestingAdminId)
        {
            throw new InvalidOperationException("Administrator cannot delete their own active account.");
        }

        var user = await _dbContext.Users
            .Include(u => u.Trips)
            .Include(u => u.Reviews)
            .Include(u => u.SavedPlaces)
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return false;

        _dbContext.Users.Remove(user);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateUserRoleAsync(Guid userId, string newRole)
    {
        var user = await _dbContext.Users.FindAsync(userId);
        if (user == null) return false;

        if (Enum.TryParse<UserRole>(newRole, true, out var role))
        {
            user.Role = role;
            await _dbContext.SaveChangesAsync();
            return true;
        }

        return false;
    }
}
