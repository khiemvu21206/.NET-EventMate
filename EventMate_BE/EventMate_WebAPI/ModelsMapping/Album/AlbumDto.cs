namespace EventMate_WebAPI.ModelsMapping.Album
{


    public class AlbumDto
    {
        public Guid AlbumId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid? CreatedBy { get; set; }
        public string? CreatorName { get; set; }  // Chỉ lấy tên creator
        public Guid? GroupId { get; set; }
        public string? GroupName { get; set; }    // Chỉ lấy tên group
        public ICollection<MultimediaDto> Multimedia { get; set; } = new List<MultimediaDto>();
    }
}