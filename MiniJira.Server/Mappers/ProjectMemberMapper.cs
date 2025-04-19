using MiniJira.Server.DTOs;
using MiniJira.Server.Entities;

namespace MiniJira.Server.Mappers
{
    public static class ProjectMemberMapper
    {
        public static ProjectMemberDTO ToDTO(this ProjectMember projectMember)
        {
            if (projectMember == null) return null!;
            return new ProjectMemberDTO
            {
                Id = projectMember.Id,
                ProjectId = projectMember.ProjectId,
                MemberId = projectMember.MemberId,
                Role = projectMember.Role,
                CreatedAt = projectMember.CreatedAt,
                UpdatedAt = projectMember.UpdatedAt,
            };
        }

        public static ProjectMember ToEntity(this ProjectMemberDTO projectMemberDTO)
        {
            if (projectMemberDTO == null) return null!;
            return new ProjectMember
            {
                Id = projectMemberDTO.Id ?? Guid.NewGuid(),
                ProjectId = projectMemberDTO.ProjectId ?? Guid.Empty,
                MemberId = projectMemberDTO.MemberId ?? Guid.Empty,
                Role = projectMemberDTO.Role ?? string.Empty,
                CreatedAt = projectMemberDTO.CreatedAt,
                UpdatedAt = projectMemberDTO.UpdatedAt
            };
        }

        public static List<ProjectMemberDTO> ToDTO(this List<ProjectMember> projectMembers)
        {
            if (projectMembers == null) return null!;
            return projectMembers.Select(pm => pm.ToDTO()).ToList();
        }

        public static List<ProjectMember> ToEntity(this List<ProjectMemberDTO> projectMemberDTOs)
        {
            if (projectMemberDTOs == null) return null!;
            return projectMemberDTOs.Select(pm => pm.ToEntity()).ToList();
        }
    }
}