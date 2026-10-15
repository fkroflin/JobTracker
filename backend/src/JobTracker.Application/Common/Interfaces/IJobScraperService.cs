using JobTracker.Domain.Entities;

namespace JobTracker.Application.Common.Interfaces;

public interface IJobScraperService
{
    Task<List<DiscoveredJob>> ScrapeJobsAsync(string keyword, CancellationToken cancellationToken = default);
}