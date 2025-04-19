using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniJira.Server.DTOs;
using MiniJira.Server.Entities;
using MiniJira.Server.Mappers;
using MiniJira.Server.UOW;

namespace MiniJira.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProjectMemberController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProjectMemberController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IActionResult> GetProjectMembers([FromQuery] Guid projectId)
        {
            var members = await _unitOfWork.ProjectMemberRepository.GetProjectMembersByProjectIdAsync(projectId);
            return Ok(members.ToDTO());
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddProjectMember([FromBody] ProjectMemberDTO memberDto)
        {
            if (memberDto == null)
            {
                return BadRequest("Member data is required.");
            }

            var member = memberDto.ToEntity();
            member.CreatedAt = DateTime.UtcNow;
            member.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.ProjectMemberRepository.AddAsync(member);

            return Created();
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateProjectMember([FromBody] ProjectMemberDTO memberDto)
        {
            if (memberDto == null)
            {
                return BadRequest("Member data is required.");
            }

            try
            {
                var member = await _unitOfWork.ProjectMemberRepository.GetByIdAsync(memberDto.Id!.Value);
                
                member.Role = memberDto.Role!;
                member.UpdatedAt = DateTime.UtcNow;

                await _unitOfWork.ProjectMemberRepository.UpdateAsync(member);

                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Project member not found.");
            }
        }

        [HttpPost("remove")]
        public async Task<IActionResult> RemoveProjectMember([FromBody] ProjectMemberDTO memberDto)
        {
            if (memberDto == null || memberDto.Id == Guid.Empty)
            {
                return BadRequest("Member ID is required.");
            }

            try
            {
                await _unitOfWork.ProjectMemberRepository.ExecuteDeleteAsync(memberDto.Id!.Value);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Project member not found.");
            }
        }
    }
}
