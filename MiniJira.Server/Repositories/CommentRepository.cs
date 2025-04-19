using Microsoft.EntityFrameworkCore;
using MiniJira.Server.Data;
using MiniJira.Server.Entities;
using MiniJira.Server.Repositories.Interfaces;

namespace MiniJira.Server.Repositories
{
    public class CommentRepository : Repository<Comment>, ICommentRepository
    {
        public CommentRepository(MiniJiraDbContext context) : base(context)
        {
        }

        public async Task DeleteByIssueIdAsync(Guid issueId)
        {
            await _context.Comments
                .Where(c => c.IssueId == issueId)
                .ExecuteDeleteAsync();
        }

        public Task<List<Comment>> GetCommentsByIssueIdAsync(Guid issueId)
        {
            return _context.Comments.Where(c => c.IssueId == issueId).ToListAsync();
        }
    }
}
