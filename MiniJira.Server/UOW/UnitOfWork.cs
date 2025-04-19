using Microsoft.EntityFrameworkCore.Storage;
using MiniJira.Server.Data;
using MiniJira.Server.Repositories.Interfaces;

namespace MiniJira.Server.UOW
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly MiniJiraDbContext _context;
        private IDbContextTransaction? _transaction;

        public UnitOfWork(
            MiniJiraDbContext context,
            IAttachmentRepository attachmentRepository,
            ICommentRepository commentRepository,
            IIssueRepository issueRepository,
            IProjectMemberRepository projectMemberRepository,
            IProjectRepository projectRepository,
            IUserRepository userRepository,
            IIssueAttachmentRepository issueAttachmentRepository)
        {
            _context = context;
            AttachmentRepository = attachmentRepository;
            CommentRepository = commentRepository;
            IssueRepository = issueRepository;
            ProjectMemberRepository = projectMemberRepository;
            ProjectRepository = projectRepository;
            UserRepository = userRepository;
            IssueAttachmentRepository = issueAttachmentRepository;
        }

        public IAttachmentRepository AttachmentRepository { get; }

        public ICommentRepository CommentRepository { get; }

        public IIssueRepository IssueRepository { get; }

        public IProjectMemberRepository ProjectMemberRepository { get; }

        public IProjectRepository ProjectRepository { get; }

        public IUserRepository UserRepository { get; }
        public IIssueAttachmentRepository IssueAttachmentRepository { get; }

        public async Task BeginTransactionAsync()
        {
            if (_transaction == null)
            {
                _transaction = await _context.Database.BeginTransactionAsync();
            }
        }

        public async Task CommitTransactionAsync()
        {
            await _context.SaveChangesAsync();
            if (_transaction != null)
            {
                await _transaction.CommitAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }
    }
}
