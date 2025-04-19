using Microsoft.EntityFrameworkCore;
using MiniJira.Server.Data;
using MiniJira.Server.Entities;
using MiniJira.Server.Filters;
using MiniJira.Server.Repositories.Interfaces;

namespace MiniJira.Server.Repositories
{
    public class ProjectRepository : Repository<Project>, IProjectRepository
    {
        public ProjectRepository(MiniJiraDbContext context) : base(context)
        {
        }

        public async Task<Project> GetDetailAsync(Guid id)
        {
            return await _dbSet.Where(x => x.Id == id)
                .Include(x => x.ProjectMembers)
                .Include(x => x.Owner)
                .FirstOrDefaultAsync() ?? throw new KeyNotFoundException($"Entity with ID {id} not found.");
        }

        public async Task<(List<Project>, int)> GetProjectsByFilterAsync(ProjectFilter projectFilter)
        {
            IQueryable<Project> query;

            if (projectFilter.MemberId.HasValue)
            {
                query = _context.ProjectMembers
                    .Where(mp => mp.MemberId == projectFilter.MemberId.Value)
                    .Include(mp => mp.Project)
                    .ThenInclude(p => p.Owner)
                    .Select(mp => mp.Project!)
                    .Distinct();
            }
            else
            {
                query = _context.Projects
                    .Include(x => x.Owner);
            }

            var totalCount = await query.CountAsync();

            var entities = await query
                .Skip((projectFilter.PageIndex - 1) * projectFilter.PageSize)
                .Take(projectFilter.PageSize)
                .ToListAsync();

            return (entities, totalCount);
        }
    }
}
