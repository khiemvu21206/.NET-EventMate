using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EventMate_Common.Status;

namespace EventMate_Data.Entities
{
    public class Report
    {
        [Key]
        public Guid ReportId { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public Guid OrderId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public ReportStatus Status { get; set; }
        [ForeignKey("UserId")] public virtual User User { get; set; }
        [ForeignKey("OrderId")] public virtual Order Order { get; set; }


    }
}
