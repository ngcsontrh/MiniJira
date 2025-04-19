using MiniJira.Server.Entities;
using MiniJira.Server.Filters;

namespace MiniJira.Server.Repositories.Interfaces
{
    public interface IProjectRepository : IRepository<Project>
    {
        Task<(List<Project>, int)> GetProjectsByFilterAsync(ProjectFilter projectFilter);
        Task<Project> GetDetailAsync(Guid id);
    }
}
