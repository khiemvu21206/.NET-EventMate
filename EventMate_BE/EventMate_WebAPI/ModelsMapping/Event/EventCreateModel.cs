using EventMate_Common.Status;
using EventMate_Common.Type;

namespace EventMate_WebAPI.ModelsMapping.Event
{
    public class EventCreateModel
    {
        public string? Name { get; set; }
        public string? Place { get; set; }
        public DateTime TimeStart { get; set; }
        public DateTime TimeEnd { get; set; }
        public IFormFile? Img { get; set; }
        public string? Description { get; set; }
        public Guid UserId { get; set; }
        public EventType Type { get; set; }
        public EventStatus Status { get; set; }
        public string? OrganizerName { get; set; }
        public IFormFile? OrganizerLogo { get; set; }
        public string? OrganizerDescription { get; set; }
        public IFormFile? banner { get; set; }
    }
}
