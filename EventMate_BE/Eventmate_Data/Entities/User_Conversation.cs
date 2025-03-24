using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventMate_Data.Entities
{
    public class User_Conversation
    {
        [Key]
        public Guid UserconversationId { get; set; }
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public Guid ConversationId { get; set; }
        [ForeignKey("UserId")] public virtual User User { get; set; }
        [ForeignKey("ConversationId")] public virtual Conversations Conversation { get; set; }  
    }
}
