namespace MiniJira.Server.Filters
{
    public class UserFilter
    {
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Username { get; set; }
    }
}
