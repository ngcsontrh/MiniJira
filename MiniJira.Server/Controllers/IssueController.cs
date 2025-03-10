using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniJira.Server.Data;
using MiniJira.Server.Entities;
using MiniJira.Server.Models;

namespace MiniJira.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IssueController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<IssueController> _logger;

        public IssueController(AppDbContext context, ILogger<IssueController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IResult> GetAsync(int projectId)
        {
            try
            {
                var issues = await _context.Issues
                    .Where(i => i.ProjectId == projectId)
                    .Include(i => i.Assignee)
                    .Include(i => i.Reporter)
                    .Select(i => new IssueData
                    {
                        Id = i.Id,
                        ProjectId = i.ProjectId,
                        ProjectName = i.Project.Name,
                        Title = i.Title,
                        Description = i.Description,
                        Priority = i.Priority,
                        Status = i.Status,
                        AssigneeId = i.AssigneeId,
                        AssigneeName = i.Assignee != null ? i.Assignee.FullName : null,
                        ReporterId = i.ReporterId,
                        ReporterName = i.Reporter.FullName,
                        CreatedAt = i.CreatedAt,
                        UpdatedAt = i.UpdatedAt,
                        Frequency = i.Frequency,
                        FilePaths = i.FilePaths,
                    })
                    .ToListAsync();

                return Results.Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                throw;
            }
        }

        [HttpPost]
        public async Task<IResult> AddAsync(IssueData issueData)
        {
            try
            {
                var issue = new Issue
                {
                    Title = issueData.Title!,
                    Description = issueData.Description,
                    Status = issueData.Status,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    ProjectId = issueData.ProjectId!.Value,
                    ReporterId = issueData.ReporterId!.Value,
                    AssigneeId = issueData.AssigneeId,
                    Frequency = issueData.Frequency,
                    Priority = issueData.Priority,
                    FilePaths = issueData.FilePaths,
                };

                await _context.Issues.AddAsync(issue);
                await _context.SaveChangesAsync();

                return Results.Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                throw;
            }
        }

        [HttpPut]
        public async Task<IResult> UpdateAsync([FromQuery] int id, [FromBody] IssueData issueData)
        {
            try
            {
                var issue = await _context.Issues.FindAsync(id);
                if (issue == null)
                {
                    return Results.NotFound();
                }
                issue.Title = issueData.Title!;
                issue.Description = issueData.Description;
                issue.Status = issueData.Status;
                issue.UpdatedAt = DateTime.Now;
                issue.ProjectId = issueData.ProjectId!.Value;
                issue.AssigneeId = issueData.AssigneeId;
                issue.Frequency = issueData.Frequency;
                issue.Priority = issueData.Priority;
                issue.FilePaths = issueData.FilePaths;
                
                _context.Issues.Update(issue);
                await _context.SaveChangesAsync();
                return Results.NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                throw;
            }
        }
    }
}
