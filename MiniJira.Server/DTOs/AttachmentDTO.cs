﻿namespace MiniJira.Server.DTOs
{
    public class AttachmentDTO
    {
        public Guid? Id { get; set; }
        public string? FileName { get; set; }
        public string? FilePath { get; set; }
        public string? FileType { get; set; }
    }
}
