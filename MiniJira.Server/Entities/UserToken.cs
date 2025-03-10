using Microsoft.AspNetCore.Identity;

namespace MiniJira.Server.Entities
{
    public class UserToken : IdentityUserToken<int>
    {
        public virtual User User { get; set; } = null!;
    }
}