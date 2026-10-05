using JobTracker.Application.Common.Interfaces;
using JobTracker.Application.Features.Applications.Dtos;
using JobTracker.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Application.Features.Applications.Queries;

public record GetApplicationsQuery(
    JobCategory? Category = null,
    ApplicationStatus? Status = null
) : IRequest<List<ApplicationDto>>;

public class GetApplicationsQueryHandler : IRequestHandler<GetApplicationsQuery, List<ApplicationDto>>
{
    private readonly IApplicationDbContext _context;

    public GetApplicationsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ApplicationDto>> Handle(GetApplicationsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Applications
            .Include(a => a.Company)
            .Include(a => a.TechTags)
                .ThenInclude(att => att.TechTag)
            .AsNoTracking(); //enables SELECT requests to be faster and use less memory

        if (request.Category.HasValue)
        {
            query = query.Where(a => a.JobCategory == request.Category.Value);
        }

        if (request.Status.HasValue)
        {
            query = query.Where(a => a.Status == request.Status.Value);
        }

        var applications = await query
            .OrderByDescending(a => a.AppliedDate)
            .ToListAsync(cancellationToken);

        return applications.Select(a => new ApplicationDto
        {
            Id = a.Id,
            CompanyId = a.CompanyId,
            CompanyName = a.Company?.Name ?? string.Empty,
            PositionTitle = a.PositionTitle,
            JobCategory = a.JobCategory,
            Status = a.Status,
            WorkModel = a.WorkModel,
            HourlyRateOrSalary = a.HourlyRateOrSalary,
            Currency = a.Currency,
            AppliedDate = a.AppliedDate,
            JobUrl = a.JobUrl,
            TaskRepoUrl = a.TaskRepoUrl,
            Notes = a.Notes,
            TechTags = a.TechTags.Select(t => t.TechTag.Name).ToList()
        }).ToList();
    }
}