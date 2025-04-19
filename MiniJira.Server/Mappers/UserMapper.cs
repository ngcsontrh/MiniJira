using MiniJira.Server.DTOs;
using MiniJira.Server.Entities;

namespace MiniJira.Server.Mappers
{
    public static class UserMapper
    {
        public static UserDTO ToDTO(this User user)
        {
            if (user == null) return null!;
            return new UserDTO
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
        }

        public static User ToEntity(this UserDTO userDTO)
        {
            if (userDTO == null) return null!;
            return new User
            {
                Id = userDTO.Id ?? Guid.NewGuid(),
                Username = userDTO.Username ?? string.Empty,
                Email = userDTO.Email ?? string.Empty,
                Password = string.Empty, // Password is not included in DTO for security
                Role = userDTO.Role ?? string.Empty,
                CreatedAt = userDTO.CreatedAt,
                UpdatedAt = userDTO.UpdatedAt
            };
        }

        public static List<UserDTO> ToDTO(this List<User> users)
        {
            if (users == null) return null!;
            return users.Select(u => u.ToDTO()).ToList();
        }

        public static List<User> ToEntity(this List<UserDTO> userDTOs)
        {
            if (userDTOs == null) return null!;
            return userDTOs.Select(u => u.ToEntity()).ToList();
        }
    }
}