using MiniJira.Domain.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniJira.Domain.Entities
{
    public class ProjectMember : EntityBase
    {
        public Guid ProjectId { get; set; }
        public Guid MemberId { get; set; }

        public ICollection<Project> Projects { get; set; }
        public ICollection<AuthUser> Members { get; set; }
    }
}
