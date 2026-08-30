using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SafarAi.Core.DTOs;
using SafarAi.Core.Interfaces;

namespace SafarAi.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AiController : ControllerBase
{
    private readonly IAITripPlannerService _tripPlanner;
    private readonly IAIGuideService _guideService;
    private readonly IAITranslationService _translationService;
    private readonly IAIVoiceService _voiceService;
    private readonly IAIVisionService _visionService;

    public AiController(
        IAITripPlannerService tripPlanner,
        IAIGuideService guideService,
        IAITranslationService translationService,
        IAIVoiceService voiceService,
        IAIVisionService visionService)
    {
        _tripPlanner = tripPlanner;
        _guideService = guideService;
        _translationService = translationService;
        _voiceService = voiceService;
        _visionService = visionService;
    }

    [HttpPost("plan-trip")]
    public async Task<ActionResult<AiTripPlanResponseDto>> PlanTrip([FromBody] AiPlanTripRequestDto request)
    {
        var result = await _tripPlanner.GenerateItineraryAsync(request);
        return Ok(result);
    }

    [HttpPost("chat")]
    public async Task<ActionResult<AiChatResponseDto>> Chat([FromBody] AiChatRequestDto request)
    {
        var userId = GetUserId();
        var result = await _guideService.ChatAsync(request, userId);
        return Ok(result);
    }

    [HttpPost("guide")]
    public async Task<ActionResult<AiGuideResponseDto>> AskGuide([FromBody] AiGuideQuestionRequestDto request)
    {
        var result = await _guideService.AskPlaceQuestionAsync(request);
        return Ok(result);
    }

    [HttpPost("translate")]
    public async Task<ActionResult<AiTranslationResponseDto>> Translate([FromBody] AiTranslationRequestDto request)
    {
        var userId = GetUserId();
        var result = await _translationService.TranslateAsync(request, userId);
        return Ok(result);
    }

    [HttpPost("voice")]
    public async Task<ActionResult<AiVoiceResponseDto>> SynthesizeVoice([FromBody] AiVoiceRequestDto request)
    {
        var result = await _voiceService.SynthesizeSpeechAsync(request);
        return Ok(result);
    }

    [HttpPost("vision")]
    public async Task<ActionResult<AiVisionScanResponseDto>> RecognizeVision([FromBody] AiVisionScanRequestDto request)
    {
        var result = await _visionService.RecognizeLandmarkAsync(request);
        return Ok(result);
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
public class TripsController : ControllerBase
{
    private readonly ITripService _tripService;

    public TripsController(ITripService tripService)
    {
        _tripService = tripService;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<TripSummaryDto>> SaveTrip([FromBody] CreateTripRequestDto request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var trip = await _tripService.SaveTripAsync(userId.Value, request);
        return Ok(new TripSummaryDto(
            trip.Id,
            trip.Title,
            trip.DestinationName,
            trip.NumberOfDays,
            trip.TotalBudgetUzs,
            trip.EstimatedSpentUzs,
            trip.TotalDistanceKm,
            trip.Days.SelectMany(d => d.Activities).Count(),
            trip.CreatedAt
        ));
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<TripSummaryDto>>> GetMyTrips()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var trips = await _tripService.GetUserTripsAsync(userId.Value);
        return Ok(trips);
    }

    [Authorize]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<object>> GetTripById(Guid id)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var trip = await _tripService.GetTripByIdAsync(id, userId.Value);
        if (trip == null) return NotFound();

        return Ok(trip);
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteTrip(Guid id)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var deleted = await _tripService.DeleteTripAsync(id, userId.Value);
        if (!deleted) return NotFound();

        return NoContent();
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
public class RoutesController : ControllerBase
{
    private readonly IMapService _mapService;

    public RoutesController(IMapService mapService)
    {
        _mapService = mapService;
    }

    [HttpPost("calculate")]
    public async Task<ActionResult<RouteCalculationResponseDto>> Calculate([FromBody] CalculateRouteRequestDto request)
    {
        var result = await _mapService.CalculateRouteAsync(request);
        return Ok(result);
    }
}

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("dashboard")]
    public async Task<ActionResult<AdminDashboardStatsDto>> GetDashboard()
    {
        var stats = await _adminService.GetDashboardStatsAsync();
        return Ok(stats);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("users")]
    public async Task<ActionResult<List<UserProfileDto>>> GetUsers()
    {
        var users = await _adminService.GetAllUsersAsync();
        return Ok(users);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("users/paged")]
    public async Task<ActionResult<PagedResult<UserProfileDto>>> GetUsersPaged(
        [FromQuery] string? search,
        [FromQuery] string? role,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await _adminService.GetUsersPagedAsync(search, role, page, pageSize);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("users/{id:guid}")]
    public async Task<ActionResult<object>> DeleteUser(Guid id)
    {
        try
        {
            var adminId = GetUserId();
            if (adminId == null) return Unauthorized();

            var deleted = await _adminService.DeleteUserAsync(id, adminId.Value);
            if (!deleted) return NotFound(new { message = "User not found." });

            return Ok(new { success = true, message = "User successfully removed by administrator." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("users/{id:guid}/role")]
    public async Task<ActionResult<object>> UpdateRole(Guid id, [FromBody] UpdateRoleRequestDto request)
    {
        var updated = await _adminService.UpdateUserRoleAsync(id, request.Role);
        if (!updated) return BadRequest(new { message = "Failed to update user role. Invalid user or role name." });

        return Ok(new { success = true, message = "User role updated successfully." });
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

public record UpdateRoleRequestDto(string Role);

