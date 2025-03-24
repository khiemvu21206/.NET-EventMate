using EventMate_Common.Status;

namespace EventMate_WebAPI.ModelsMapping.Cost
{
    public class CostUpdateModel
    {
        public Guid CostId { get; set; }

        public decimal Amount { get; set; }

        public string? Description { get; set; }
        public string? Category { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid CreatedBy { get; set; }

        public CostStatus Status { get; set; }
    }
}
