using JobTracker.Application.Common.Interfaces;
using JobTracker.Domain.Entities;
using JobTracker.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

using ApplicationEntity = JobTracker.Domain.Entities.Application;

namespace JobTracker.Application.Features.Applications.Commands;

public record CreateApplicationCommand(
    string CompanyName,
    string PositionTitle,
    JobCategory JobCategory,
    string? WorkModel = null,
    decimal? HourlyRateOrSalary = null,
    string? Currency = "EUR",
    DateTime? AppliedDate = null,
    string? JobUrl = null,
    string? TaskRepoUrl = null,
    string? Notes = null,
    List<string>? TechTagNames = null
) : IRequest<Guid>;

public class CreateApplicationCommandHandler : IRequestHandler<CreateApplicationCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateApplicationCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateApplicationCommand request, CancellationToken cancellationToken)
    {
        var trimmedCompanyName = request.CompanyName.Trim();
        var company = await _context.Companies
            .FirstOrDefaultAsync(c => c.Name.ToLower() == trimmedCompanyName.ToLower(), cancellationToken);

        if (company == null)
        {
            company = new Company { Name = trimmedCompanyName };
            _context.Companies.Add(company);
        }

        var application = new ApplicationEntity
        {
            Company = company,
            PositionTitle = request.PositionTitle.Trim(),
            JobCategory = request.JobCategory,
            WorkModel = request.WorkModel,
            HourlyRateOrSalary = request.HourlyRateOrSalary,
            Currency = request.Currency ?? "EUR",
            AppliedDate = request.AppliedDate ?? DateTime.UtcNow.Date,
            JobUrl = request.JobUrl,
            TaskRepoUrl = request.TaskRepoUrl,
            Notes = request.Notes,
            Status = ApplicationStatus.Applied
        };

        if (request.TechTagNames != null && request.TechTagNames.Count > 0)
        {
            foreach (var rawTagName in request.TechTagNames.Distinct())
            {
                var tagName = rawTagName.Trim();
                if (string.IsNullOrWhiteSpace(tagName)) continue;

                var existingTag = await _context.TechTags
                    .FirstOrDefaultAsync(t => t.Name.ToLower() == tagName.ToLower(), cancellationToken);

                if (existingTag == null)
                {
                    existingTag = new TechTag { Name = tagName, Category = "General" };
                    _context.TechTags.Add(existingTag);
                }

                application.TechTags.Add(new ApplicationTechTag
                {
                    Application = application,
                    TechTag = existingTag,
                    IsRequired = true,
                    CandidateSkillLevel = SkillLevel.Familiar
                });
            }
        }

        _context.Applications.Add(application);
        await _context.SaveChangesAsync(cancellationToken);

        return application.Id;
    }
}