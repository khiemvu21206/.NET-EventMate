using EventMate_Common.Status;
using EventMate_Common.Type;
using EventMate_Data.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EventMate_WebAPI.ModelsMapping.Group
{
    public class RequestModel
    {
        public Guid RequestId { get; set; }

        
        public Guid GroupId { get; set; }

        
        public Guid SenderId { get; set; }

        
        public string Email { get; set; }

        
        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        
        public RequestType RequestType { get; set; }

        
        public RequestStatus Status { get; set; }
        public virtual GroupModel Group { get; set; }
         public virtual SenderModel Sender { get; set; }
    }
}
