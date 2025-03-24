using EventMate_Common.Type;
using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

public class MultimediaCreateModel
{
    [Required]
    public List<IFormFile> MediaFiles { get; set; } = new List<IFormFile>();  

    [Required]
    public Guid CreatedBy { get; set; }

    public Guid? AlbumId { get; set; }  // Nullable
} 