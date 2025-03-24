using EventMate_Common.Enum;
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
    public class Events
    {
        [Key]
        public Guid EventId { get; set; } 

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Place { get; set; } = string.Empty;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public DateTime TimeStart { get; set; }

        [Required]
        public DateTime TimeEnd { get; set; }

        public string? Img { get; set; }

        public string? Description { get; set; }
        public string? OrganizerName { get; set; }
        public string? OrganizerLogo { get; set; }
        public string? OrganizerDescription { get; set; }

        public string? banner { get; set; }
        public BannerStatus? BannerStatus { get; set; }

        [Required]
        public EventType Type { get; set; }

        [Required]
        public EventStatus Status { get; set; }


        [ForeignKey("UserId")] public virtual User User { get; set; }
        public virtual ICollection<Posts>? Posts { get; set; }   
        public virtual ICollection<Groups>? Groups {  get; set; }
    }
}
 
 