using Microsoft.EntityFrameworkCore;
using MiniJira.Server.Data;
using MiniJira.Server.Entities;
using MiniJira.Server.Repositories.Interfaces;

namespace MiniJira.Server.Repositories
{
    public class ProjectMemberRepository : Repository<ProjectMember>, IProjectMemberRepository
    {
        public ProjectMemberRepository(MiniJiraDbContext context) : base(context)
        {
        }

        public Task DeleteByProjectIdAsync(Guid projectId)
        {
            return _context.ProjectMembers
                .Where(pm => pm.ProjectId == projectId)
                .ExecuteDeleteAsync();
        }

        public Task<List<ProjectMember>> GetProjectMembersByProjectIdAsync(Guid projectId)
        {
            return _context.ProjectMembers
                .Where(pm => pm.ProjectId == projectId)
                .ToListAsync();
        }
    }
}
