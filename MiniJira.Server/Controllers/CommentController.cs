using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MiniJira.Server.DTOs;
using MiniJira.Server.Mappers;
using MiniJira.Server.UOW;

namespace MiniJira.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public CommentController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet("issue/{issueId}")]
        public async Task<IActionResult> GetComments(Guid issueId)
        {
            var comments = await _unitOfWork.CommentRepository.GetCommentsByIssueIdAsync(issueId);
            return Ok(comments.ToDTO());
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateComment([FromBody] CommentDTO commentDto)
        {
            if (commentDto == null)
            {
                return BadRequest("Comment data is required.");
            }

            var comment = commentDto.ToEntity();
            comment.CreatedAt = DateTime.UtcNow;
            comment.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.CommentRepository.AddAsync(comment);

            return CreatedAtAction(nameof(GetComments), new { issueId = comment.IssueId }, comment.ToDTO());
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateComment([FromBody] CommentDTO commentDto)
        {
            if (commentDto == null)
            {
                return BadRequest("Comment data is required.");
            }

            var comment = commentDto.ToEntity();
            comment.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.CommentRepository.UpdateAsync(comment);

            return CreatedAtAction(nameof(GetComments), new { issueId = comment.IssueId }, comment.ToDTO());
        }
    }
}
