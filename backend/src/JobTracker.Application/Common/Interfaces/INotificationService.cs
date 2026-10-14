namespace JobTracker.Application.Common.Interfaces;

public interface INotificationService
{
    Task SendNotificationAsync(string message, CancellationToken cancellationToken = default);
}