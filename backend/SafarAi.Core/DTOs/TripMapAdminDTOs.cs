namespace SafarAi.Core.DTOs;

public record CreateTripRequestDto(
    string Title,
    string DestinationName,
    int NumberOfDays,
    decimal TotalBudgetUzs,
    string Interests,
    string Style,
    string Transportation,
    string Language,
    AiTripPlanResponseDto PlanDetails
);

public record TripSummaryDto(
    Guid Id,
    string Title,
    string DestinationName,
    int NumberOfDays,
    decimal TotalBudgetUzs,
    decimal EstimatedSpentUzs,
    double TotalDistanceKm,
    int ActivitiesCount,
    DateTime CreatedAt
);

public record CalculateRouteRequestDto(
    double StartLatitude,
    double StartLongitude,
    double EndLatitude,
    double EndLongitude,
    string? Mode = "Walking" // Walking, Car, Taxi
);

public record RouteOptionDto(
    string Mode,
    double DistanceKm,
    string FormattedDistance,
    int DurationMinutes,
    string FormattedDuration,
    decimal EstimatedCostUzs,
    string RecommendationReason
);

public record RouteCalculationResponseDto(
    double DistanceKm,
    string BestMode,
    List<RouteOptionDto> Options,
    List<RouteCoordinateDto> Waypoints
);

public record RouteCoordinateDto(
    double Latitude,
    double Longitude,
    string? Label
);

public record AdminDashboardStatsDto(
    int TotalUsers,
    int ActiveTourists,
    int TotalTripsGenerated,
    int TotalAiRequests,
    int TotalDestinations,
    int TotalPlaces,
    decimal TotalRevenueUzs,
    List<CountryStatDto> TouristCountries,
    List<PopularPlaceStatDto> TopVisitedPlaces,
    List<PopularLanguageStatDto> LanguageDistribution,
    List<MonthlyActivityDto> ActivityTimeline
);

public record CountryStatDto(string Country, int Count, double Percentage);
public record PopularPlaceStatDto(string Name, string City, int VisitCount, double Rating);
public record PopularLanguageStatDto(string Language, string Code, int RequestCount);
public record MonthlyActivityDto(string Month, int Users, int Trips, int AiCalls);
