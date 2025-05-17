using MiniJira.Server.Entities;

namespace MiniJira.Server.Repositories.Interfaces
{
    public interface IProjectMemberRepository : IRepository<ProjectMember>
    {
        Task<List<ProjectMember>> GetProjectMembersByProjectIdAsync(Guid projectId);
        Task<List<ProjectMember>> GetProjectMembersByMemberIdAsync(Guid memberId);
        Task<List<ProjectMember>> GetProjectMembersByProjectAndMemberIdAsync(Guid projectId, Guid memberId);
        Task DeleteByProjectIdAsync(Guid projectId);
    }
}
