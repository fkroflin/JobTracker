using JobTracker.Domain.Enums;

namespace JobTracker.Domain.Entities;

public class ApplicationTechTag
{
    public Guid ApplicationId { get; set; }
    public Application Application { get; set; } = null!;

    public Guid TechTagId { get; set; }
    public TechTag TechTag { get; set; } = null!;

    public bool IsRequired { get; set; } = true;
    public SkillLevel CandidateSkillLevel { get; set; } = SkillLevel.Familiar;
}