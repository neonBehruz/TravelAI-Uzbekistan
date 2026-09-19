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
    string RefreshToken,
    DateTime ExpiresAt,
    Guid UserId,
    string Name,
    string Email,
    string Country,
    string Language,
    string Role,
    string? AvatarUrl = null
);

public record RefreshTokenRequestDto(
    string RefreshToken
);

public record LogoutRequestDto(
    string? RefreshToken = null
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
    int TripsCount,
    string? AvatarUrl = null,
    DateTime? CreatedAt = null
);

public record UpdateProfileRequestDto(
    string Name,
    string Country,
    string PreferredLanguage,
    string? PreferredInterests,
    string? PreferredStyle,
    string? PreferredTransport,
    string? AvatarUrl = null
);

public record ForgotPasswordRequestDto(
    string Identifier
);

public record ForgotPasswordResponseDto(
    bool Success,
    string Message,
    string? ResetCode = null,
    string? TargetEmail = null
);

public record ResetPasswordRequestDto(
    string Identifier,
    string ResetCode,
    string NewPassword
);

