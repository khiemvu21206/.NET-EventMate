using System.ComponentModel.DataAnnotations;

namespace EventMate_WebAPI.ModelsMapping.Wallet
{
    public class DepositModel
    {
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        [Required]
        public string Method { get; set; } = string.Empty;
    }
} 