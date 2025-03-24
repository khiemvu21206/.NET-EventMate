using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Eventmate_Data.Entities
{
    public class OTPAuthen
    {
        [Key]
        public Guid OTPId { get; set; }
        [Required]
        public string OTPCode { get; set; }
        [Required]
        public DateTime CreateAt { get; set; }
        [Required]
        public DateTime ExpireTime { get; set; }
        [Required]
        public string Token { get; set; }

        
    }
}
