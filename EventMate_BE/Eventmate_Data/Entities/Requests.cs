using EventMate_Common.Status;
using EventMate_Common.Type;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventMate_Data.Entities
{
    public class Requests
    {
        [Key]
        public Guid RequestId { get; set; } 

        [Required]
        public Guid GroupId { get; set; }

        [Required]
        public Guid SenderId { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        [Required]
        public RequestType RequestType { get; set; }

        [Required]
        public RequestStatus Status { get; set; }
        [ForeignKey("GroupId")] public virtual Groups Group { get; set; }
        [ForeignKey("SenderId")] public virtual User Sender { get; set; }

    }
}
