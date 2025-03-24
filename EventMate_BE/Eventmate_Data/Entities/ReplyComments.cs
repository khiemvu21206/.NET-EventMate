using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventMate_Data.Entities
{
    public class ReplyComments
    {
        [Key]
        public Guid ReplyCommentId { get; set; } 

        [Required]
        public string Content { get; set; } = string.Empty;

        [Required]
        public Guid CommentId { get; set; }

        [Required]
        public Guid CommentBy { get; set; }

        [Required]
        public DateTime CommentAt { get; set; } = DateTime.UtcNow;
        [ForeignKey("CommentId")] public virtual Comments Comment { get; set; }
        [ForeignKey("CommentBy")] public virtual User User { get; set; }
    }
}
