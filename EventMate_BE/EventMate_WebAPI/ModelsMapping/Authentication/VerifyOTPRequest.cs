namespace EventMate_WebAPI.ModelsMapping.Authentication
{
    public class VerifyOTPRequest
    {
        public string? OTP { get; set; } 
        public string? Token { get; set; }
        public IFormFile? BusinessLicense { get; set; }
        public string? Address { get; set; }
        public string? CompanyName { get; set; }
        public string? Phone { get; set; }
    }
}
