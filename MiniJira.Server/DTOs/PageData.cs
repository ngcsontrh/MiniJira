namespace MiniJira.Server.DTOs
{
    public class PageData<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public int Total { get; set; }
    }
}
