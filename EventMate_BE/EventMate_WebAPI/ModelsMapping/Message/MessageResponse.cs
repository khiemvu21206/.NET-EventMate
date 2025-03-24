using EventMate_Common.Type;
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

namespace EventMate_WebAPI.ModelsMapping.Message
{
    public class MessageResponse
    {
        public Guid MessageId { get; set; }

   
        public Guid ConversationId { get; set; }

        public UserMessage Sender { get; set; }

        public string Content { get; set; } = string.Empty;

        public MessageType MessageType { get; set; }
        public DateTime SentAt { get; set; }
    }

    public class UserMessage
    {
        public Guid UserId { get; set; }
        public string? Avatar { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
    }
    public class PagingRequest
    {
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
    }
}
