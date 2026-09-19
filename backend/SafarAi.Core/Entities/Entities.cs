using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SafarAi.Core.Enums;

namespace SafarAi.Core.Entities;

public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Country { get; set; } = "Uzbekistan";

    [MaxLength(10)]
    public string PreferredLanguage { get; set; } = "en";

    public UserRole Role { get; set; } = UserRole.User;

    public string? PreferredInterests { get; set; } // JSON array or comma separated
    public TravelStyle PreferredStyle { get; set; } = TravelStyle.Balanced;
    public TransportMode PreferredTransport { get; set; } = TransportMode.Walking;

    [MaxLength(255)]
    public string? AvatarUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }

    [MaxLength(10)]
    public string? PasswordResetCode { get; set; }
    public DateTime? PasswordResetExpiresAt { get; set; }

    public ICollection<Trip> Trips { get; set; } = new List<Trip>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<SavedPlace> SavedPlaces { get; set; } = new List<SavedPlace>();
    public ICollection<AIConversation> AIConversations { get; set; } = new List<AIConversation>();
    public ICollection<UserLocation> LocationHistory { get; set; } = new List<UserLocation>();
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}

public class RefreshToken
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string Token { get; set; } = string.Empty;

    public Guid UserId { get; set; }
    [ForeignKey("UserId")]
    public User? User { get; set; }

    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? ReplacedByToken { get; set; }

    public bool IsActive => !IsRevoked && DateTime.UtcNow < ExpiresAt;
}

public class Destination
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty; // e.g. Samarkand

    [MaxLength(100)]
    public string Region { get; set; } = "Samarkand Region";

    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;

    public double Latitude { get; set; }
    public double Longitude { get; set; }

    public bool IsActive { get; set; } = true;
    public int PopularityScore { get; set; } = 100;

    public ICollection<Place> Places { get; set; } = new List<Place>();
}

public class PlaceCategory
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Icon { get; set; } = "landmark";

    public PlaceCategoryType Type { get; set; } = PlaceCategoryType.HistoricalLandmark;

    public ICollection<Place> Places { get; set; } = new List<Place>();
}

public class Place
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(150)]
    public string LocalName { get; set; } = string.Empty; // In Uzbek/Russian

    public Guid DestinationId { get; set; }
    public Destination? Destination { get; set; }

    public Guid CategoryId { get; set; }
    public PlaceCategory? Category { get; set; }

    public string ShortDescription { get; set; } = string.Empty;
    public string DetailedHistory { get; set; } = string.Empty;
    public string ArchitectureDetails { get; set; } = string.Empty;
    public string InterestingFacts { get; set; } = string.Empty; // JSON or bulleted text

    public double Latitude { get; set; }
    public double Longitude { get; set; }

    public string Address { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string ImageGalleryJson { get; set; } = "[]";

    public decimal TicketPriceUzs { get; set; }
    public string OpeningHours { get; set; } = "09:00 - 18:00";
    public int RecommendedVisitDurationMinutes { get; set; } = 60;
    public double Rating { get; set; } = 4.9;
    public int ReviewCount { get; set; } = 0;

    public string AudioGuideScript { get; set; } = string.Empty;
    public string? AudioGuideUrl { get; set; }

    public string VisionRecognitionTags { get; set; } = string.Empty; // keywords for AI camera scan

    public bool IsMustVisit { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<SavedPlace> SavedByUsers { get; set; } = new List<SavedPlace>();
}

public class Hotel
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    public Guid DestinationId { get; set; }
    public Destination? Destination { get; set; }

    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string Address { get; set; } = string.Empty;
    public decimal PricePerNightUzs { get; set; }
    public double Rating { get; set; } = 4.8;
    public int Stars { get; set; } = 4;
    public string ImageUrl { get; set; } = string.Empty;
    public string AmenitiesJson { get; set; } = "[]";
}

public class Restaurant
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    public Guid DestinationId { get; set; }
    public Destination? Destination { get; set; }

    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string Address { get; set; } = string.Empty;
    public string CuisineType { get; set; } = "National Uzbek & Halal";
    public decimal AverageCostUzs { get; set; } = 80000;
    public double Rating { get; set; } = 4.9;
    public string ImageUrl { get; set; } = string.Empty;
    public string SignatureDishes { get; set; } = "Samarkand Osh (Plov), Shashlik, Tandir Somsa";
}

public class Trip
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }
    public User? User { get; set; }

    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = "My Samarkand Journey";

    public string DestinationName { get; set; } = "Samarkand";
    public int NumberOfDays { get; set; } = 2;
    public decimal TotalBudgetUzs { get; set; } = 1000000;
    public decimal EstimatedSpentUzs { get; set; } = 850000;
    public double TotalDistanceKm { get; set; } = 12.4;

    public string Interests { get; set; } = "History, Uzbek Food, Photography";
    public TravelStyle Style { get; set; } = TravelStyle.Balanced;
    public TransportMode PreferredTransport { get; set; } = TransportMode.Walking;
    public string Language { get; set; } = "en";

    public string BudgetBreakdownJson { get; set; } = "{}"; // Transport, Food, Tickets, Other
    public string AiSummary { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<TripDay> Days { get; set; } = new List<TripDay>();
}

public class TripDay
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid TripId { get; set; }
    public Trip? Trip { get; set; }

    public int DayNumber { get; set; } = 1;
    public string Title { get; set; } = "Day 1: Architectural Wonders";
    public string Summary { get; set; } = string.Empty;

    public ICollection<TripActivity> Activities { get; set; } = new List<TripActivity>();
}

public class TripActivity
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid TripDayId { get; set; }
    public TripDay? TripDay { get; set; }

    public int Order { get; set; } = 1;
    public string TimeSlot { get; set; } = "09:00 - 10:30";

    public Guid? PlaceId { get; set; }
    public Place? Place { get; set; }

    [Required]
    public string ActivityTitle { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public double Latitude { get; set; }
    public double Longitude { get; set; }

    public int DurationMinutes { get; set; } = 60;
    public double DistanceFromPreviousKm { get; set; } = 0.0;
    public decimal EstimatedCostUzs { get; set; } = 0;
    public TransportMode TransitMode { get; set; } = TransportMode.Walking;
}

public class Review
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid PlaceId { get; set; }
    public Place? Place { get; set; }

    public Guid UserId { get; set; }
    public User? User { get; set; }

    public int Rating { get; set; } = 5;
    public string Comment { get; set; } = string.Empty;
    public string TouristCountry { get; set; } = "Germany";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class SavedPlace
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }
    public User? User { get; set; }

    public Guid PlaceId { get; set; }
    public Place? Place { get; set; }

    public DateTime SavedAt { get; set; } = DateTime.UtcNow;
}

public class AIConversation
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid? UserId { get; set; }
    public User? User { get; set; }

    public string SessionTitle { get; set; } = "AI Tour Guide Chat";
    public string ContextPlaceName { get; set; } = "Samarkand General";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<AIMessage> Messages { get; set; } = new List<AIMessage>();
}

public class AIMessage
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ConversationId { get; set; }
    public AIConversation? Conversation { get; set; }

    public bool IsUser { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? Language { get; set; } = "en";
    public string? AudioUrl { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

public class UserLocation
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid? UserId { get; set; }
    public User? User { get; set; }

    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? DetectedCity { get; set; }
    public string? NearestLandmark { get; set; }
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
}

public class TranslationHistory
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid? UserId { get; set; }
    public string SourceLanguage { get; set; } = "en";
    public string TargetLanguage { get; set; } = "uz";
    public string OriginalText { get; set; } = string.Empty;
    public string TranslatedText { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
