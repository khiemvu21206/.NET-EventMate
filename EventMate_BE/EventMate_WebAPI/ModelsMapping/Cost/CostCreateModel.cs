using EventMate_Common.Status;
using System;
using System.ComponentModel.DataAnnotations;

namespace EventMate_WebAPI.ModelsMapping.Cost
{
    public class CostCreateModel
    {
        public Guid? ActivityId { get; set; }

        public decimal Amount { get; set; }

        public string? Description { get; set; }
        public string? Category { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Guid CreatedBy { get; set; }
        public Guid GroupId { get; set; }


        public CostStatus Status { get; set; }
    }
} 