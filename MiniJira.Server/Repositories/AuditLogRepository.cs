using Microsoft.EntityFrameworkCore;
using MiniJira.Server.Data;
using MiniJira.Server.Entities;
using MiniJira.Server.Repositories.Interfaces;
using System.Threading.Tasks;

namespace MiniJira.Server.Repositories
{
    public class AuditLogRepository : Repository<AuditLog>, IAuditLogRepository
    {
        public AuditLogRepository(MiniJiraDbContext context) : base(context)
        {
        }

        public async Task<List<AuditLog>> GetByEntityAndId(string entity, Guid id)
        {
            var entities = await _dbSet.Where(x => x.Entity == entity && x.EntityId == id)
                .ToListAsync();
            return entities;
        }
    }
}
