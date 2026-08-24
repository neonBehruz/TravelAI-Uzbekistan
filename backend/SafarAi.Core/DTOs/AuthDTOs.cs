using SafarAi.Core.Enums;

namespace SafarAi.Core.DTOs;

public record RegisterRequestDto(
    string Name,
    string Email,
    string Password,
    string Country,
    string Language,
    string? Role
);

public record LoginRequestDto(
    string Email,
    string Password
);

public record AuthResponseDto(
    string Token,
    Guid UserId,
    string Name,
    string Email,
    string Country,
    string Language,
    string Role
);

public record UserProfileDto(
    Guid Id,
    string Name,
    string Email,
    string Country,
    string PreferredLanguage,
    string Role,
    string? PreferredInterests,
    string PreferredStyle,
    string PreferredTransport,
    int SavedPlacesCount,
    int TripsCount
);

public record UpdateProfileRequestDto(
    string Name,
    string Country,
    string PreferredLanguage,
    string? PreferredInterests,
    string? PreferredStyle,
    string? PreferredTransport
);
