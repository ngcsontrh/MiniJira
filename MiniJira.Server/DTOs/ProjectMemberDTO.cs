namespace MiniJira.Server.DTOs
{
    public class ProjectMemberDTO
    {
        public Guid? Id { get; set; }
        public Guid? ProjectId { get; set; }
        public Guid? MemberId { get; set; }
        public string? Role { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}