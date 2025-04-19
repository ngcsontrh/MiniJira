using MiniJira.Server.Entities;

namespace MiniJira.Server.Repositories.Interfaces
{
    public interface IIssueAttachmentRepository : IRepository<IssueAttachment>
    {
        Task DeleteByIssueIdAsync(Guid issueId);
    }
}
