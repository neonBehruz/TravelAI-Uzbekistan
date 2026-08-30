using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SafarAi.Core.DTOs;
using SafarAi.Core.Interfaces;
using SafarAi.Infrastructure.Data;

namespace SafarAi.Services.Background;

public class ScheduledMaintenanceService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<ScheduledMaintenanceService> _logger;

    public ScheduledMaintenanceService(
        IServiceProvider serviceProvider,
        ILogger<ScheduledMaintenanceService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("⏰ Safar AI Scheduled Tasks & Maintenance Worker started.");

        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(30)); // Runs every 30 seconds for live signals and maintenance

        while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken))
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var signalR = scope.ServiceProvider.GetService<ISignalRNotificationService>();

                // 1. Purge expired or revoked refresh tokens older than 7 days
                var expiredCutoff = DateTime.UtcNow.AddDays(-7);
                var staleTokens = await dbContext.RefreshTokens
                    .Where(r => r.IsRevoked || r.ExpiresAt < expiredCutoff)
                    .ToListAsync(stoppingToken);

                if (staleTokens.Count > 0)
                {
                    dbContext.RefreshTokens.RemoveRange(staleTokens);
                    await dbContext.SaveChangesAsync(stoppingToken);
                    _logger.LogInformation("🧹 [Scheduled Task] Purged {Count} expired/revoked refresh tokens.", staleTokens.Count);
                }

                // 2. Broadcast Live Tourist signal to all connected SignalR clients
                if (signalR != null)
                {
                    var userCount = await dbContext.Users.CountAsync(stoppingToken);
                    var randomExtra = Random.Shared.Next(15, 60);
                    var activeCount = Math.Max(userCount * 4 + randomExtra, 42);

                    var actions = new[]
                    {
                        "Tourist generated 3-day Samarkand AI Plan",
                        "Scanned Sher-Dor Madrasah via AI Camera",
                        "Afrosiyob fast train booking inquiry checked",
                        "Plov Center Samarkand live navigation active",
                        "Voice translator used (English -> Uzbek)",
                        "Registan square audio guide playback started"
                    };
                    var selectedAction = actions[Random.Shared.Next(actions.Length)];

                    await signalR.BroadcastLiveStatsAsync(new LiveTouristSignalDto(
                        ActiveTouristsCount: activeCount,
                        City: "Samarkand",
                        Action: selectedAction,
                        Timestamp: DateTime.UtcNow
                    ));
                }
            }
            catch (Exception ex) when (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogError(ex, "Error occurred during scheduled maintenance execution.");
            }
        }
    }
}
