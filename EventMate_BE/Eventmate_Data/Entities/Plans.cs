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
    public class Plans
    {
        [Key]
        public Guid PlanId { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime? Schedule { get; set; }

        [Required]
        public Guid GroupId { get; set; }

        [Required]
        public PlanStatus Status { get; set; }
        [ForeignKey("GroupId")] public virtual Groups Group { get; set; } = null!;
        public virtual ICollection<Activity>? Activities { get; set; }
    }
}
