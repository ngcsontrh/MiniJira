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

        public async Task<List<ProjectMember>> GetProjectMembersByMemberIdAsync(Guid memberId)
        {
            return await _context.ProjectMembers
                .Where(pm => pm.MemberId == memberId)
                .ToListAsync();
        }

        public async Task<List<ProjectMember>> GetProjectMembersByProjectAndMemberIdAsync(Guid projectId, Guid memberId)
        {
            return await _context.ProjectMembers
                .Where(pm => pm.MemberId == memberId && pm.ProjectId == projectId)
                .ToListAsync();
        }

        public async Task<List<ProjectMember>> GetProjectMembersByProjectIdAsync(Guid projectId)
        {
            return await _context.ProjectMembers
                .Where(pm => pm.ProjectId == projectId)
                .ToListAsync();
        }
    }
}
