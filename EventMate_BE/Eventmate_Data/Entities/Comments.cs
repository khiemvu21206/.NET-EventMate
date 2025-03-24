using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventMate_Data.Entities
{
    public class Comments
    {
        [Key]
        public Guid CommentId { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;
        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid PostId { get; set; }

        [Required]
        public int CommentBy { get; set; }

        [Required]
        public DateTime CommentAt { get; set; } = DateTime.UtcNow;
        [ForeignKey("PostId")] public virtual Posts Post {  get; set; }
        [ForeignKey("UserId")] public virtual User User { get; set; }
        public virtual ICollection<ReplyComments>? ReplyComments { get; set; }
    }
}
