using MiniJira.Server.DTOs;
using MiniJira.Server.Entities;

namespace MiniJira.Server.Mappers
{
    public static class IssueMapper
    {
        public static IssueDTO ToDTO(this Issue issue)
        {
            if (issue == null) return null!;
            return new IssueDTO
            {
                Id = issue.Id,
                Key = issue.Key,
                Title = issue.Title,
                Description = issue.Description,
                Type = issue.Type,
                Priority = issue.Priority,
                Status = issue.Status,
                ProjectId = issue.ProjectId,
                ProjectName = issue.Project?.Name,
                ReporterId = issue.ReporterId,
                ReporterName = issue.Reporter?.Username,
                AssigneeId = issue.AssigneeId,
                AssigneeName = issue.Assignee?.Username,
                CreatedAt = issue.CreatedAt,
                UpdatedAt = issue.UpdatedAt,
            };
        }

        public static Issue ToEntity(this IssueDTO issueDTO)
        {
            if (issueDTO == null) return null!;
            return new Issue
            {
                Id = issueDTO.Id ?? Guid.NewGuid(),
                Key = issueDTO.Key ?? string.Empty,
                Title = issueDTO.Title ?? string.Empty,
                Description = issueDTO.Description,
                Type = issueDTO.Type ?? string.Empty,
                Priority = issueDTO.Priority ?? string.Empty,
                Status = issueDTO.Status ?? string.Empty,
                ProjectId = issueDTO.ProjectId ?? Guid.Empty,
                ReporterId = issueDTO.ReporterId ?? Guid.Empty,
                AssigneeId = issueDTO.AssigneeId,
                CreatedAt = issueDTO.CreatedAt,
                UpdatedAt = issueDTO.UpdatedAt
            };
        }

        public static List<IssueDTO> ToDTO(this List<Issue> issues)
        {
            if (issues == null) return null!;
            return issues.Select(i => i.ToDTO()).ToList();
        }

        public static List<Issue> ToEntity(this List<IssueDTO> issueDTOs)
        {
            if (issueDTOs == null) return null!;
            return issueDTOs.Select(i => i.ToEntity()).ToList();
        }

        public static IssueChangeDTO ToChangeDTO(this Issue issue)
        {
            if (issue == null) return null!;
            return new IssueChangeDTO
            {
                Id = issue.Id,
                Key = issue.Key,
                Title = issue.Title,
                Description = issue.Description,
                Type = issue.Type,
                Priority = issue.Priority,
                Status = issue.Status,                
            };
        }
    }
}