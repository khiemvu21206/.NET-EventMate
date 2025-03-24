namespace EventMate_WebAPI.ModelsMapping.Authentication
{
    public class LoginGoogleModel
    {
        public string? GoogleId { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Avatar { get; set; }
    }
}