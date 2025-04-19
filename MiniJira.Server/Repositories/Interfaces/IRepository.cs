namespace MiniJira.Server.Repositories.Interfaces
{
    public interface IRepository<TEntity> where TEntity : class
    {
        Task<TEntity> GetByIdAsync(Guid id);
        Task<List<TEntity>> GetAllAsync();
        Task AddAsync(TEntity entity, bool saveChanges = true);
        Task AddRangeAsync(IEnumerable<TEntity> entities, bool saveChanges = true);
        Task UpdateAsync(TEntity entity, bool saveChanges = true);
        Task UpdateRangeAsync(IEnumerable<TEntity> entities, bool saveChanges = true);
        Task ExecuteDeleteAsync(Guid id);
    }
}
