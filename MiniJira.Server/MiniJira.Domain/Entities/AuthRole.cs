using MiniJira.Domain.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniJira.Domain.Entities
{
    public class AuthRole : EntityBase
    {
        public string Name { get; set; }

        public ICollection<AuthUserRole> AuthUserRoles { get; set; }
    }
}
