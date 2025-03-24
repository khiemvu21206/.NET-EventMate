using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventMate_Data.Entities
{
    public class Role
    {
        [Key]
        public Guid RoleId { get; set; }
        [Required]
        public string RoleName { get; set; }
        [Required]
        public int Status { get; set; }
        public virtual ICollection<User>? User { get; set; }



    }
}
