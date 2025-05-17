namespace MiniJira.Server.Entities
{
    public class AuditLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Entity { get; set; } = null!;
        public Guid EntityId { get; set; }
        public string? OldValue { get; set; }
        public string? NewValue { get; set; }
    }
}
