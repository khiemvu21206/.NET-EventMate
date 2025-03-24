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
    public class Reactions
    {
        [Key]
        public Guid ReactionId { get; set; } 

        [Required]
        public Guid PostId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public ReactionType ReactionType { get; set; }

        [ForeignKey("PostId")] public virtual Posts Post { get; set; }
        [ForeignKey("UserId")] public virtual User User { get; set; }

    }
}
