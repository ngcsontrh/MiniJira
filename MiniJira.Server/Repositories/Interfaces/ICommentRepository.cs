using MiniJira.Server.Entities;

namespace MiniJira.Server.Repositories.Interfaces
{
    public interface ICommentRepository : IRepository<Comment>
    {
        Task<List<Comment>> GetCommentsByIssueIdAsync(Guid issueId);
        Task DeleteByIssueIdAsync(Guid issueId);
    }
}
