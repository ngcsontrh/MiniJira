namespace MiniJira.Server.Filters
{
    public class IssueFilter
    {
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Type { get; set; }
        public string? Priority { get; set; }
        public string? Status { get; set; }
        public Guid? AssigneeId { get; set; }
        public Guid? ProjectId { get; set; }
    }
}
