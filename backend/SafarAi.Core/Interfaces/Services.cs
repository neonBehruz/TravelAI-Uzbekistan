using SafarAi.Core.DTOs;
using SafarAi.Core.Entities;

namespace SafarAi.Core.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
    Task<AuthResponseDto> RefreshTokenAsync(string refreshToken);
    Task<bool> LogoutAsync(string? refreshToken, Guid? userId = null);
    Task<UserProfileDto> GetProfileAsync(Guid userId);
    Task<UserProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileRequestDto request);
    Task<ForgotPasswordResponseDto> ForgotPasswordAsync(ForgotPasswordRequestDto request);
    Task<bool> ResetPasswordAsync(ResetPasswordRequestDto request);
}

public interface IPlaceService
{
    Task<List<DestinationDto>> GetDestinationsAsync();
    Task<PagedResult<DestinationDto>> GetDestinationsPagedAsync(PaginationQuery query);
    Task<DestinationDto?> GetDestinationByIdAsync(Guid id);
    Task<List<PlaceDto>> GetPlacesAsync(string? city = null, string? category = null, string? search = null);
    Task<PagedResult<PlaceDto>> GetPlacesPagedAsync(PlaceFilterRequestDto filter);
    Task<PlaceDto?> GetPlaceByIdAsync(Guid id);
    Task<List<NearbyPlaceDto>> GetNearbyPlacesAsync(NearbyPlacesRequestDto request);
    Task<List<ReviewDto>> GetReviewsByPlaceIdAsync(Guid placeId);
    Task<ReviewDto> AddReviewAsync(Guid userId, CreateReviewRequestDto request);
    Task<List<PlaceDto>> GetSavedPlacesAsync(Guid userId);
    Task<bool> ToggleSavePlaceAsync(Guid userId, Guid placeId);
}

public interface ITripService
{
    Task<Trip> SaveTripAsync(Guid userId, CreateTripRequestDto request);
    Task<List<TripSummaryDto>> GetUserTripsAsync(Guid userId);
    Task<Trip?> GetTripByIdAsync(Guid tripId, Guid userId);
    Task<bool> DeleteTripAsync(Guid tripId, Guid userId);
}

public interface IMapService
{
    Task<RouteCalculationResponseDto> CalculateRouteAsync(CalculateRouteRequestDto request);
    double CalculateHaversineDistance(double lat1, double lon1, double lat2, double lon2);
    (int walkMins, int carMins, int taxiMins, decimal taxiCostUzs) EstimateTransit(double distanceKm);
}

public interface IAITripPlannerService
{
    Task<AiTripPlanResponseDto> GenerateItineraryAsync(AiPlanTripRequestDto request);
}

public interface IAIGuideService
{
    Task<AiChatResponseDto> ChatAsync(AiChatRequestDto request, Guid? userId = null);
    Task<AiGuideResponseDto> AskPlaceQuestionAsync(AiGuideQuestionRequestDto request);
}

public interface IAITranslationService
{
    Task<AiTranslationResponseDto> TranslateAsync(AiTranslationRequestDto request, Guid? userId = null);
}

public interface IAIVoiceService
{
    Task<AiVoiceResponseDto> SynthesizeSpeechAsync(AiVoiceRequestDto request);
}

public interface IAIVisionService
{
    Task<AiVisionScanResponseDto> RecognizeLandmarkAsync(AiVisionScanRequestDto request);
}

public interface IAdminService
{
    Task<AdminDashboardStatsDto> GetDashboardStatsAsync();
    Task<List<UserProfileDto>> GetAllUsersAsync();
    Task<PagedResult<UserProfileDto>> GetUsersPagedAsync(string? search = null, string? role = null, int page = 1, int pageSize = 10);
    Task<bool> DeleteUserAsync(Guid userId, Guid requestingAdminId);
    Task<bool> UpdateUserRoleAsync(Guid userId, string newRole);
}

public interface IStorageService
{
    Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType, string folder = "uploads");
    Task<bool> DeleteFileAsync(string fileUrl);
}

public interface ICacheService
{
    Task<T?> GetAsync<T>(string key);
    Task SetAsync<T>(string key, T value, TimeSpan? expiration = null);
    Task RemoveAsync(string key);
    Task RemoveByPrefixAsync(string prefix);
}

public interface IBackgroundTaskQueue
{
    ValueTask QueueBackgroundWorkItemAsync(Func<IServiceProvider, CancellationToken, ValueTask> workItem);
    ValueTask<Func<IServiceProvider, CancellationToken, ValueTask>> DequeueAsync(CancellationToken cancellationToken);
}

public interface ISignalRNotificationService
{
    Task BroadcastLiveStatsAsync(LiveTouristSignalDto signal);
    Task BroadcastSystemAlertAsync(string title, string message, string alertType);
}

