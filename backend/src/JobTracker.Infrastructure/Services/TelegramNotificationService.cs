using System.Text;
using System.Text.Json;
using JobTracker.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace JobTracker.Infrastructure.Services;

public class TelegramNotificationService : INotificationService
{
    private readonly HttpClient _httpClient;
    private readonly string? _botToken;
    private readonly string? _chatId;
    private readonly ILogger<TelegramNotificationService> _logger;

    public TelegramNotificationService(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<TelegramNotificationService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
        _botToken = configuration["Telegram:BotToken"];
        _chatId = configuration["Telegram:ChatId"];
    }

    public async Task SendNotificationAsync(string message, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_botToken) || string.IsNullOrWhiteSpace(_chatId))
        {
            _logger.LogWarning("Telegram BotToken ili ChatId nisu konfigurirani u appsettings.json. Poruka nije poslana.");
            return;
        }

        try
        {
            var url = $"https://api.telegram.org/bot{_botToken}/sendMessage";

            var payload = new
            {
                chat_id = _chatId,
                text = message,
                parse_mode = "Markdown"
            };

            var content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PostAsync(url, content, cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Telegram notifikacija uspješno poslana.");
            }
            else
            {
                var error = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogError("Greška pri slanju Telegram poruke: {Error}", error);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Iznimka pri slanju Telegram notifikacije.");
        }
    }
}