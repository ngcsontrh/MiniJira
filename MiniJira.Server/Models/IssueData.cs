namespace MiniJira.Server.Models
{
    public class IssueData
    {
        public int? Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public int? ReporterId { get; set; }
        public string? ReporterName { get; set; }
        public int? AssigneeId { get; set; }
        public string? AssigneeName { get; set; }
        public string? Frequency { get; set; }
        public string? Priority { get; set; }
        public string? FilePaths { get; set; }
    }
}
