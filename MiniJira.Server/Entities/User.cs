using Microsoft.AspNetCore.Identity;

namespace MiniJira.Server.Entities
{
    public class User : IdentityUser<int>
    {
        public string FullName { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
        public virtual ICollection<UserClaim> UserClaims { get; set; } = new List<UserClaim>();
        public virtual ICollection<UserToken> UserTokens { get; set; } = new List<UserToken>();
        public virtual ICollection<UserLogin> UserLogins { get; set; } = new List<UserLogin>();
        public virtual ICollection<Project> CreatorProjects { get; set; } = new List<Project>();
        public virtual ICollection<Issue> ReporterIssues { get; set; } = new List<Issue>();
        public virtual ICollection<Issue> AssigneeIssues { get; set; } = new List<Issue>();
        public virtual ICollection<ProjectMember> ProjectMembers { get; set; } = new List<ProjectMember>();
    }
}