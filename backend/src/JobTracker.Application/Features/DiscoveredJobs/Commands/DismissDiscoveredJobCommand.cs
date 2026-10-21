using JobTracker.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Application.Features.DiscoveredJobs.Commands;

public record DismissDiscoveredJobCommand(Guid DiscoveredJobId) : IRequest<bool>;

public class DismissDiscoveredJobCommandHandler : IRequestHandler<DismissDiscoveredJobCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DismissDiscoveredJobCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DismissDiscoveredJobCommand request, CancellationToken cancellationToken)
    {
        var job = await _context.DiscoveredJobs
            .FirstOrDefaultAsync(j => j.Id == request.DiscoveredJobId, cancellationToken);

        if (job == null) return false;

        job.IsDismissed = true;
        job.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}