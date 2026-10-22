using System.Net;
using System.Text.RegularExpressions;
using HtmlAgilityPack;
using JobTracker.Application.Common.Interfaces;
using JobTracker.Domain.Entities;
using JobTracker.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace JobTracker.Infrastructure.Services;

public class StudentskiPosloviScraperService : IJobScraperService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<StudentskiPosloviScraperService> _logger;

    public StudentskiPosloviScraperService(HttpClient httpClient, ILogger<StudentskiPosloviScraperService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;

        if (!_httpClient.DefaultRequestHeaders.Contains("User-Agent"))
        {
            _httpClient.DefaultRequestHeaders.Add("User-Agent", 
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
        }
    }

    public async Task<List<DiscoveredJob>> ScrapeJobsAsync(string keyword, CancellationToken cancellationToken = default)
    {
        var discoveredJobs = new List<DiscoveredJob>();

        var url = "https://studentski-poslovi.hr/pretraga?category=sve-kategorije&location=38&radius=10&activated_from=all&min_hour_rate=";

        try
        {
            _logger.LogInformation("Pokrećem scraping s portala studentski-poslovi.hr za Osijek: {Url}", url);

            var html = await _httpClient.GetStringAsync(url, cancellationToken);
            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            var jobLinks = doc.DocumentNode.SelectNodes("//a[contains(@href, '/posao/')]")
                        ?? doc.DocumentNode.SelectNodes("//div[contains(@class, 'job')]//a")
                        ?? doc.DocumentNode.SelectNodes("//article//a");

            if (jobLinks == null || jobLinks.Count == 0)
            {
                _logger.LogInformation("Nema pronađenih oglasa na studentski-poslovi.hr.");
                return discoveredJobs;
            }

            var seenUrls = new HashSet<string>();

            foreach (var link in jobLinks)
            {
                var title = WebUtility.HtmlDecode(link.InnerText.Trim());
                var href = link.GetAttributeValue("href", string.Empty);

                title = Regex.Replace(title, @"\s+", " ");

                if (string.IsNullOrWhiteSpace(title) || title.Length < 4 || href.Contains("#") || seenUrls.Contains(href))
                {
                    continue;
                }

                var isBroadSearch = string.IsNullOrWhiteSpace(keyword) || 
                                    keyword.Equals("all", StringComparison.OrdinalIgnoreCase) || 
                                    keyword.Equals("student", StringComparison.OrdinalIgnoreCase);

                if (!isBroadSearch && !title.Contains(keyword, StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                var fullUrl = href.StartsWith("http") ? href : $"https://studentski-poslovi.hr{href}";
                seenUrls.Add(href);

                discoveredJobs.Add(new DiscoveredJob
                {
                    Id = Guid.NewGuid(),
                    Title = title,
                    CompanyName = "Studentski poslodavac",
                    Location = "Osijek",
                    JobUrl = fullUrl,
                    Source = "studentski-poslovi.hr",
                    JobCategory = JobCategory.General,
                    PublishedDate = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow,
                });

                if (discoveredJobs.Count >= 25) break;
            }

            _logger.LogInformation("Pronađeno {Count} studentskih poslova u Osijeku.", discoveredJobs.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Greška prilikom scrapanja sa studentski-poslovi.hr.");
        }

        return discoveredJobs;
    }
}