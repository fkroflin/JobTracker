using System.Reflection;
using JobTracker.Application.Common.Interfaces;
using JobTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using ApplicationEntity = JobTracker.Domain.Entities.Application;


namespace JobTracker.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Company> Companies => Set<Company>();
    public DbSet<TechTag> TechTags => Set<TechTag>();
    public DbSet<ApplicationEntity> Applications => Set<ApplicationEntity>();
    public DbSet<ApplicationStage> ApplicationStages => Set<ApplicationStage>();
    public DbSet<ApplicationTechTag> ApplicationTechTags => Set<ApplicationTechTag>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}