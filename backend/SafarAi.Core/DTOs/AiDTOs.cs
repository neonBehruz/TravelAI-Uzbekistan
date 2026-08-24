using SafarAi.Core.Enums;

namespace SafarAi.Core.DTOs;

public record AiPlanTripRequestDto(
    string Destination,
    int Days,
    decimal BudgetUzs,
    string Interests,
    string Language,
    string TravelStyle,
    string Transportation,
    int TravelersCount = 1
);

public record AiBudgetBreakdown(
    decimal TransportUzs,
    decimal FoodUzs,
    decimal TicketsUzs,
    decimal OtherUzs,
    decimal TotalEstimatedUzs,
    decimal RemainingUzs
);

public record AiTripActivityDto(
    int Order,
    string TimeSlot,
    Guid? PlaceId,
    string ActivityTitle,
    string Description,
    double Latitude,
    double Longitude,
    int DurationMinutes,
    double DistanceFromPreviousKm,
    decimal EstimatedCostUzs,
    string TransitMode,
    string ImageUrl
);

public record AiTripDayDto(
    int DayNumber,
    string Title,
    string Summary,
    List<AiTripActivityDto> Activities
);

public record AiTripPlanResponseDto(
    Guid? TripId,
    string Title,
    string DestinationName,
    int NumberOfDays,
    decimal TotalBudgetUzs,
    decimal EstimatedSpentUzs,
    double TotalDistanceKm,
    string AiSummary,
    AiBudgetBreakdown BudgetBreakdown,
    List<AiTripDayDto> Days
);

public record AiChatMessageDto(string Role, string Content);

public record AiChatRequestDto(
    string Message,
    string Language = "en",
    string? ContextPlaceName = null,
    Guid? ConversationId = null,
    string? Persona = "guide",
    List<AiChatMessageDto>? History = null
);

public record AiChatResponseDto(
    Guid ConversationId,
    string Reply,
    string Language,
    string? AudioUrl = null,
    List<string>? SuggestedFollowUps = null
);

public record AiGuideQuestionRequestDto(
    Guid PlaceId,
    string Question,
    string Language = "en"
);

public record AiGuideResponseDto(
    Guid PlaceId,
    string PlaceName,
    string Answer,
    string HistoricalContext,
    List<string> MustSeePoints,
    string Language,
    string? AudioUrl = null
);

public record AiTranslationRequestDto(
    string Text,
    string SourceLanguage,
    string TargetLanguage
);

public record AiTranslationResponseDto(
    string OriginalText,
    string TranslatedText,
    string SourceLanguage,
    string TargetLanguage,
    string? PhoneticPronunciation = null
);

public record AiVoiceRequestDto(
    string Text,
    string Language,
    string VoiceGender = "female",
    double Speed = 1.0
);

public record AiVoiceResponseDto(
    string Text,
    string Language,
    string AudioUrl,
    int DurationSeconds
);

public record AiVisionScanRequestDto(
    string? ImageBase64,
    string? ImageUrl,
    double? UserLatitude,
    double? UserLongitude,
    string Language = "en"
);

public record AiVisionScanResponseDto(
    bool IsRecognized,
    Guid? PlaceId,
    string RecognizedName,
    string LocalName,
    string Category,
    double Confidence,
    string ShortDescription,
    List<string> InterestingFacts,
    string AudioGuideScript,
    string ImageUrl,
    double Latitude,
    double Longitude
);
