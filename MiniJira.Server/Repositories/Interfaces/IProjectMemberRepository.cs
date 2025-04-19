using MiniJira.Server.Entities;

namespace MiniJira.Server.Repositories.Interfaces
{
    public interface IProjectMemberRepository : IRepository<ProjectMember>
    {
        Task<List<ProjectMember>> GetProjectMembersByProjectIdAsync(Guid projectId);
        Task DeleteByProjectIdAsync(Guid projectId);
    }
}
