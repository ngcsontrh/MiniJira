using Microsoft.AspNetCore.Identity;

namespace MiniJira.Server.Entities
{
    public class RoleClaim : IdentityRoleClaim<int>
    {
        public virtual Role Role { get; set; } = null!;
    }
}