using EventMate_Common.Status;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventMate_Data.Entities
{
    public class Groups
    {
        [Key]
        public Guid GroupId { get; set; } 
        public string? Img { get; set; }

        [Required]
        public string GroupName { get; set; } = string.Empty;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public Guid EventId { get; set; }

        [Required]
        public int TotalMember { get; set; }

        [Required]
        public Guid Leader { get; set; }

        public string? Description { get; set; }

        public string? Currency { get; set; } = "VND";


        [Required]
        public int Visibility { get; set; }

        [Required]
        public GroupStatus Status { get; set; }

        [ForeignKey("EventId")] public virtual Events Events { get; set; }
        [ForeignKey("Leader")] public virtual User User { get; set; }
        public virtual ICollection<Plans>? Plans { get; set; }
        public virtual ICollection<Cost>? Costs { get; set; }

        public virtual Conversations Conversation { get; set; }
        public virtual ICollection<Requests>? Requests { get; set; }
        public virtual ICollection<User_Group>? User_Groups { get; set; }
        public virtual ICollection<Albums>? Albums { get; set; }

    }
}
