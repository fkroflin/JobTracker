using JobTracker.Application.Common.Interfaces;
using JobTracker.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace JobTracker.Infrastructure.BackgroundServices;

public class ApplicationFollowUpWorker : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<ApplicationFollowUpWorker> _logger;

    private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(2);

    public ApplicationFollowUpWorker(
        IServiceProvider serviceProvider,
        ILogger<ApplicationFollowUpWorker> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("ApplicationFollowUpWorker pokrenut. Provjera svakih {Interval}.", _checkInterval);

        using var timer = new PeriodicTimer(_checkInterval);

        while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken))
        {
            try
            {
                await CheckFollowUpsAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Greška u izvođenju ApplicationFollowUpWorker pozadinskog zadatka.");
            }
        }
    }

    private async Task CheckFollowUpsAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Provjeravam prijave koje čekaju odgovor...");

        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();
        var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

        var thresholdDate = DateTime.UtcNow.AddDays(-7);

        var staleApplications = await context.Applications
            .Include(a => a.Company)
            .Where(a => (a.Status == ApplicationStatus.Applied || a.Status == ApplicationStatus.InReview)
                     && a.AppliedDate <= thresholdDate)
            .ToListAsync(cancellationToken);

        if (staleApplications.Count > 0)
        {
            _logger.LogInformation("Pronađeno {Count} prijava za follow-up podsjetnik.", staleApplications.Count);

            var messageBuilder = new System.Text.StringBuilder();
            messageBuilder.AppendLine("🔔 *JobTracker Podsjetnik za Follow-up*");
            messageBuilder.AppendLine("Sljedeće prijave čekaju odgovor više od 7 dana:\n");

            foreach (var app in staleApplications)
            {
                var daysAgo = (int)(DateTime.UtcNow - app.AppliedDate).TotalDays;
                messageBuilder.AppendLine($"🏢 *{app.Company.Name}* — {app.PositionTitle}");
                messageBuilder.AppendLine($"   📅 Prijavljeno prije {daysAgo} dana ({app.AppliedDate:dd.MM.yyyy})");
                messageBuilder.AppendLine();
            }

            messageBuilder.AppendLine("💡 _Savjet: Pošalji kratki e-mail i provjeri status selekcijskog postupka!_");

            await notificationService.SendNotificationAsync(messageBuilder.ToString(), cancellationToken);
        }
        else
        {
            _logger.LogInformation("Nema prijava koje zahtijevaju podsjetnik.");
        }
    }
}