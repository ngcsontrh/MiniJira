namespace MiniJira.Server.Entities
{
    public class Project
    {
        public int Id { get; set; }
        public string Code { get; set; } = null!; // Mã số duy nhất của dự án (ví dụ: PRJ-001)
        public string Name { get; set; } = null!; // Tên dự án
        public string? Description { get; set; } // Mô tả dự án
        public DateTime CreatedAt { get; set; } // Ngày tạo
        public DateTime UpdatedAt { get; set; } // Ngày sửa
        public int CreatorId { get; set; } // ID của người tạo

        public virtual User Creator { get; set; } = null!;
        public virtual ICollection<ProjectMember> ProjectMembers { get; set; } = new List<ProjectMember>();
        public virtual ICollection<Issue> Issues { get; set; } = new List<Issue>();
    }
}