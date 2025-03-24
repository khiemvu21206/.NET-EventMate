using EventMate_Common.Status;

namespace EventMate_WebAPI.ModelsMapping.Group
{
    public class GroupModel
    {
        public Guid GroupId { get; set; }

        public string? Img { get; set; }


        public string GroupName { get; set; } = string.Empty;


        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


        public Guid EventId { get; set; }


        public int TotalMember { get; set; }


        public string Currency { get; set; } = string.Empty;

        public string? Description { get; set; }


        public int Visibility { get; set; }


        public GroupStatus Status { get; set; }

        public EventModel Event { get; set; }
    }
}
