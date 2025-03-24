using System;
using System.ComponentModel.DataAnnotations;

namespace EventMate_WebAPI.ModelsMapping.Album
{
    public class AlbumCreateModel
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        public Guid? CreatedBy { get; set; }

        public Guid? GroupId { get; set; }
    }
}