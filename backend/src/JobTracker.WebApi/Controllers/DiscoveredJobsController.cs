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
}