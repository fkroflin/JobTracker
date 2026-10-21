using JobTracker.Application.Common.Interfaces;
using JobTracker.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Application.Features.DiscoveredJobs.Commands;

public record SyncDiscoveredJobsCommand(string Keyword) : IRequest<List<DiscoveredJob>>;

public class SyncDiscoveredJobsCommandHandler : IRequestHandler<SyncDiscoveredJobsCommand, List<DiscoveredJob>>
{
    private readonly IApplicationDbContext _context;
    private readonly IJobScraperService _scraperService;
    private readonly INotificationService _notificationService;

    public SyncDiscoveredJobsCommandHandler(
        IApplicationDbContext context,
        IJobScraperService scraperService,
        INotificationService notificationService)
    {
        _context = context;
        _scraperService = scraperService;
        _notificationService = notificationService;
    }

    public async Task<List<DiscoveredJob>> Handle(SyncDiscoveredJobsCommand request, CancellationToken cancellationToken)
    {
        var scrapedJobs = await _scraperService.ScrapeJobsAsync(request.Keyword, cancellationToken);
        if (scrapedJobs.Count == 0)
        {
            return new List<DiscoveredJob>();
        }

        var scrapedUrls = scrapedJobs.Select(j => j.JobUrl).ToList();
        var existingUrls = await _context.DiscoveredJobs
            .Where(j => scrapedUrls.Contains(j.JobUrl))
            .Select(j => j.JobUrl)
            .ToListAsync(cancellationToken);

        var newJobs = scrapedJobs
            .Where(j => !existingUrls.Contains(j.JobUrl))
            .ToList();

        if (newJobs.Count == 0)
        {
            return new List<DiscoveredJob>();
        }

        _context.DiscoveredJobs.AddRange(newJobs);
        await _context.SaveChangesAsync(cancellationToken);

        await SendTelegramAlertAsync(newJobs, request.Keyword, cancellationToken);

        return newJobs;
    }

    private async Task SendTelegramAlertAsync(List<DiscoveredJob> newJobs, string keyword, CancellationToken cancellationToken)
    {
        var sb = new System.Text.StringBuilder();
        sb.AppendLine($"💼 *Pronađeni novi poslovi ({newJobs.Count}) za pojam: '{keyword}'*");
        sb.AppendLine("Evo najnovijih prilika s portala:\n");

        foreach (var job in newJobs.Take(5))
        {
            sb.AppendLine($"🔹 *{job.Title}*");
            sb.AppendLine($"   📍 {job.Location}");
            sb.AppendLine($"   🔗 [Pogledaj oglas]({job.JobUrl})");
            sb.AppendLine();
        }

        if (newJobs.Count > 5)
        {
            sb.AppendLine($"_...i još {newJobs.Count - 5} novih oglasa zabilježeno u tvom JobTrackeru!_");
        }

        await _notificationService.SendNotificationAsync(sb.ToString(), cancellationToken);
    }
}