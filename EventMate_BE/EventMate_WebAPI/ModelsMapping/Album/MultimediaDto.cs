using EventMate_Common.Status;
using EventMate_Common.Type;

namespace EventMate_WebAPI.ModelsMapping.Album
{
    public class MultimediaDto
    {
        public Guid ImageId { get; set; }
        public string Url { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public Guid CreatedBy { get; set; }
        public string CreatorName { get; set; } = string.Empty;

        public string CreatorImg { get; set; }

        public MultimediaType Type { get; set; }
        public MultimediaStatus Status { get; set; }
    }

   
}