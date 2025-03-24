using System;
using System.ComponentModel.DataAnnotations;


public class FavoriteMediaDTO
{
    [Required]
    public Guid MultimediaId { get; set; }
    [Required]
    public Guid UserId { get; set; }
}
