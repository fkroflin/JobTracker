using JobTracker.Application.Common.Interfaces;
using JobTracker.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Application.Features.Applications.Commands;

// what ID is getting updated and what the new status is
public record UpdateApplicationStatusCommand(
    Guid Id,
    ApplicationStatus NewStatus
) : IRequest<bool>;

// handler for the UpdateApplicationStatusCommand
public class UpdateApplicationStatusCommandHandler : IRequestHandler<UpdateApplicationStatusCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateApplicationStatusCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateApplicationStatusCommand request, CancellationToken cancellationToken)
    {
        var application = await _context.Applications
            .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

        if (application == null)
        {
            return false; // application with the given ID was not found
        }

        application.Status = request.NewStatus;
        application.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}