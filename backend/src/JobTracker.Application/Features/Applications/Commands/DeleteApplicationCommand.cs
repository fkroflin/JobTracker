using JobTracker.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Application.Features.Applications.Commands;

public record DeleteApplicationCommand(Guid Id) : IRequest<bool>;

public class DeleteApplicationCommandHandler : IRequestHandler<DeleteApplicationCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteApplicationCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteApplicationCommand request, CancellationToken cancellationToken)
    {
        var application = await _context.Applications
            .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

        if (application == null)
        {
            return false;
        }

        _context.Applications.Remove(application);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}