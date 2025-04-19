namespace MiniJira.Server.Entities
{
    public class IssueAttachment
    {
        public Guid IssueId { get; set; }
        public Guid AttachmentId { get; set; }

        public Issue? Issue { get; set; }
        public Attachment? Attachment { get; set; }
    }
}
