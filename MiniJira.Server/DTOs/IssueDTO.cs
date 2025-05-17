namespace MiniJira.Server.DTOs
{
    public class IssueDTO
    {
        public Guid? Id { get; set; }
        public string? Key { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Type { get; set; }
        public string? Priority { get; set; }
        public string? Status { get; set; }
        public Guid? ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public Guid? ReporterId { get; set; }
        public string? ReporterName { get; set; }
        public Guid? AssigneeId { get; set; }
        public string? AssigneeName { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<Guid>? AttachmentIds { get; set; }
        public List<string>? AttachmentUrls { get; set; }
        public List<ChangeIssueData>? Logs { get; set; }
    }

    public class IssueChangeDTO
    {
        public Guid? Id { get; set; }
        public string? Key { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Type { get; set; }
        public string? Priority { get; set; }        
        public string? Status { get; set; }
    }

    public class ChangeIssueData
    {
        public string? OldData { get; set; }
        public string? NewData { get; set; }
    }
}