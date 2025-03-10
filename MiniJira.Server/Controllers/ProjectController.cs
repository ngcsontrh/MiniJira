using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniJira.Server.Data;
using MiniJira.Server.Entities;
using MiniJira.Server.Models;

namespace MiniJira.Server.Controllers
{
    [Route("api/projects")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ProjectController> _logger;

        public ProjectController(AppDbContext context, ILogger<ProjectController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IResult> GetAsync(int memberId)
        {
            try
            {
                var project = await _context.Projects
                    .Include(p => p.ProjectMembers)
                    .Include(p => p.Creator)
                    .Where(p => p.ProjectMembers.Any(pm => pm.MemberId == memberId))
                    .Select(p => new ProjectData
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description,
                        Code = p.Code,
                        CreatedAt = p.CreatedAt,
                        UpdatedAt = p.UpdatedAt,
                        CreatorId = p.CreatorId,
                        CreatorName = p.Creator.FullName,
                    })
                    .ToListAsync();

                return Results.Ok(project);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                throw;
            }
        }

        [HttpPost]
        public async Task<IResult> AddAsync(ProjectData projectData)
        {
            try
            {
                var project = new Project
                {
                    Name = projectData.Name!,
                    Description = projectData.Description,
                    Code = projectData.Code!,
                    CreatorId = projectData.CreatorId!.Value,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,                    
                };

                await _context.Projects.AddAsync(project);
                await _context.SaveChangesAsync();

                return Results.Created();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                throw;
            }
        }

        [HttpPut("{id}")]
        public async Task<IResult> UpdateAsync(int id, ProjectData projectData)
        {
            try
            {
                var project = await _context.Projects.FindAsync(id);

                if (project == null)
                {
                    return Results.NotFound();
                }

                project.Name = projectData.Name!;
                project.Description = projectData.Description;
                project.UpdatedAt = DateTime.Now;

                await _context.SaveChangesAsync();

                return Results.Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                throw;
            }
        }
    }
}
