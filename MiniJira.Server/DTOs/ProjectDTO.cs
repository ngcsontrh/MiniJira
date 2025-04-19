namespace MiniJira.Server.DTOs
{
    public class ProjectDTO
    {
        public Guid? Id { get; set; }
        public string? Key { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public Guid? OwnerId { get; set; }
        public string? OwnerName { get; set; }
        public List<Guid>? MemberIds { get; set; }
    }
}