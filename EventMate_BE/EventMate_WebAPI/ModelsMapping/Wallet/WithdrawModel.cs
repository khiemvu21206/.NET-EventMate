using System.ComponentModel.DataAnnotations;

namespace EventMate_WebAPI.ModelsMapping.Wallet
{
    public class WithdrawModel
    {
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        [Required]
        public string Method { get; set; } = string.Empty;

        [Required]
        public BankInfo BankInfo { get; set; } = new BankInfo();
    }

    public class BankInfo
    {
        [Required]
        public string BankName { get; set; } = string.Empty;

        [Required]
        public string AccountNumber { get; set; } = string.Empty;

        [Required]
        public string AccountName { get; set; } = string.Empty;
    }
} 