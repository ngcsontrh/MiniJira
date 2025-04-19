using MiniJira.Server.DTOs;
using MiniJira.Server.Entities;

namespace MiniJira.Server.Mappers
{
    public static class ProjectMapper
    {
        public static ProjectDTO ToDTO(this Project project)
        {
            if (project == null) return null!;
            return new ProjectDTO
            {
                Id = project.Id,
                Key = project.Key,
                Name = project.Name,
                Description = project.Description,
                OwnerId = project.OwnerId,
                CreatedAt = project.CreatedAt,
                UpdatedAt = project.UpdatedAt,
                MemberIds = project.ProjectMembers?.Select(x => x.MemberId).ToList(),
                OwnerName = project.Owner?.Username
            };
        }

        public static Project ToEntity(this ProjectDTO projectDTO)
        {
            if (projectDTO == null) return null!;
            return new Project
            {
                Id = projectDTO.Id ?? Guid.NewGuid(),
                Key = projectDTO.Key ?? string.Empty,
                Name = projectDTO.Name ?? string.Empty,
                Description = projectDTO.Description,
                OwnerId = projectDTO.OwnerId ?? Guid.Empty,
                CreatedAt = projectDTO.CreatedAt,
                UpdatedAt = projectDTO.UpdatedAt
            };
        }

        public static List<ProjectDTO> ToDTO(this List<Project> projects)
        {
            if (projects == null) return null!;
            return projects.Select(p => p.ToDTO()).ToList();
        }

        public static List<Project> ToEntity(this List<ProjectDTO> projectDTOs)
        {
            if (projectDTOs == null) return null!;
            return projectDTOs.Select(p => p.ToEntity()).ToList();
        }
    }
}