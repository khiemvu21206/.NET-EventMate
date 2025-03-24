using EventMate_Common.Enum;

namespace EventMate_WebAPI.ModelsMapping.Event
{
    public class BannerDto
{
    public Guid EventId { get; set; }
    public string Name { get; set; }
    public string Banner { get; set; }
    public BannerStatus? BannerStatus { get; set; }
} 
}