namespace EventMate_WebAPI.ModelsMapping.Authentication
{
    public class ChangePasswordModel
    {
        public string Token { get; set; } = string.Empty;
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
