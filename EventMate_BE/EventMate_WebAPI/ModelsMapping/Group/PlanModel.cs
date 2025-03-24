using EventMate_Common.Status;

namespace EventMate_WebAPI.ModelsMapping.Group
{
    public class PlanModel
    {
        public Guid PlanId { get; set; }
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime? Schedule { get; set; }

        public Guid GroupId { get; set; }

        public PlanStatus Status { get; set; }
        public string StatusName => Status.ToString();

        public virtual ICollection<ActivityModel>? Activities { get; set; }

    }
}
