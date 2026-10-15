using System.Net;
using System.Xml.Linq;
using JobTracker.Application.Common.Interfaces;
using JobTracker.Domain.Entities;
using JobTracker.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace JobTracker.Infrastructure.Services;

public class MojPosaoScraperService : IJobScraperService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<MojPosaoScraperService> _logger;

    public MojPosaoScraperService(HttpClient httpClient, ILogger<MojPosaoScraperService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;

        if (!_httpClient.DefaultRequestHeaders.Contains("User-Agent"))
        {
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "JobTrackerApp/1.0");
        }
    }

        public async Task<List<DiscoveredJob>> ScrapeJobsAsync(string keyword, CancellationToken cancellationToken = default)
    {
        var discoveredJobs = new List<DiscoveredJob>();

        var hasKeyword = !string.IsNullOrWhiteSpace(keyword) && !keyword.Equals("all", StringComparison.OrdinalIgnoreCase);
        var encodedKeyword = hasKeyword ? WebUtility.UrlEncode(keyword) : string.Empty;

        var url = hasKeyword
            ? $"https://mojposao.hr/pretraga-poslova?query={encodedKeyword}&sortBy=adtype"
            : "https://mojposao.hr/pretraga-poslova?sortBy=adtype";

        try
        {
            _logger.LogInformation("Pokrećem scraping s mojposao.hr za query='{Keyword}': {Url}", keyword, url);

            var html = await _httpClient.GetStringAsync(url, cancellationToken);
            var doc = new HtmlAgilityPack.HtmlDocument();
            doc.LoadHtml(html);

            var jobLinks = doc.DocumentNode.SelectNodes("//a[contains(@href, '/posao/') or contains(@href, '/oglas/')]");

            if (jobLinks == null || jobLinks.Count == 0)
            {
                jobLinks = doc.DocumentNode.SelectNodes("//article//a | //div[contains(@class, 'job')]//a");
            }

            if (jobLinks == null || jobLinks.Count == 0)
            {
                _logger.LogInformation("Nema rezultata za pojam '{Keyword}'.", keyword);
                return discoveredJobs;
            }

            var seenUrls = new HashSet<string>();

            foreach (var link in jobLinks)
            {
                var title = WebUtility.HtmlDecode(link.InnerText.Trim());
                var href = link.GetAttributeValue("href", string.Empty);

                title = System.Text.RegularExpressions.Regex.Replace(title, @"\s+", " ");

                if (string.IsNullOrWhiteSpace(title) || title.Length < 4 || 
                    href.Contains("#") || href.Contains("prijava") || seenUrls.Contains(href))
                {
                    continue;
                }

                var fullUrl = href.StartsWith("http") ? href : $"https://mojposao.hr{href}";
                seenUrls.Add(href);

                var isIt = keyword.Contains(".net", StringComparison.OrdinalIgnoreCase) ||
                           keyword.Contains("c#", StringComparison.OrdinalIgnoreCase) ||
                           keyword.Contains("react", StringComparison.OrdinalIgnoreCase) ||
                           keyword.Contains("developer", StringComparison.OrdinalIgnoreCase) ||
                           keyword.Contains("programer", StringComparison.OrdinalIgnoreCase) ||
                           title.Contains("developer", StringComparison.OrdinalIgnoreCase) ||
                           title.Contains("programer", StringComparison.OrdinalIgnoreCase) ||
                           title.Contains("software", StringComparison.OrdinalIgnoreCase);

                discoveredJobs.Add(new DiscoveredJob
                {
                    Id = Guid.NewGuid(),
                    Title = title,
                    CompanyName = "mojposao.hr oglas",
                    Location = "Osijek / Zagreb / Remote",
                    JobUrl = fullUrl,
                    Source = "mojposao.hr",
                    JobCategory = isIt ? JobCategory.IT : JobCategory.General,
                    PublishedDate = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow,
                });

                if (discoveredJobs.Count >= 15) break;
            }

            _logger.LogInformation("Pronađeno {Count} oglasa za '{Keyword}'.", discoveredJobs.Count, keyword);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Greška prilikom scrapanja na mojposao.hr.");
        }

        return discoveredJobs;
    }
}