using JobTracker.Application.Common.Interfaces;
using JobTracker.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Application.Features.DiscoveredJobs.Queries;

public record GetDiscoveredJobsQuery : IRequest<List<DiscoveredJob>>;

public class GetDiscoveredJobsQueryHandler : IRequestHandler<GetDiscoveredJobsQuery, List<DiscoveredJob>>
{
    private readonly IApplicationDbContext _context;

    public GetDiscoveredJobsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<DiscoveredJob>> Handle(GetDiscoveredJobsQuery request, CancellationToken cancellationToken)
    {
        return await _context.DiscoveredJobs
            .Where(j => !j.IsDismissed && !j.IsConvertedToApplication)
            .OrderByDescending(j => j.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}