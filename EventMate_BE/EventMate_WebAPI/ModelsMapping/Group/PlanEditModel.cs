using EventMate_Common.Status;

namespace EventMate_WebAPI.ModelsMapping.Group
{
    public class PlanEditModel
    {
        public Guid PlanId { get; set; }
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime? Schedule { get; set; }

        public PlanStatus Status { get; set; }

    }
}
