using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EventMate_Common.Status;
using EventMate_Common.Type;
using EventMate_Data.Entities;

namespace EventMate_Data.Entities
{
    public class Cost
    {
        [Key]
        public Guid CostId { get; set; }

        // Make ActivityId nullable  
        public Guid? ActivityId { get; set; }

        [Required]
        public Guid? GroupId { get; set; }

        [Required]
        public decimal Amount { get; set; }

        public string? Description { get; set; }
        public string? Category { get; set; }


        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public Guid CreatedBy { get; set; }

        [Required]
        public CostStatus Status { get; set; }

        // Foreign key relationships  
        [ForeignKey("ActivityId")]
        public virtual Activity? Activity { get; set; } // Make Activity navigation property nullable  

        [ForeignKey("CreatedBy")]
        public virtual User Creator { get; set; }
        [ForeignKey("GroupId")]
        public virtual Groups Group { get; set; }
    }
}