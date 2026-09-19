using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SafarAi.Core.DTOs;
using SafarAi.Core.Interfaces;

namespace SafarAi.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterRequestDto request)
    {
        try
        {
            var result = await _authService.RegisterAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto request)
    {
        try
        {
            var result = await _authService.LoginAsync(request);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("forgot-password")]
    public async Task<ActionResult<ForgotPasswordResponseDto>> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
    {
        try
        {
            var result = await _authService.ForgotPasswordAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("reset-password")]
    public async Task<ActionResult<object>> ResetPassword([FromBody] ResetPasswordRequestDto request)
    {
        try
        {
            var success = await _authService.ResetPasswordAsync(request);
            return Ok(new { success, message = "Parol muvaffaqiyatli yangilandi." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("refresh-token")]
    public async Task<ActionResult<AuthResponseDto>> RefreshToken([FromBody] RefreshTokenRequestDto request)
    {
        try
        {
            var result = await _authService.RefreshTokenAsync(request.RefreshToken);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("logout")]
    public async Task<ActionResult<object>> Logout([FromBody] LogoutRequestDto? request)
    {
        var userId = GetUserId();
        var result = await _authService.LogoutAsync(request?.RefreshToken, userId);
        return Ok(new { success = true, message = "Logged out and tokens revoked successfully." });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserProfileDto>> GetProfile()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var profile = await _authService.GetProfileAsync(userId.Value);
        return Ok(profile);
    }

    [Authorize]
    [HttpPut("me")]
    public async Task<ActionResult<UserProfileDto>> UpdateProfile([FromBody] UpdateProfileRequestDto request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var profile = await _authService.UpdateProfileAsync(userId.Value, request);
        return Ok(profile);
    }

    private Guid? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
        if (claim != null && Guid.TryParse(claim.Value, out var guid))
        {
            return guid;
        }
        return null;
    }
}

[ApiController]
[Route("api/[controller]")]
public class DestinationsController : ControllerBase
{
    private readonly IPlaceService _placeService;

    public DestinationsController(IPlaceService placeService)
    {
        _placeService = placeService;
    }

    [HttpGet]
    public async Task<ActionResult<List<DestinationDto>>> GetAll()
    {
        var result = await _placeService.GetDestinationsAsync();
        return Ok(result);
    }

    [HttpGet("paged")]
    public async Task<ActionResult<PagedResult<DestinationDto>>> GetPaged([FromQuery] PaginationQuery query)
    {
        var result = await _placeService.GetDestinationsPagedAsync(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<DestinationDto>> GetById(Guid id)
    {
        var result = await _placeService.GetDestinationByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }
}

[ApiController]
[Route("api/[controller]")]
public class PlacesController : ControllerBase
{
    private readonly IPlaceService _placeService;

    public PlacesController(IPlaceService placeService)
    {
        _placeService = placeService;
    }

    [HttpGet]
    public async Task<ActionResult<List<PlaceDto>>> GetPlaces([FromQuery] string? city, [FromQuery] string? category, [FromQuery] string? search)
    {
        var result = await _placeService.GetPlacesAsync(city, category, search);
        return Ok(result);
    }

    [HttpGet("paged")]
    public async Task<ActionResult<PagedResult<PlaceDto>>> GetPlacesPaged([FromQuery] PlaceFilterRequestDto filter)
    {
        var result = await _placeService.GetPlacesPagedAsync(filter);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PlaceDto>> GetById(Guid id)
    {
        var result = await _placeService.GetPlaceByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost("nearby")]
    public async Task<ActionResult<List<NearbyPlaceDto>>> GetNearby([FromBody] NearbyPlacesRequestDto request)
    {
        var result = await _placeService.GetNearbyPlacesAsync(request);
        return Ok(result);
    }

    [HttpGet("{id:guid}/reviews")]
    public async Task<ActionResult<List<ReviewDto>>> GetReviews(Guid id)
    {
        var result = await _placeService.GetReviewsByPlaceIdAsync(id);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("{id:guid}/reviews")]
    public async Task<ActionResult<ReviewDto>> AddReview(Guid id, [FromBody] CreateReviewRequestDto request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var result = await _placeService.AddReviewAsync(userId.Value, request with { PlaceId = id });
        return Ok(result);
    }

    [Authorize]
    [HttpGet("saved")]
    public async Task<ActionResult<List<PlaceDto>>> GetSaved()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var result = await _placeService.GetSavedPlacesAsync(userId.Value);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("{id:guid}/save")]
    public async Task<ActionResult<object>> ToggleSave(Guid id)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var isSaved = await _placeService.ToggleSavePlaceAsync(userId.Value, id);
        return Ok(new { isSaved });
    }

    private Guid? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
        if (claim != null && Guid.TryParse(claim.Value, out var guid))
        {
            return guid;
        }
        return null;
    }
}
