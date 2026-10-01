using JobTracker.Domain.Common;
using JobTracker.Domain.Enums;

namespace JobTracker.Domain.Entities;

public class Application : BaseEntity
{
    public Guid CompanyId { get; set; }
    public Company Company { get; set; } = null!;

    public string PositionTitle { get; set; } = string.Empty;
    public JobCategory JobCategory { get; set; }
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Applied;
    public string? WorkModel { get; set; } // Remote, Hybrid, OnSite
    public decimal? HourlyRateOrSalary { get; set; }
    public string? Currency { get; set; } = "EUR";
    public DateTime AppliedDate { get; set; } = DateTime.UtcNow.Date;

    // Specific fields for IT applications
    public string? JobUrl { get; set; }
    public string? TaskRepoUrl { get; set; }
    public string? Notes { get; set; }

    // Relations
    public ICollection<ApplicationStage> Stages { get; set; } = new List<ApplicationStage>();
    public ICollection<ApplicationTechTag> TechTags { get; set; } = new List<ApplicationTechTag>();
}