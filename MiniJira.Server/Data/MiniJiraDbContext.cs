using Microsoft.EntityFrameworkCore;
using MiniJira.Server.Entities;

namespace MiniJira.Server.Data
{
    public class MiniJiraDbContext : DbContext
    {
        public MiniJiraDbContext(DbContextOptions<MiniJiraDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Project> Projects { get; set; } = null!;
        public DbSet<Issue> Issues { get; set; } = null!;
        public DbSet<Comment> Comments { get; set; } = null!;
        public DbSet<Attachment> Attachments { get; set; } = null!;
        public DbSet<IssueAttachment> IssueAttachments { get; set; } = null!;
        public DbSet<ProjectMember> ProjectMembers { get; set; } = null!;
        public DbSet<AuditLog> AuditLogs { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // User entity configuration
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasData(new User
                {
                    Id = Guid.Parse("8d78c403-a413-42d9-8a70-e7c073be9664"),
                    Username = "admin",
                    Email = "admin@minijira.com",
                    Password = "$2a$11$tvsFMOHxKo/WYVJY34s2NuQJ6F/vAqN7hdAVujW8VxkTROQhQI80i",
                    Role = "Admin"
                }
            );

            // Project entity configuration
            modelBuilder.Entity<Project>()
                .HasOne(p => p.Owner)
                .WithMany()
                .HasForeignKey(p => p.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure Project's relationship with ProjectMembers
            modelBuilder.Entity<Project>()
                .HasMany(p => p.ProjectMembers)
                .WithOne(pm => pm.Project)
                .HasForeignKey(pm => pm.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            // Issue entity configuration
            modelBuilder.Entity<Issue>()
                .HasOne(i => i.Project)
                .WithMany()
                .HasForeignKey(i => i.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Issue>()
                .HasOne(i => i.Reporter)
                .WithMany()
                .HasForeignKey(i => i.ReporterId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Issue>()
                .HasOne(i => i.Assignee)
                .WithMany()
                .HasForeignKey(i => i.AssigneeId)
                .OnDelete(DeleteBehavior.Restrict);

            // Comment entity configuration
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Issue)
                .WithMany(i => i.Comments)
                .HasForeignKey(c => c.IssueId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Attachment entity configuration
            modelBuilder.Entity<IssueAttachment>()
                .HasKey(x => new { x.IssueId, x.AttachmentId });

            modelBuilder.Entity<IssueAttachment>()
                .HasOne(a => a.Issue)
                .WithMany(i => i.IssueAttachments)
                .HasForeignKey(a => a.IssueId)
                .OnDelete(DeleteBehavior.Cascade);           
            
            modelBuilder.Entity<IssueAttachment>()
                .HasOne(a => a.Attachment)
                .WithMany(i => i.IssueAttachments)
                .HasForeignKey(a => a.AttachmentId)
                .OnDelete(DeleteBehavior.Cascade);

            // ProjectMember entity configuration
            modelBuilder.Entity<ProjectMember>()
                .HasOne(pm => pm.Member)
                .WithMany()
                .HasForeignKey(pm => pm.MemberId)
                .OnDelete(DeleteBehavior.Restrict);

            base.OnModelCreating(modelBuilder);
        }
    }
}
