using JobTracker.Domain.Common;
using JobTracker.Domain.Enums;

namespace JobTracker.Domain.Entities;

public class ApplicationStage : BaseEntity
{
    public Guid ApplicationId { get; set; }
    public Application Application { get; set; } = null!;

    public int OrderIndex { get; set; }
    public string StageName { get; set; } = string.Empty; // i.e. "HR Screen", "Techincal task"
    public DateTime? ScheduledAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public StageStatus Status { get; set; } = StageStatus.Pending;
    public string? MeetingLink { get; set; }
    public string? Notes { get; set; }
}