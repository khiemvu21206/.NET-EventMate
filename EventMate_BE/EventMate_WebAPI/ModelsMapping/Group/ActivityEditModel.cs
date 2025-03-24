using System;
using EventMate_Common.Status;

namespace EventMate_WebAPI.ModelsMapping.Group
{
    public class ActivityEditModel
    {
        public Guid ActivityId { get; set; }

        public string Content { get; set; } = string.Empty;

        public DateTime? Schedule { get; set; }

        public string? Category { get; set; }

        public PlanDetailStatus Status { get; set; }

    }
} 