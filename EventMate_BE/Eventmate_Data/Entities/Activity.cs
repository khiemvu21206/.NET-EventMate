using EventMate_Common.Status;
using Eventmate_Data.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventMate_Data.Entities
{
    public class Activity
    {
        [Key]
        public Guid ActivityId { get; set; }
        [Required]
        public Guid PlanId { get; set; }
        
        [Required]
        public string Content { get; set; } = string.Empty;

        public DateTime? Schedule { get; set; }
        // Thêm các trường mới
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public Guid CreatedBy { get; set; }
        public string? Category { get; set; }

        [Required]
        public PlanDetailStatus Status { get; set; }
        [ForeignKey("PlanId")] public virtual Plans Plan { get; set; }

        [ForeignKey("CreatedBy")]
        public virtual User User { get; set; }

        public virtual ICollection<Cost>? Costs { get; set; }
    }
}
