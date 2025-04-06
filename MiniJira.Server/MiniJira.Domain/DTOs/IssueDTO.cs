using MiniJira.Domain.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniJira.Domain.DTOs
{
    public class IssueDTO : DTOBase
    {
        public string? Code { get; set; }
        public string? Summary { get; set; }
        public string? Type { get; set; }
        public string? Priority { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
        public Guid? ProjectId { get; set; }
        public Guid? ReporterId { get; set; }
        public Guid? AssigneeId { get; set; }
    }
}
