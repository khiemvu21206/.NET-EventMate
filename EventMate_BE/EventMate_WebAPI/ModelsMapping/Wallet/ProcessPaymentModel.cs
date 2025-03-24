using System.ComponentModel.DataAnnotations;

namespace EventMate_WebAPI.ModelsMapping.Wallet
{
    public class ProcessPaymentModel
    {
        [Required]
        public decimal Amount { get; set; }
    }
} 