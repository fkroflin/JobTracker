using System.Reflection;
using Microsoft.Extensions.DependencyInjection;

namespace JobTracker.Application;

public static class ApplicationServiceRegistration
{
    public static IServiceCollection AddJobTrackerApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

        return services;
    }
}