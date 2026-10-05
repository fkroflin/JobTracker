using JobTracker.Domain.Enums;

namespace JobTracker.Application.Features.Applications.Dtos;

public class ApplicationDto
{
    public Guid Id { get; set; }
    public Guid CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string PositionTitle { get; set; } = string.Empty;
    public JobCategory JobCategory { get; set; }
    public ApplicationStatus Status { get; set; }
    public string? WorkModel { get; set; }
    public decimal? HourlyRateOrSalary { get; set; }
    public string? Currency { get; set; }
    public DateTime AppliedDate { get; set; }
    public string? JobUrl { get; set; }
    public string? TaskRepoUrl { get; set; }
    public string? Notes { get; set; }

    public List<string> TechTags { get; set; } = new();
}