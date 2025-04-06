using MiniJira.Domain.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniJira.Domain.Entities
{
    public class AuthUser : EntityBase
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }

        public ICollection<AuthUserRole> AuthUserRoles { get; set; }
    }
}
