using Microsoft.EntityFrameworkCore;
using MiniJira.Server.Data;
using MiniJira.Server.Entities;
using MiniJira.Server.Repositories.Interfaces;

namespace MiniJira.Server.Repositories
{
    public class IssueAttachmentRepository : Repository<IssueAttachment>, IIssueAttachmentRepository
    {
        public IssueAttachmentRepository(MiniJiraDbContext context) : base(context)
        {
        }

        public async Task DeleteByIssueIdAsync(Guid issueId)
        {
            await _context.IssueAttachments
                .Where(ia => ia.IssueId == issueId)
                .ExecuteDeleteAsync();
        }
    }
}
