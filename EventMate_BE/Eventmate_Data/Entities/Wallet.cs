using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventMate_Data.Entities
{
    public class Wallet
    {
        [Key]
        public Guid WalletId { get; set; } 

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public decimal Balance { get; set; }
        [ForeignKey("UserId")] public virtual User User { get; set; }
        public virtual ICollection<Transactions>? Transactions { get; set; }
    }
}
