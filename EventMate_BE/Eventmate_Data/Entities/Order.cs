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
    public class Order
    {
        [Key]
        public Guid OrderId { get; set; } 

        [Required]
        public decimal TotalPrice { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public Guid UserId { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }

        public DateTime? TimeEnd { get; set; }

        [Required]
        public Guid ItemId { get; set; }

        [Required]
        public OrderStatus Status { get; set; }
        [ForeignKey("ItemId")] public virtual Item Item { get; set; }
        [ForeignKey("UserId")] public virtual User User { get; set; }
        public virtual ICollection<Report>? Reports { get; set; }

    }
}
