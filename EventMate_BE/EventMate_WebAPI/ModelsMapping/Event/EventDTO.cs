using EventMate_Common.Status;
using EventMate_Common.Type;

namespace EventMate_WebAPI.ModelsMapping.Event
{
    public class EventDto
    {
        public Guid EventId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Place { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime TimeStart { get; set; }
        public DateTime TimeEnd { get; set; }
        public string? Img { get; set; }
        public string? Description { get; set; }
        public EventType Type { get; set; }
        public EventStatus Status { get; set; }
        public string? OrganizerName { get; set; }
        public string? OrganizerLogo { get; set; }
        public string? OrganizerDescription { get; set; }
        public string? Banner { get; set; }
    }

}
