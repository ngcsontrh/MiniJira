namespace MiniJira.Server.Entities
{
    public class ProjectMember
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public int MemberId { get; set; }

        public virtual Project Project { get; set; } = null!;
        public virtual User Member { get; set; } = null!;
    }
}