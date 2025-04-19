using Microsoft.EntityFrameworkCore;
using MiniJira.Server.Data;
using MiniJira.Server.Entities;
using MiniJira.Server.Repositories.Interfaces;

namespace MiniJira.Server.Repositories
{
    public class AttachmentRepository : Repository<Attachment>, IAttachmentRepository
    {
        public AttachmentRepository(MiniJiraDbContext context) : base(context)
        {
        }

        public async Task DeleteByIssueIdAsync(Guid issueId)
        {
            await _context.IssueAttachments
                .Where(ia => ia.IssueId == issueId)
                .ExecuteDeleteAsync();
        }

        public Task<List<Attachment>> GetAttachmentsByIssueIdAsync(Guid issueId)
        {
            return _context.IssueAttachments
                .Where(a => a.IssueId == issueId)
                .Include(a => a.Attachment)
                .Select(a => a.Attachment!)
                .ToListAsync();
        }
    }
}
