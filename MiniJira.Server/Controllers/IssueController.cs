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
    public class IssueController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public IssueController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IActionResult> GetIssues([FromQuery] IssueFilter filter)
        {
            var (issues, total) = await _unitOfWork.IssueRepository.GetIssuesByFilterAsync(filter);

            var result = new PageData<IssueDTO>
            {
                Items = issues.ToDTO(),
                Total = total
            };

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetIssueById(Guid id)
        {
            try
            {
                var issue = await _unitOfWork.IssueRepository.GetDetailAsync(id);
                var issueAttachments = await _unitOfWork.AttachmentRepository.GetAttachmentsByIssueIdAsync(id);
                var issueDTO = issue.ToDTO();
                issueDTO.AttachmentIds = issueAttachments.Select(a => a.Id).ToList();
                issueDTO.AttachmentUrls = issueAttachments.Select(a => a.FilePath).ToList();
                return Ok(issueDTO);
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Issue not found.");
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateIssue([FromBody] IssueDTO issueDto)
        {
            try
            {
                if (issueDto == null)
                {
                    return BadRequest("Issue data is required.");
                }
                await _unitOfWork.BeginTransactionAsync();

                var issue = issueDto.ToEntity();
                issue.CreatedAt = DateTime.UtcNow;
                issue.UpdatedAt = DateTime.UtcNow;

                var issueAttachments = issueDto.AttachmentIds?.Select(x => new IssueAttachment
                {
                    IssueId = issue.Id,
                    AttachmentId = x
                }) ?? new List<IssueAttachment>();

                await _unitOfWork.IssueAttachmentRepository.AddRangeAsync(issueAttachments, false);
                await _unitOfWork.IssueRepository.AddAsync(issue, false);
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
        public async Task<IActionResult> UpdateIssue([FromBody] IssueDTO issueDto)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync();
                if (issueDto == null)
                {
                    return BadRequest("Issue data is required.");
                }

                var issue = issueDto.ToEntity();
                issue.UpdatedAt = DateTime.UtcNow;

                await _unitOfWork.IssueRepository.UpdateAsync(issue, false);
                await _unitOfWork.IssueAttachmentRepository.DeleteByIssueIdAsync(issue.Id);
                await _unitOfWork.IssueAttachmentRepository.AddRangeAsync(issueDto.AttachmentIds?.Select(x => new IssueAttachment
                {
                    IssueId = issue.Id,
                    AttachmentId = x
                }) ?? new List<IssueAttachment>(), false);
                await _unitOfWork.CommitTransactionAsync();
                return NoContent();
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }            
        }

        [HttpPost("delete")]
        public async Task<IActionResult> DeleteIssue([FromBody] IssueDTO issueDto)
        {
            if (issueDto == null || issueDto.Id == Guid.Empty)
            {
                return BadRequest("Issue ID is required.");
            }

            try
            {
                await _unitOfWork.BeginTransactionAsync();

                // Delete comments
                await _unitOfWork.CommentRepository.DeleteByIssueIdAsync(issueDto.Id!.Value);

                // Delete attachments
                await _unitOfWork.AttachmentRepository.DeleteByIssueIdAsync(issueDto.Id!.Value);

                // Delete the issue
                await _unitOfWork.IssueRepository.ExecuteDeleteAsync(issueDto.Id!.Value);

                await _unitOfWork.CommitTransactionAsync();

                return NoContent();
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        [HttpPost("change-status")]
        public async Task<IActionResult> ChangeIssueStatus([FromBody] IssueDTO issueDto)
        {
            if (issueDto == null || issueDto.Id == Guid.Empty)
            {
                return BadRequest("Issue ID is required.");
            }

            try
            {
                await _unitOfWork.IssueRepository.ChangeStatusAsync(issueDto.Id!.Value, issueDto.Status!);
                return NoContent();
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }
    }
}
