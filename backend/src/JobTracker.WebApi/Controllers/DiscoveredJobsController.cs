using JobTracker.Application.Features.DiscoveredJobs.Commands;
using JobTracker.Application.Features.DiscoveredJobs.Queries;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.WebApi.Controllers;

public class DiscoveredJobsController : ApiControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetDiscoveredJobs()
    {
        var result = await Mediator.Send(new GetDiscoveredJobsQuery());
        return Ok(result);
    }

    [HttpPost("sync")]
    public async Task<IActionResult> SyncJobs([FromQuery] string keyword = "developer")
    {
        var newJobs = await Mediator.Send(new SyncDiscoveredJobsCommand(keyword));
        return Ok(new
        {
            message = $"Sinkronizacija završena. Dodano novih poslova: {newJobs.Count}",
            newJobsCount = newJobs.Count,
            jobs = newJobs
        });
    }

    [HttpPost("{id:guid}/convert")]
    public async Task<IActionResult> ConvertToApplication(Guid id)
    {
        var applicationId = await Mediator.Send(new ConvertJobToApplicationCommand(id));
        return Ok(new { applicationId });
    }

    [HttpPost("{id:guid}/dismiss")]
    public async Task<IActionResult> Dismiss(Guid id)
    {
        var success = await Mediator.Send(new DismissDiscoveredJobCommand(id));
        if (!success) return NotFound();
        return NoContent();
    }
}