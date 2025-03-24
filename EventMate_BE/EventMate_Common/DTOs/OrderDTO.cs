using EventMate_Common.Status;

namespace EventMate_Common.DTOs
{
    public class OrderDTO
    {
        public Guid OrderId { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public OrderStatus Status { get; set; }

        // User info
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;

        // Item info
        public Guid ItemId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public decimal ItemPrice { get; set; }
    }

    public class OrderFilterRequest
    {
        public int CurrentPage { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class UpdateOrderStatusRequest
    {
        public Guid OrderId { get; set; }
        public OrderStatus NewStatus { get; set; }
    }
}