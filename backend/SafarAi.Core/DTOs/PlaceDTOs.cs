using SafarAi.Core.Enums;

namespace SafarAi.Core.DTOs;

public record PlaceDto(
    Guid Id,
    string Name,
    string LocalName,
    string DestinationName,
    string CategoryName,
    PlaceCategoryType CategoryType,
    string ShortDescription,
    string DetailedHistory,
    string ArchitectureDetails,
    List<string> InterestingFacts,
    double Latitude,
    double Longitude,
    string Address,
    string ImageUrl,
    List<string> ImageGallery,
    decimal TicketPriceUzs,
    string OpeningHours,
    int RecommendedVisitDurationMinutes,
    double Rating,
    int ReviewCount,
    string AudioGuideScript,
    string? AudioGuideUrl,
    bool IsMustVisit,
    double? DistanceFromUserKm
);

public record DestinationDto(
    Guid Id,
    string Name,
    string Region,
    string Description,
    string ImageUrl,
    double Latitude,
    double Longitude,
    int PlacesCount,
    int PopularityScore
);

public record ReviewDto(
    Guid Id,
    Guid PlaceId,
    string UserName,
    string TouristCountry,
    int Rating,
    string Comment,
    DateTime CreatedAt
);

public record CreateReviewRequestDto(
    Guid PlaceId,
    int Rating,
    string Comment
);

public record NearbyPlacesRequestDto(
    double Latitude,
    double Longitude,
    double RadiusKm = 5.0,
    string? Category = null
);

public record NearbyPlaceDto(
    Guid Id,
    string Name,
    string Category,
    string Icon,
    double Latitude,
    double Longitude,
    double DistanceMeters,
    string FormattedDistance,
    string ImageUrl,
    double Rating,
    decimal TicketPriceUzs,
    string EstimatedWalkTime
);
