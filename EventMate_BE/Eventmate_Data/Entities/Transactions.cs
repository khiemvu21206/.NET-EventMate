using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace EventMate_Data.Entities
{
    public class Transactions
    {
        [Key]
        public Guid TransactionId { get; set; } 

        [Required]
        public string Type { get; set; } = string.Empty;

        [Required]
        public string Method { get; set; } = string.Empty;

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid WalletId { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public TransactionStatus Status { get; set; }
        [ForeignKey("UserId")] public virtual User User { get; set; }
        [ForeignKey("WalletId")] public virtual Wallet Wallet { get; set; }
    }
}
