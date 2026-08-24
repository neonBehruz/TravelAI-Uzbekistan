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

        var token = _jwtTokenGenerator.GenerateToken(user);
        return new AuthResponseDto(
            Token: token,
            UserId: user.Id,
            Name: user.Name,
            Email: user.Email,
            Country: user.Country,
            Language: user.PreferredLanguage,
            Role: user.Role.ToString()
        );
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        user.LastLoginAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();

        var token = _jwtTokenGenerator.GenerateToken(user);
        return new AuthResponseDto(
            Token: token,
            UserId: user.Id,
            Name: user.Name,
            Email: user.Email,
            Country: user.Country,
            Language: user.PreferredLanguage,
            Role: user.Role.ToString()
        );
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
            TripsCount: user.Trips.Count
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
            TripsCount: user.Trips.Count
        );
    }
}

public class PlaceService : IPlaceService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapService _mapService;

    public PlaceService(ApplicationDbContext dbContext, IMapService mapService)
    {
        _dbContext = dbContext;
        _mapService = mapService;
    }

    public async Task<List<DestinationDto>> GetDestinationsAsync()
    {
        return await _dbContext.Destinations
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
                    Id: p.Id,
                    Name: p.Name,
                    Category: p.Category?.Name ?? "Attraction",
                    Icon: p.Category?.Icon ?? "landmark",
                    Latitude: p.Latitude,
                    Longitude: p.Longitude,
                    DistanceMeters: distMeters,
                    FormattedDistance: formattedDist,
                    ImageUrl: p.ImageUrl,
                    Rating: p.Rating,
                    TicketPriceUzs: p.TicketPriceUzs,
                    EstimatedWalkTime: $"{walkMins} min walk"
                ));
            }
        }

        return nearbyList.OrderBy(p => p.DistanceMeters).ToList();
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
                r.User != null ? r.User.Name : "Visitor",
                r.TouristCountry,
                r.Rating,
                r.Comment,
                r.CreatedAt
            ))
            .ToListAsync();
    }

    public async Task<ReviewDto> AddReviewAsync(Guid userId, CreateReviewRequestDto request)
    {
        var user = await _dbContext.Users.FindAsync(userId) ?? throw new KeyNotFoundException("User not found");
        var place = await _dbContext.Places.FindAsync(request.PlaceId) ?? throw new KeyNotFoundException("Place not found");

        var review = new Review
        {
            PlaceId = request.PlaceId,
            UserId = userId,
            Rating = Math.Clamp(request.Rating, 1, 5),
            Comment = request.Comment,
            TouristCountry = user.Country,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Reviews.Add(review);
        place.ReviewCount++;
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
        var savedPlaces = await _dbContext.SavedPlaces
            .Where(sp => sp.UserId == userId)
            .Include(sp => sp.Place)
                .ThenInclude(p => p.Destination)
            .Include(sp => sp.Place)
                .ThenInclude(p => p.Category)
            .Select(sp => sp.Place!)
            .ToListAsync();

        return savedPlaces.Select(p => MapToDto(p)).ToList();
    }

    public async Task<bool> ToggleSavePlaceAsync(Guid userId, Guid placeId)
    {
        var existing = await _dbContext.SavedPlaces.FirstOrDefaultAsync(sp => sp.UserId == userId && sp.PlaceId == placeId);
        if (existing != null)
        {
            _dbContext.SavedPlaces.Remove(existing);
            await _dbContext.SaveChangesAsync();
            return false; // Removed
        }

        _dbContext.SavedPlaces.Add(new SavedPlace
        {
            UserId = userId,
            PlaceId = placeId,
            SavedAt = DateTime.UtcNow
        });
        await _dbContext.SaveChangesAsync();
        return true; // Added
    }

    private static PlaceDto MapToDto(Place p)
    {
        var facts = new List<string>();
        var gallery = new List<string>();
        try { facts = JsonSerializer.Deserialize<List<string>>(p.InterestingFacts) ?? new(); } catch { }
        try { gallery = JsonSerializer.Deserialize<List<string>>(p.ImageGalleryJson) ?? new(); } catch { }

        return new PlaceDto(
            p.Id,
            p.Name,
            p.LocalName,
            p.Destination?.Name ?? "Samarkand",
            p.Category?.Name ?? "Historical Landmark",
            p.Category?.Type ?? PlaceCategoryType.HistoricalLandmark,
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
            EstimatedSpentUzs = request.PlanDetails.EstimatedSpentUzs,
            TotalDistanceKm = request.PlanDetails.TotalDistanceKm,
            Interests = request.Interests,
            AiSummary = request.PlanDetails.AiSummary,
            Language = request.Language,
            CreatedAt = DateTime.UtcNow
        };

        foreach (var dayDto in request.PlanDetails.Days)
        {
            var day = new TripDay
            {
                DayNumber = dayDto.DayNumber,
                Title = dayDto.Title,
                Summary = dayDto.Summary
            };

            foreach (var actDto in dayDto.Activities)
            {
                day.Activities.Add(new TripActivity
                {
                    Order = actDto.Order,
                    TimeSlot = actDto.TimeSlot,
                    PlaceId = actDto.PlaceId,
                    ActivityTitle = actDto.ActivityTitle,
                    Description = actDto.Description,
                    Latitude = actDto.Latitude,
                    Longitude = actDto.Longitude,
                    DurationMinutes = actDto.DurationMinutes,
                    DistanceFromPreviousKm = actDto.DistanceFromPreviousKm,
                    EstimatedCostUzs = actDto.EstimatedCostUzs
                });
            }

            trip.Days.Add(day);
        }

        _dbContext.Trips.Add(trip);
        await _dbContext.SaveChangesAsync();

        return trip;
    }

    public async Task<List<TripSummaryDto>> GetUserTripsAsync(Guid userId)
    {
        return await _dbContext.Trips
            .Where(t => t.UserId == userId)
            .Include(t => t.Days)
                .ThenInclude(d => d.Activities)
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
        var totalPlaces = await _dbContext.Places.CountAsync();
        var totalDestinations = await _dbContext.Destinations.CountAsync();
        var totalTrips = await _dbContext.Trips.CountAsync();

        var touristCountries = new List<CountryStatDto>
        {
            new("Germany", 34, 28.5),
            new("United Kingdom", 22, 18.3),
            new("United States", 19, 15.8),
            new("France", 15, 12.5),
            new("Turkey", 14, 11.7),
            new("Japan", 9, 7.5),
            new("South Korea", 7, 5.7)
        };

        var topVisited = await _dbContext.Places
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
                u.Trips.Count
            ))
            .ToListAsync();
    }
}
