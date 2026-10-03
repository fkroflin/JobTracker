using JobTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JobTracker.Infrastructure.Persistence.Configurations;

public class ApplicationTechTagConfiguration : IEntityTypeConfiguration<ApplicationTechTag>
{
    public void Configure(EntityTypeBuilder<ApplicationTechTag> builder)
    {
        builder.HasKey(att => new { att.ApplicationId, att.TechTagId });

        builder.HasOne(att => att.Application)
            .WithMany(a => a.TechTags)
            .HasForeignKey(att => att.ApplicationId)
            .OnDelete(DeleteBehavior.Cascade); 

        builder.HasOne(att => att.TechTag)
            .WithMany(t => t.ApplicationTechTags)
            .HasForeignKey(att => att.TechTagId)
            .OnDelete(DeleteBehavior.Restrict); 
    }
}