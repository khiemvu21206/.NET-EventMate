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
    public class Item
    {
        [Key]
        public Guid ItemId { get; set; } 
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public Guid UserId { get; set; }    

        [Required]
        public decimal Price { get; set; }

        public string? Description { get; set; }

        public DateTime? TimeStart { get; set; }
        public DateTime? TimeEnd { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public ItemStatus Status { get; set; }
        [ForeignKey("UserId")] public virtual User User { get; set; }
        public virtual ICollection<Order>? Orders { get; set; } 

    }
}
