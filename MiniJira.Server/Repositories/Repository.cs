using Microsoft.EntityFrameworkCore;
using MiniJira.Server.Data;
using MiniJira.Server.Repositories.Interfaces;

namespace MiniJira.Server.Repositories
{
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        protected readonly MiniJiraDbContext _context;
        protected readonly DbSet<TEntity> _dbSet;

        public Repository(MiniJiraDbContext context)
        {
            _context = context;
            _dbSet = context.Set<TEntity>();
        }

        public async Task<TEntity> GetByIdAsync(Guid id)
        {
            return await _dbSet.FindAsync(id) ?? throw new KeyNotFoundException($"Entity with ID {id} not found.");
        }

        public async Task<List<TEntity>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task AddAsync(TEntity entity, bool saveChanges = true)
        {
            await _dbSet.AddAsync(entity);
            if (saveChanges) await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(TEntity entity, bool saveChanges = true)
        {
            _dbSet.Update(entity);
            if (saveChanges) await _context.SaveChangesAsync();
        }

        public async Task ExecuteDeleteAsync(Guid id)
        {
            await _dbSet.Where(e => EF.Property<Guid>(e, "Id") == id).ExecuteDeleteAsync();
        }

        public async Task AddRangeAsync(IEnumerable<TEntity> entities, bool saveChanges = true)
        {
            _dbSet.AddRange(entities);
            if (saveChanges) await _context.SaveChangesAsync();
        }

        public async Task UpdateRangeAsync(IEnumerable<TEntity> entities, bool saveChanges = true)
        {
            _dbSet.UpdateRange(entities);
            if (saveChanges) await _context.SaveChangesAsync();
        }
    }
}
