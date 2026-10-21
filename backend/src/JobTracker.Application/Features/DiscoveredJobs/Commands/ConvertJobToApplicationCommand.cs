using JobTracker.Application.Common.Interfaces;
using JobTracker.Domain.Entities;
using JobTracker.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ApplicationEntity = JobTracker.Domain.Entities.Application;

namespace JobTracker.Application.Features.DiscoveredJobs.Commands;

public record ConvertJobToApplicationCommand(Guid DiscoveredJobId) : IRequest<Guid>;

public class ConvertJobToApplicationCommandHandler : IRequestHandler<ConvertJobToApplicationCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public ConvertJobToApplicationCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(ConvertJobToApplicationCommand request, CancellationToken cancellationToken)
    {
        var discoveredJob = await _context.DiscoveredJobs
            .FirstOrDefaultAsync(j => j.Id == request.DiscoveredJobId, cancellationToken);

        if (discoveredJob == null)
        {
            throw new KeyNotFoundException("Pronađeni posao nije pronađen.");
        }

        var company = await _context.Companies
            .FirstOrDefaultAsync(c => c.Name.ToLower() == discoveredJob.CompanyName.ToLower(), cancellationToken);

        if (company == null)
        {
            company = new Company
            {
                Id = Guid.NewGuid(),
                Name = string.IsNullOrWhiteSpace(discoveredJob.CompanyName) ? "Nepoznata tvrtka" : discoveredJob.CompanyName,
                Location = discoveredJob.Location,
                CreatedAt = DateTime.UtcNow
            };
            _context.Companies.Add(company);
        }

        var application = new ApplicationEntity
        {
            Id = Guid.NewGuid(),
            CompanyId = company.Id,
            Company = company,
            PositionTitle = discoveredJob.Title,
            JobCategory = discoveredJob.JobCategory,
            Status = ApplicationStatus.Applied,
            WorkModel = discoveredJob.Location.Contains("Remote", StringComparison.OrdinalIgnoreCase) ? "Remote" : "OnSite",
            AppliedDate = DateTime.UtcNow,
            JobUrl = discoveredJob.JobUrl,
            Notes = $"Automatski uvezeno iz izvora: {discoveredJob.Source}",
            CreatedAt = DateTime.UtcNow
        };

        _context.Applications.Add(application);

        discoveredJob.IsConvertedToApplication = true;
        discoveredJob.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return application.Id;
    }
}