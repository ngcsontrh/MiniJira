namespace MiniJira.Server.DTOs
{
    public class ChangePasswordDTO
    {
        public string Username { get; set; } = null!;
        public string CurrentPassword { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }
}
