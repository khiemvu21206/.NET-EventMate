using EventMate_Common.Status;
using EventMate_Common.Type;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventMate_Data.Entities
{
    public class Messages
    {
        [Key]
        public Guid MessageId { get; set; }

        [Required]
        public Guid ConversationId { get; set; }

        [Required]
        public Guid SenderId { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        [Required]
        public MessageType MessageType { get; set; }

        [Required]
        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        [Required]
        public MessageStatus Status { get; set; }
        [ForeignKey("SenderId")] public virtual User User { get; set; }
        [ForeignKey("ConversationId")] public virtual Conversations Conversation { get; set; }

    }
}
