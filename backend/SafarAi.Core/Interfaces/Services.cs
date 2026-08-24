using SafarAi.Core.DTOs;
using SafarAi.Core.Entities;

namespace SafarAi.Core.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
    Task<UserProfileDto> GetProfileAsync(Guid userId);
    Task<UserProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileRequestDto request);
}

public interface IPlaceService
{
    Task<List<DestinationDto>> GetDestinationsAsync();
    Task<DestinationDto?> GetDestinationByIdAsync(Guid id);
    Task<List<PlaceDto>> GetPlacesAsync(string? city = null, string? category = null, string? search = null);
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
}
