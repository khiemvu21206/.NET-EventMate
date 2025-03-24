using EventMate_Common.Status;
using System.ComponentModel.DataAnnotations;

namespace EventMate_WebAPI.ModelsMapping.Group
{
    public class PlanCreateModel
    {
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime? Schedule { get; set; }

        public Guid GroupId { get; set; }

        public PlanStatus Status { get; set; }
    }
}
