using JobTracker.Domain.Common;
using JobTracker.Domain.Enums;

namespace JobTracker.Domain.Entities;

public class DiscoveredJob : BaseEntity
{
    public string Title { get; set; } = string.Empty;

    public string CompanyName { get; set; } = string.Empty;

    public string Location { get; set; } = string.Empty;

    public string JobUrl { get; set; } = string.Empty;

    public string Source { get; set; } = string.Empty;

    public JobCategory JobCategory { get; set; } = JobCategory.General;

    // Datum objave ili pronalaska oglasa
    public DateTime PublishedDate { get; set; } = DateTime.UtcNow;

    public bool IsConvertedToApplication { get; set; } = false;

    public bool IsDismissed { get; set; } = false;
}