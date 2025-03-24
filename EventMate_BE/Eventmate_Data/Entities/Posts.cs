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
    public class Posts
    {
        [Key]
        public Guid PostId { get; set; } 

        [Required]
        public Guid EventId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        [Required]
        public PostType Type { get; set; }

        [Required]
        public PostStatus Status { get; set; }
        [ForeignKey("EventId")] public virtual Events Event { get; set; } = null!;
        [ForeignKey("UserId")] public virtual User User { get; set; }
        public virtual ICollection<Comments>? Comments { get; set; }
        public virtual ICollection<Reactions>? Reactions { get; set; }
    }
}
