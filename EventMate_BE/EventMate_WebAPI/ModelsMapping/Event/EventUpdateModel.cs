using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace EventMate_WebAPI.ModelsMapping.Event
{
    // Model mới chỉ chứa các trường cần thiết
    public class EventUpdateModel
    {

        public string TimeStart { get; set; } 
        public string TimeEnd { get; set; }

        public IFormFile? Banner { get; set; }
    }
}
