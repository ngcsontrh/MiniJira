using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniJira.Server.DTOs;
using MiniJira.Server.Entities;
using MiniJira.Server.Mappers;
using MiniJira.Server.Repositories.Interfaces;
using MiniJira.Server.UOW;
using System.IO;

namespace MiniJira.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AttachmentController : ControllerBase
    {
        private readonly IAttachmentRepository _attachmentRepository;
        private readonly IWebHostEnvironment _environment;
        private readonly string _uploadsFolder;

        public AttachmentController(IAttachmentRepository attachmentRepository, IWebHostEnvironment environment)
        {
            _attachmentRepository = attachmentRepository;
            _environment = environment;
            _uploadsFolder = Path.Combine(_environment.ContentRootPath, "Uploads");

            // Ensure uploads directory exists
            if (!Directory.Exists(_uploadsFolder))
            {
                Directory.CreateDirectory(_uploadsFolder);
            }            
        }

        [HttpGet]
        public async Task<IActionResult> GetAttachments([FromQuery] Guid issueId)
        {
            var attachments = await _attachmentRepository.GetAttachmentsByIssueIdAsync(issueId);
            return Ok(attachments.ToDTO());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAttachment(Guid id)
        {
            try
            {
                var attachment = await _attachmentRepository.GetByIdAsync(id);

                var absolutePath = Path.Combine(_environment.ContentRootPath, attachment.FilePath);

                if (!System.IO.File.Exists(absolutePath))
                {
                    return NotFound("File not found.");
                }

                var fileStream = new FileStream(absolutePath, FileMode.Open, FileAccess.Read);
                return File(fileStream, "application/octet-stream", attachment.FileName);
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Attachment not found.");
            }
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadAttachment(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("File is required.");
            }

            try
            {
                var originalFileName = Path.GetFileName(file.FileName);
                var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(originalFileName)}";
                var relativePath = Path.Combine("Uploads", uniqueFileName);
                var absolutePath = Path.Combine(_environment.ContentRootPath, relativePath);

                using (var stream = new FileStream(absolutePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var attachment = new Attachment
                {
                    Id = Guid.NewGuid(),
                    FileName = originalFileName,
                    FilePath = relativePath, // đường dẫn tương đối
                    FileType = file.ContentType,
                    UploadedAt = DateTime.UtcNow,
                };

                await _attachmentRepository.AddAsync(attachment);

                return CreatedAtAction(nameof(GetAttachment), new { id = attachment.Id }, attachment.ToDTO());
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Issue not found.");
            }
        }
    }
}
