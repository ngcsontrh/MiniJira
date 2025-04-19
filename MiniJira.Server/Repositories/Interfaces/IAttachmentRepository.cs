using MiniJira.Server.Entities;

namespace MiniJira.Server.Repositories.Interfaces
{
    public interface IAttachmentRepository : IRepository<Attachment>
    {
        Task<List<Attachment>> GetAttachmentsByIssueIdAsync(Guid issueId);
        Task DeleteByIssueIdAsync(Guid issueId);
    }
}
