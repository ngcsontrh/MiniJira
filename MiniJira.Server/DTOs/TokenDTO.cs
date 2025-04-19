namespace MiniJira.Server.DTOs
{
    public class TokenDTO
    {
        public string AccessToken { get; set; } = null!;
        public Guid UserId { get; set; }
        public string Username { get; set; } = null!;
        public string UserEmail { get; set; } = null!;
        public string UserRole { get; set; } = null!;
    }
}