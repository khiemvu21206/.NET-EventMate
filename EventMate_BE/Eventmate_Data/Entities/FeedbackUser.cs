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
    public class FeedbackUser
    {
        [Key]
        public Guid FeedbackId { get; set; } 
        [Required]
        public float Rate { get; set; }

        [Required]
        public Guid GroupId { get; set; }

        [Required]
        public Guid ReviewerId { get; set; }

        [Required]
        public Guid ReviewedUserId { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public FeedbackType FeedbackType { get; set; }

        [Required]
        public FeedbackUserStatus Status { get; set; }
        [ForeignKey("GroupId")] public virtual Groups Group { get; set; }
        [ForeignKey("ReviewerId")] public virtual Groups Reviewer { get; set; }
        [ForeignKey("ReviewedUserId")] public virtual Groups Reviewed { get; set; }

    }
}
