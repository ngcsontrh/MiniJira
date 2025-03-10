namespace MiniJira.Server.Entities
{
    public class Issue
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!; // Tiêu đề lỗi
        public string? Description { get; set; } // Mô tả chi tiết
        public string? Status { get; set; } // Trạng thái lỗi
        public DateTime CreatedAt { get; set; } // Ngày tạo lỗi
        public DateTime UpdatedAt { get; set; } // Ngày cập nhật gần nhất
        public int ProjectId { get; set; } // Liên kết với dự án
        public int ReporterId { get; set; } // Người tạo lỗi (Tester)
        public int? AssigneeId { get; set; } // Người được phân công (Developer), Nullable vì có thể chưa phân công
        public string? Frequency { get; set; } // Mức độ lỗi thường xuyên
        public string? Priority { get; set; } // Độ ưu tiên
        public string? FilePaths { get; set; } // Đường dẫn các file, được lưu ở dạng json list

        public virtual Project Project { get; set; } = null!;
        public virtual User Reporter { get; set; } = null!;
        public virtual User? Assignee { get; set; }
    }
}