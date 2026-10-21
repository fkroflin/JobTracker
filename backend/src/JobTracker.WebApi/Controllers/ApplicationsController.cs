using JobTracker.Application.Features.Applications.Commands;
using JobTracker.Application.Features.Applications.Dtos;
using JobTracker.Application.Features.Applications.Queries;
using JobTracker.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using JobTracker.Application.Common.Interfaces;

namespace JobTracker.WebApi.Controllers;

public class ApplicationsController : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ApplicationDto>>> GetAll(
        [FromQuery] JobCategory? category,
        [FromQuery] ApplicationStatus? status)
    {
        var result = await Mediator.Send(new GetApplicationsQuery(category, status));
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateApplicationCommand command)
    {
        var id = await Mediator.Send(command);
        return CreatedAtAction(nameof(GetAll), new { id }, id);
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] ApplicationStatus newStatus)
    {
        var success = await Mediator.Send(new UpdateApplicationStatusCommand(id, newStatus));

        if (!success)
        {
            return NotFound();
        }

        return NoContent(); 
    }
    private readonly INotificationService _notificationService;
    private readonly IJobScraperService _scraperService;

    public ApplicationsController(INotificationService notificationService, IJobScraperService scraperService)
    {
        _notificationService = notificationService;
        _scraperService = scraperService;
    }

    //Test endpoint for scraping jobs from MojPosao
    [HttpGet("scrape")]
    public async Task<IActionResult> ScrapeJobs([FromQuery] string keyword = "junior")
    {
        var jobs = await _scraperService.ScrapeJobsAsync(keyword);
        return Ok(jobs);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await Mediator.Send(new DeleteApplicationCommand(id));
        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }

}