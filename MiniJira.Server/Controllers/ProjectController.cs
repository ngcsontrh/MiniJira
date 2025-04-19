using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniJira.Server.DTOs;
using MiniJira.Server.Entities;
using MiniJira.Server.Filters;
using MiniJira.Server.Mappers;
using MiniJira.Server.UOW;

namespace MiniJira.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProjectController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProjectController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IActionResult> GetProjects([FromQuery] ProjectFilter filter)
        {
            var (projects, total) = await _unitOfWork.ProjectRepository.GetProjectsByFilterAsync(filter);
            var result = new PageData<ProjectDTO>
            {
                Items = projects.ToDTO(),
                Total = total
            };
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProject(Guid id)
        {
            try
            {
                var project = await _unitOfWork.ProjectRepository.GetDetailAsync(id);
                return Ok(project.ToDTO());
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Project not found.");
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateProject([FromBody] ProjectDTO projectDto)
        {
            try
            {
                if (projectDto == null)
                {
                    return BadRequest("Project data is required.");
                }
                
                await _unitOfWork.BeginTransactionAsync();

                projectDto.CreatedAt = DateTime.UtcNow;
                projectDto.UpdatedAt = DateTime.UtcNow;
                var project = projectDto.ToEntity();
                var projectMembers = new List<ProjectMember>
                {
                    new ProjectMember
                    {
                        ProjectId = project.Id,
                        MemberId = project.OwnerId,
                        Role = "Owner",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                    }
                };
                projectMembers.AddRange(projectDto.MemberIds?.Select(x => new ProjectMember
                {
                    ProjectId = project.Id,
                    MemberId = x,
                    Role = "Member",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                }) ?? []);
                await _unitOfWork.ProjectRepository.AddAsync(project, false);

                await _unitOfWork.ProjectMemberRepository.AddRangeAsync(projectMembers, false);

                await _unitOfWork.CommitTransactionAsync();

                return Created();
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }            
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateProject([FromBody] ProjectDTO projectDto)
        {
            if (projectDto == null)
            {
                return BadRequest("Project data is required.");
            }

            projectDto.UpdatedAt = DateTime.UtcNow;
            var project = projectDto.ToEntity();

            await _unitOfWork.ProjectRepository.UpdateAsync(project);

            return NoContent();
        }       
    }
}
