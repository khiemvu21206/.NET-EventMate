namespace EventMate_WebAPI.ModelsMapping.Authentication
{
    public class EditUser
    {
        public string? FullName { get; set; }
        public IFormFile? Avatar { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? CompanyName { get; set; }
        public string? Description { get; set; }
    }
}