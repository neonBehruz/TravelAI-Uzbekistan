using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using SafarAi.Core.DTOs;
using SafarAi.Core.Interfaces;

namespace SafarAi.Services.Hubs;

public class SafarHub : Hub
{
    private readonly ILogger<SafarHub> _logger;

    public SafarHub(ILogger<SafarHub> logger)
    {
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        _logger.LogInformation("SignalR client connected: {ConnectionId}", Context.ConnectionId);
        await Clients.Caller.SendAsync("ConnectedConfirmation", new { ConnectionId = Context.ConnectionId, ServerTime = DateTime.UtcNow });
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _logger.LogInformation("SignalR client disconnected: {ConnectionId}", Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinCityGroup(string city)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"City_{city}");
    }

    public async Task LeaveCityGroup(string city)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"City_{city}");
    }
}

public class SignalRNotificationService : ISignalRNotificationService
{
    private readonly IHubContext<SafarHub> _hubContext;
    private readonly ILogger<SignalRNotificationService> _logger;

    public SignalRNotificationService(
        IHubContext<SafarHub> hubContext,
        ILogger<SignalRNotificationService> logger)
    {
        _hubContext = hubContext;
        _logger = logger;
    }

    public async Task BroadcastLiveStatsAsync(LiveTouristSignalDto signal)
    {
        try
        {
            await _hubContext.Clients.All.SendAsync("LiveStatsUpdate", signal);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to broadcast SignalR live stats.");
        }
    }

    public async Task BroadcastSystemAlertAsync(string title, string message, string alertType)
    {
        try
        {
            await _hubContext.Clients.All.SendAsync("SystemAlert", new { Title = title, Message = message, Type = alertType, Timestamp = DateTime.UtcNow });
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to broadcast SignalR system alert.");
        }
    }
}
