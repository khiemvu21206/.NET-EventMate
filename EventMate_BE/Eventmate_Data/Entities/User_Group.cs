using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventMate_Data.Entities
{
    public class User_Group
    {
        [Key]
        public Guid UsergroupId { get; set; }
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public Guid GroupId { get; set; }
        [ForeignKey("UserId")] public virtual User User { get; set; }
        [ForeignKey("GroupId")] public virtual Groups Group { get; set; }
    }
}
