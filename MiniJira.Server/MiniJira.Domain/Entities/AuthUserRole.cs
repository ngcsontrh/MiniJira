using MiniJira.Domain.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniJira.Domain.Entities
{
    public class AuthUserRole : EntityBase
    {
        public Guid AuthUserId { get; set; }
        public Guid AuthRoleId { get; set; }
        public AuthUser AuthUser { get; set; }
        public AuthRole AuthRole { get; set; }
    }
}
