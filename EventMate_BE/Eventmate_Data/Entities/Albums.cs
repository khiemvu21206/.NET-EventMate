using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace EventMate_Data.Entities
{
    public class Albums
    {
        [Key]
        public Guid AlbumId { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Guid? CreatedBy { get; set; }  // Nullable

        // Khóa ngoại
        [ForeignKey("CreatedBy")]
        public virtual User? Creator { get; set; }

        public Guid? GroupId { get; set; }  // Nullable

        [ForeignKey("GroupId")]
        public virtual Groups? Group { get; set; }

        // Collection navigation property cho Multimedia
        public virtual ICollection<Multimedia> Multimedia { get; set; } = new List<Multimedia>();
    }
} 