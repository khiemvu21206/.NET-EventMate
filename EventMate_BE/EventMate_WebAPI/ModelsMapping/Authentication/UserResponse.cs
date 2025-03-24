namespace EventMate_WebAPI.ModelsMapping.Authentication
{
    public class UserResponse
    {
        public Guid UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; }
        public string? Avatar { get; set; }
        public string Role { get; set; }
    }
}
