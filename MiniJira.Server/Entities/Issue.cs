namespace MiniJira.Server.Entities
{
    public class Issue
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Key { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string Type { get; set; } = null!;
        public string Priority { get; set; } = null!;
        public string Status { get; set; } = null!;
        public Guid ProjectId { get; set; }
        public Guid ReporterId { get; set; }
        public Guid? AssigneeId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public User? Reporter { get; set; }
        public User? Assignee { get; set; }
        public Project? Project { get; set; }
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<IssueAttachment> IssueAttachments { get; set; } = new List<IssueAttachment>();
    }
}