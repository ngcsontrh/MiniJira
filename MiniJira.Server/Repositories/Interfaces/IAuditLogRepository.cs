using MiniJira.Server.Entities;

namespace MiniJira.Server.Repositories.Interfaces
{
    public interface IAuditLogRepository : IRepository<AuditLog>
    {
        public Task<List<AuditLog>> GetByEntityAndId(string entity, Guid id);
    }
}
