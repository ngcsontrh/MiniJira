using MiniJira.Server.Entities;
using MiniJira.Server.Filters;

namespace MiniJira.Server.Repositories.Interfaces
{
    public interface IIssueRepository : IRepository<Issue>
    {
        Task<Issue> GetDetailAsync(Guid id);
        Task<(List<Issue>, int)> GetIssuesByFilterAsync(IssueFilter projectId);
        Task ChangeStatusAsync(Guid issueId, string status);
        Task DeleteByProjectIdAsync(Guid projectId);
    }
}
