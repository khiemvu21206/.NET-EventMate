using System;
using System.ComponentModel.DataAnnotations;
using EventMate_Common.Status;

namespace EventMate_WebAPI.ModelsMapping.Group
{
    public class ActivityCreateModel
    {
        [Required]
        public Guid PlanId { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        public DateTime? Schedule { get; set; }

        [Required]
        public Guid CreatedBy { get; set; }

        public string? Category { get; set; }

        [Required]
        public PlanDetailStatus Status { get; set; }
    }
} 