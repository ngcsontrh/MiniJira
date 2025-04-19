namespace MiniJira.Server.Entities
{
    public class Attachment
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string FileName { get; set; } = null!;
        public string FilePath { get; set; } = null!;
        public string FileType { get; set; } = null!;
        public DateTime? UploadedAt { get; set; }
        public ICollection<IssueAttachment> IssueAttachments { get; set; } = new List<IssueAttachment>();
    }
}
