using Microsoft.EntityFrameworkCore;
using MiniJira.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniJira.Domain.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }
        
        public DbSet<AuthUser> AuthUsers { get; set; }
        public DbSet<AuthRole> AuthRoles { get; set; }
        public DbSet<AuthUserRole> AuthUserRoles { get; set; }
        public DbSet<Issue> Issues { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectMember> ProjectMembers { get; set; }
    }
}
