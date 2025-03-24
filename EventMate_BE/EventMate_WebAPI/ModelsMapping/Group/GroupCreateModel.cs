using EventMate_Common.Status;
using System.ComponentModel.DataAnnotations;

namespace EventMate_WebAPI.ModelsMapping.Group
{
    public class GroupCreateModel
    {
        public IFormFile Img { get; set; }

       
        public string GroupName { get; set; } = string.Empty;

       
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

       
        public Guid EventId { get; set; }

       
        public int TotalMember { get; set; }

       
        public Guid Leader { get; set; }

        public string? Description { get; set; }

       
        public int Visibility { get; set; }//0-private 1-public

       
        public GroupStatus Status { get; set; }
    }
}
