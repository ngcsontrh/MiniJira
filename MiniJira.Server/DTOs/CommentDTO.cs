namespace MiniJira.Server.DTOs
{
    public class CommentDTO
    {
        public Guid? Id { get; set; }
        public Guid? IssueId { get; set; }
        public Guid? UserId { get; set; }
        public string? Content { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}