using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventMate_Data.Entities
{
    public class FavoriteMedia
    {
        public Guid MultimediaId { get; set; } // ID của multimedia
        public Guid UserId { get; set; } // ID của người dùng

        [ForeignKey("MultimediaId")]
        public virtual Multimedia? Multimedia { get; set; } 

        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
    }
} 