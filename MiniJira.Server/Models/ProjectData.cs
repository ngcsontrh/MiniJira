namespace MiniJira.Server.Models
{
    public class ProjectData
    {
        public int? Id { get; set; }
        public string? Code { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? CreatorId { get; set; }
        public string? CreatorName { get; set; }
    }
}
