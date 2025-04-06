using MiniJira.Domain.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniJira.Domain.Entities
{
    public class Issue : EntityBase
    {
        public string Code { get; set; }
        public string Summary { get; set; }
        public string Type { get; set; }
        public string Priority { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
        public Guid ProjectId { get; set; }
        public string ProjectName { get; set; }
        public Guid ReporterId { get; set; }
        public string ReporterName { get; set; }
        public Guid? AssigneeId { get; set; }
        public string? AssigneeName { get; set; }

        public Project Project { get; set; }
        public AuthUser Reporter { get; set; }
        public AuthUser Assignee { get; set; }
    }
}
