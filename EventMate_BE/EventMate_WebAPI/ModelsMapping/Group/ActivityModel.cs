using System;
using EventMate_Common.Status;

namespace EventMate_WebAPI.ModelsMapping.Group
{
    public class ActivityModel
    {
        public Guid ActivityId { get; set; }

        public Guid PlanId { get; set; }

        public string Content { get; set; } = string.Empty;

        public DateTime? Schedule { get; set; }

        public DateTime CreatedAt { get; set; }

        public string CreatedBy { get; set; }

        public string? Category { get; set; }

        public PlanDetailStatus Status { get; set; }
        public string StatusName => Status.ToString();

    }
} 