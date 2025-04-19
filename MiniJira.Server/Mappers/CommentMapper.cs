using MiniJira.Server.DTOs;
using MiniJira.Server.Entities;

namespace MiniJira.Server.Mappers
{
    public static class CommentMapper
    {
        public static CommentDTO ToDTO(this Comment comment)
        {
            if (comment == null) return null!;
            return new CommentDTO
            {
                Id = comment.Id,
                IssueId = comment.IssueId,
                UserId = comment.UserId,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                UpdatedAt = comment.UpdatedAt
            };
        }

        public static Comment ToEntity(this CommentDTO commentDTO)
        {
            if (commentDTO == null) return null!;
            return new Comment
            {
                Id = commentDTO.Id ?? Guid.NewGuid(),
                IssueId = commentDTO.IssueId ?? Guid.Empty,
                UserId = commentDTO.UserId ?? Guid.Empty,
                Content = commentDTO.Content ?? string.Empty,
                CreatedAt = commentDTO.CreatedAt,
                UpdatedAt = commentDTO.UpdatedAt
            };
        }

        public static List<CommentDTO> ToDTO(this List<Comment> comments)
        {
            if (comments == null) return null!;
            return comments.Select(c => c.ToDTO()).ToList();
        }

        public static List<Comment> ToEntity(this List<CommentDTO> commentDTOs)
        {
            if (commentDTOs == null) return null!;
            return commentDTOs.Select(c => c.ToEntity()).ToList();
        }
    }
}