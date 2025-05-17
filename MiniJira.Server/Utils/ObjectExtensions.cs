using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using MiniJira.Server.Entities;

namespace MiniJira.Server.Utils
{
    public static class ObjectExtensions
    {
        public static void Update(this Issue? issue, Issue? newValue)
        {
            if (newValue == null || issue == null)
            {
                return;
            }
            issue.Id = newValue.Id;
            issue.Key = newValue.Key;
            issue.Title = newValue.Title;
            issue.Description = newValue.Description;
            issue.Type = newValue.Type;
            issue.Priority = newValue.Priority;
            issue.Status = newValue.Status;
            issue.ProjectId = newValue.ProjectId;
            issue.ReporterId = newValue.ReporterId;
            issue.AssigneeId = newValue.AssigneeId;
            issue.CreatedAt = newValue.CreatedAt;
            issue.UpdatedAt = newValue.UpdatedAt;
        }
    }
}
