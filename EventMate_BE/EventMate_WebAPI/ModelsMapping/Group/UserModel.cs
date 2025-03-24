using EventMate_Common.Status;
using System.ComponentModel.DataAnnotations;

namespace EventMate_WebAPI.ModelsMapping.Group
{
    public class UserModel
    {
        public Guid UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }

        public string? Avatar { get; set; }
      
        public string Email { get; set; } = string.Empty;

        public string? License { get; set; }
        public string? CompanyName { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public UserStatus Status { get; set; }
    }
}
