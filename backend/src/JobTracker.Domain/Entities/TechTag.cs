using JobTracker.Domain.Common;

namespace JobTracker.Domain.Entities;

public class TechTag : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // Backend, Frontend, Full-Stack...

    public ICollection<ApplicationTechTag> ApplicationTechTags { get; set; } = new List<ApplicationTechTag>();
}