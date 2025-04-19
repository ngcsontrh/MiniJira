using MiniJira.Server.Repositories.Interfaces;

namespace MiniJira.Server.UOW
{
    public interface IUnitOfWork
    {        
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
        IAttachmentRepository AttachmentRepository { get; }
        ICommentRepository CommentRepository { get; }
        IIssueRepository IssueRepository { get; }
        IProjectMemberRepository ProjectMemberRepository { get; }
        IProjectRepository ProjectRepository { get; }
        IUserRepository UserRepository { get; }
        IIssueAttachmentRepository IssueAttachmentRepository { get; }
    }
}
