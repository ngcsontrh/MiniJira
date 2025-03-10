using Microsoft.AspNetCore.Identity;

namespace MiniJira.Server.Entities
{
    public class UserClaim : IdentityUserClaim<int>
    {
        public virtual User User { get; set; } = null!;
    }
}