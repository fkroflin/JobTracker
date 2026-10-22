using JobTracker.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Application.Features.Applications.Commands;

public record UpdateApplicationNotesCommand(
    Guid Id,
    string? Notes,
    string? WorkModel,
    decimal? HourlyRateOrSalary
) : IRequest<bool>;

public class UpdateApplicationNotesCommandHandler : IRequestHandler<UpdateApplicationNotesCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateApplicationNotesCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateApplicationNotesCommand request, CancellationToken cancellationToken)
    {
        var application = await _context.Applications
            .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

        if (application == null)
        {
            return false;
        }

        application.Notes = request.Notes;
        if (!string.IsNullOrWhiteSpace(request.WorkModel))
        {
            application.WorkModel = request.WorkModel;
        }
        application.HourlyRateOrSalary = request.HourlyRateOrSalary;
        application.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
