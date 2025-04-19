using Microsoft.EntityFrameworkCore;
using MiniJira.Server.Data;
using MiniJira.Server.Entities;
using MiniJira.Server.Filters;
using MiniJira.Server.Repositories.Interfaces;

namespace MiniJira.Server.Repositories
{
    public class IssueRepository : Repository<Issue>, IIssueRepository
    {
        public IssueRepository(MiniJiraDbContext context) : base(context)
        {
        }

        public async Task ChangeStatusAsync(Guid issueId, string status)
        {
            await _dbSet.Where(x => x.Id == issueId)
                .ExecuteUpdateAsync(x => x.SetProperty(i => i.Status, status));
        }

        public async Task DeleteByProjectIdAsync(Guid projectId)
        {
            await _dbSet.Where(i => i.ProjectId == projectId)
                .ExecuteDeleteAsync();
        }

        public async Task<Issue> GetDetailAsync(Guid id)
        {
            var entity = await _dbSet
                .Include(x => x.Project)
                .Include(x => x.Assignee)
                .Include(x => x.Reporter)
                .FirstOrDefaultAsync(x => x.Id ==  id);
            if (entity == null)
            {
                throw new KeyNotFoundException($"Entity with ID {id} not found.");
            }
            return entity;
        }

        public async Task<(List<Issue>, int)> GetIssuesByFilterAsync(IssueFilter issueFilter)
        {
            var query = _context.Issues.AsQueryable();
            if (issueFilter.ProjectId.HasValue && issueFilter.ProjectId != Guid.Empty)
            {
                query = query.Where(i => i.ProjectId == issueFilter.ProjectId);
            }
            if (!string.IsNullOrEmpty(issueFilter.Priority))
            {
                query = query.Where(i => i.Priority == issueFilter.Priority);
            }
            if (!string.IsNullOrEmpty(issueFilter.Status))
            {
                query = query.Where(i => i.Status == issueFilter.Status);
            }
            if (!string.IsNullOrEmpty(issueFilter.Type))
            {
                query = query.Where(i => i.Type == issueFilter.Type);
            }
            if (issueFilter.AssigneeId != null && issueFilter.AssigneeId != Guid.Empty)
            {
                query = query.Where(i => i.AssigneeId == issueFilter.AssigneeId);
            }

            query = query
                .Include(x => x.Project)
                .Include(x => x.Assignee)
                .Include(x => x.Reporter);
            
            var entities = await query.Skip((issueFilter.PageIndex - 1) * issueFilter.PageSize)
                .Take(issueFilter.PageSize)
                .ToListAsync();
            var totalCount = await query.CountAsync();

            return (entities, totalCount);
        }
    }
}
