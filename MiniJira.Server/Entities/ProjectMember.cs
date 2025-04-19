namespace MiniJira.Server.Entities
{
    public class ProjectMember
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid ProjectId { get; set; }
        public Guid MemberId { get; set; }
        public string Role { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Project? Project { get; set; }
        public User? Member { get; set; }
    }
}
