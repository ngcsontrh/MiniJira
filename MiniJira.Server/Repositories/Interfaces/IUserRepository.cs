using MiniJira.Server.Entities;

namespace MiniJira.Server.Repositories.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetUserByUsernameAsync(string username);
        Task ChangeRoleAsync(Guid userId, string role);
    }
}
