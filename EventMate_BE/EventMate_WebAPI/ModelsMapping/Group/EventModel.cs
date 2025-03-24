namespace EventMate_WebAPI.ModelsMapping.Group
{
    public class EventModel
    {
        public string Name { get; set; } = string.Empty;
        public string Place { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime TimeStart { get; set; }
        public DateTime TimeEnd { get; set; }
        public string? Img { get; set; }
        public string? Description { get; set; }
        public string? Banner { get; set; }

    }
}
