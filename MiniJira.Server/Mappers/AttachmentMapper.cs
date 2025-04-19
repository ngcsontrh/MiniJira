using MiniJira.Server.DTOs;
using MiniJira.Server.Entities;

namespace MiniJira.Server.Mappers
{
    public static class AttachmentMapper
    {
        public static AttachmentDTO ToDTO(this Attachment attachment)
        {
            if (attachment == null) return null!;
            return new AttachmentDTO
            {
                Id = attachment.Id,
                FileName = attachment.FileName,
                FilePath = attachment.FilePath,
                FileType = attachment.FileType,
            };
        }

        public static Attachment ToEntity(this AttachmentDTO attachmentDTO)
        {
            if (attachmentDTO == null) return null!;
            return new Attachment
            {
                Id = attachmentDTO.Id ?? Guid.NewGuid(),
                FileName = attachmentDTO.FileName ?? string.Empty,
                FilePath = attachmentDTO.FilePath ?? string.Empty,
                FileType = attachmentDTO.FileType ?? string.Empty,
            };
        }

        public static List<AttachmentDTO> ToDTO(this List<Attachment> attachments)
        {
            if (attachments == null) return null!;
            return attachments.Select(a => a.ToDTO()).ToList();
        }

        public static List<Attachment> ToEntity(this List<AttachmentDTO> attachmentDTOs)
        {
            if (attachmentDTOs == null) return null!;
            return attachmentDTOs.Select(a => a.ToEntity()).ToList();
        }
    }
}
