using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MiniJira.Server.Enums;
using System.Collections.Generic;
using System.Reflection.Emit;
using MiniJira.Server.Entities;

namespace MiniJira.Server.Data
{
    public class AppDbContext : IdentityDbContext<User, Role, int, UserClaim, UserRole, UserLogin, RoleClaim, UserToken>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Issue> Issues { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectMember> ProjectMembers { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);                               

            builder.Entity<Issue>(entity =>
            {
                entity.ToTable("Issue");

                entity.HasOne(i => i.Project)
                    .WithMany(p => p.Issues)
                    .HasForeignKey(i => i.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(i => i.Assignee)
                    .WithMany(a => a.AssigneeIssues)
                    .HasForeignKey(i => i.AssigneeId)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(i => i.Reporter)
                    .WithMany(r => r.ReporterIssues)
                    .HasForeignKey(i => i.ReporterId)
                    .OnDelete(DeleteBehavior.NoAction);
            });

            builder.Entity<Project>(entity =>
            {
                entity.ToTable("Project");

                entity.HasIndex(p => p.Code).IsUnique();

                entity.HasOne(p => p.Creator)
                    .WithMany(p => p.CreatorProjects)
                    .HasForeignKey(p => p.CreatorId);
            });

            builder.Entity<Role>(entity =>
            {
                entity.ToTable("Role");

                var roles = new List<Role>
                {
                    new Role { Id = 1, Name = "Admin", NormalizedName = "ADMIN" },
                    new Role { Id = 2, Name = "Developer", NormalizedName = "DEVELOPER" },
                    new Role { Id = 3,Name = "Tester", NormalizedName = "TESTER" },
                };
                entity.HasData(roles);
            });

            builder.Entity<RoleClaim>(entity =>
            {
                entity.ToTable("RoleClaim");

                entity.HasOne(rc => rc.Role)
                    .WithMany(r => r.RoleClaims)
                    .HasForeignKey(rc => rc.RoleId);

                var roleClaims = new List<RoleClaim>();
                var permissions = Enum.GetValues<Permission>();

                var adminClaims = permissions.Select((p, index) => new RoleClaim
                {
                    Id = index + 1,
                    RoleId = 1,
                    ClaimType = nameof(Permission),
                    ClaimValue = p.ToString()
                }).ToList();

                var developerClaims = new List<RoleClaim>
                {
                    new RoleClaim { Id = 100, RoleId = 2, ClaimType = nameof(Permission), ClaimValue = Permission.ViewIssues.ToString() },
                    new RoleClaim { Id = 101, RoleId = 2, ClaimType = nameof(Permission), ClaimValue = Permission.EditIssue.ToString() },
                    new RoleClaim { Id = 102, RoleId = 2, ClaimType = nameof(Permission), ClaimValue = Permission.ViewProjects.ToString() },
                };

                var testerClaims = new List<RoleClaim>
                {
                    new RoleClaim { Id = 200, RoleId = 3, ClaimType = nameof(Permission), ClaimValue = Permission.CreateIssue.ToString() },
                    new RoleClaim { Id = 201, RoleId = 3, ClaimType = nameof(Permission), ClaimValue = Permission.ViewIssues.ToString() },
                    new RoleClaim { Id = 202, RoleId = 3, ClaimType = nameof(Permission), ClaimValue = Permission.EditIssue.ToString() },
                    new RoleClaim { Id = 203, RoleId = 3, ClaimType = nameof(Permission), ClaimValue = Permission.ViewProjects.ToString() },
                };

                roleClaims.AddRange(adminClaims);
                roleClaims.AddRange(developerClaims);
                roleClaims.AddRange(testerClaims);

                entity.HasData(roleClaims);

            });

            builder.Entity<User>(entity =>
            {
                entity.ToTable("User");
                entity.HasData(new User
                {
                    Id = 1,
                    UserName = "admin@gmail.com",
                    NormalizedUserName = "ADMIN@GMAIL.COM",
                    Email = "admin@gmail.com",
                    NormalizedEmail = "ADMIN@GMAIL.COM",
                    PasswordHash = "AQAAAAEAACcQAAAAEN/oK1hV6qGNa0gc2SCXUFnyeGIgrqBbST7p5Az/1QFPUAcVjp4yIUSBY/nt+y/rAA==", // admin12345678aA@,
                    ConcurrencyStamp = null,
                    FullName = "Admin"
                });
            });

            builder.Entity<UserClaim>(entity =>
            {
                entity.ToTable("UserClaim");
                entity.HasOne(uc => uc.User)
                    .WithMany(u => u.UserClaims)
                    .HasForeignKey(uc => uc.UserId);
            });

            builder.Entity<UserLogin>(entity =>
            {
                entity.ToTable("UserLogin");

                entity.HasOne(ul => ul.User)
                    .WithMany(u => u.UserLogins)
                    .HasForeignKey(ul => ul.UserId);
            });

            builder.Entity<UserRole>(entity =>
            {
                entity.ToTable("UserRole");

                entity.HasData(new UserRole
                {
                    UserId = 1,
                    RoleId = 1,
                });
                
                entity.HasKey(ur => new { ur.UserId, ur.RoleId });

                entity.HasOne(ur => ur.User)
                    .WithMany(u => u.UserRoles)
                    .HasForeignKey(ur => ur.UserId);

                entity.HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.RoleId);
            });

            builder.Entity<UserToken>(entity =>
            {
                entity.ToTable("UserToken");

                entity.HasOne(ut => ut.User)
                    .WithMany(u => u.UserTokens)
                    .HasForeignKey(ut => ut.UserId);
            });

            builder.Entity<ProjectMember>(entity =>
            {
                entity.ToTable("ProjectMember");

                entity.HasOne(t => t.Project)
                    .WithMany(t => t.ProjectMembers)
                    .HasForeignKey(t => t.ProjectId)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(t => t.Member)
                    .WithMany(t => t.ProjectMembers)
                    .HasForeignKey(t => t.MemberId)
                    .OnDelete(DeleteBehavior.NoAction);
            });
        }
    }
}
