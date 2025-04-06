using MiniJira.Domain.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniJira.Domain.DTOs
{
    public class ProjectDTO : DTOBase
    {
        public string? Code { get; set; }
        public string? Name { get; set; }
        public Guid? CreatorId { get; set; }
        public List<Guid>? IssueIds { get; set; }
    }
}
