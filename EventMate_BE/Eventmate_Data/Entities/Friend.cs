using EventMate_Common.Enum;
using EventMate_Data.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Eventmate_Data.Entities
{
    public class Friend
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid FriendId { get; set; }
        public DateTime CreatedDate { get; set; }
        public FriendStatus Status { get; set; }
        [ForeignKey("UserId")] public virtual User User { get; set; }
        [ForeignKey("FriendId")] public virtual User FriendUser { get; set; }

    }
}
