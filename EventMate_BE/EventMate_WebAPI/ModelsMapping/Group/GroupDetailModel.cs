using EventMate_Common.Status;

namespace EventMate_WebAPI.ModelsMapping.Group
{
    public class GroupDetailModel
    {

        public Guid GroupId { get; set; }

        public string? Img { get; set; }


        public string GroupName { get; set; } = string.Empty;

        public string LeaderName { get; set; } = string.Empty;
        public string EventName { get; set; } = string.Empty;

        public string LeaderEmail { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Guid Leader { get; set; }

        public Guid EventId { get; set; }

        public string Currency { get; set; } = string.Empty;

        public int TotalMember { get; set; }



        public string? Description { get; set; }


        public int Visibility { get; set; }

        public string Place {  get; set; }
        public GroupStatus Status { get; set; }
    }
}



