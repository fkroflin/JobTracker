using JobTracker.Application.Common.Interfaces;
using JobTracker.Infrastructure.BackgroundServices;
using JobTracker.Infrastructure.Persistence;
using JobTracker.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace JobTracker.Infrastructure;

public static class InfrastructureServiceRegistration
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IApplicationDbContext>(provider =>
            provider.GetRequiredService<ApplicationDbContext>());

        services.AddHttpClient<INotificationService, TelegramNotificationService>();
        services.AddHostedService<ApplicationFollowUpWorker>();
        services.AddHttpClient<IJobScraperService, MojPosaoScraperService>();

        return services;
    }
}