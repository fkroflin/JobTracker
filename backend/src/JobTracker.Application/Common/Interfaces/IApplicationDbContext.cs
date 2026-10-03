using JobTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using ApplicationEntity = JobTracker.Domain.Entities.Application;

namespace JobTracker.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Company> Companies { get; }
    DbSet<TechTag> TechTags { get; }
    DbSet<ApplicationEntity> Applications { get; }
    DbSet<ApplicationStage> ApplicationStages { get; }
    DbSet<ApplicationTechTag> ApplicationTechTags { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}