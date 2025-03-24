using EventMate_Common.DTOs;
using EventMate_Common.Status;
using Eventmate_Data.IRepositories;
using EventMate_Data.Entities;

namespace EventMate_Service.Services
{
    public class OrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IItemRepository _itemRepository;
        private readonly WalletService _walletService;

        public OrderService(
            IOrderRepository orderRepository,
            IItemRepository itemRepository,
            WalletService walletService)
        {
            _orderRepository = orderRepository;
            _itemRepository = itemRepository;
            _walletService = walletService;
        }

        private OrderDTO MapToDTO(Order order)
        {
            return new OrderDTO
            {
                OrderId = order.OrderId,
                TotalPrice = order.TotalPrice,
                CreatedAt = order.CreatedAt,
                Address = order.Address,
                PhoneNumber = order.PhoneNumber,
                Status = order.Status,
                UserId = order.UserId,
                UserName = order.User?.FullName ?? "Unknown",
                ItemId = order.ItemId,
                ItemName = order.Item?.Name ?? "Unknown",
                ItemPrice = order.Item?.Price ?? 0
            };
        }

        public async Task<(List<OrderDTO> Orders, int TotalCount)> GetOrdersByUserIdAsync(Guid userId, int page, int pageSize)
        {
            var skip = (page - 1) * pageSize;
            var orders = await _orderRepository.GetOrdersByUserIdAsync(userId, skip, pageSize);
            var totalCount = await _orderRepository.GetTotalOrdersCountByUserIdAsync(userId);
            return (orders.Select(MapToDTO).ToList(), totalCount);
        }

        public async Task<(List<OrderDTO> Orders, int TotalCount)> GetOrdersBySellerIdAsync(Guid sellerId, int page, int pageSize)
        {
            var skip = (page - 1) * pageSize;
            var orders = await _orderRepository.GetOrdersBySellerIdAsync(sellerId, skip, pageSize);
            var totalCount = await _orderRepository.GetTotalOrdersCountBySellerIdAsync(sellerId);
            return (orders.Select(MapToDTO).ToList(), totalCount);
        }

        public async Task<OrderDTO?> GetOrderByIdAsync(Guid orderId)
        {
            var order = await _orderRepository.GetOrderByIdAsync(orderId);
            return order != null ? MapToDTO(order) : null;
        }

        public async Task<OrderDTO> UpdateOrderStatusAsync(Guid orderId, OrderStatus newStatus)
        {
            var order = await _orderRepository.GetOrderByIdAsync(orderId);
            if (order == null)
                throw new Exception("Order not found");

            // Nếu order được accepted, xử lý payment và cập nhật item
            if (newStatus == OrderStatus.Accepted)
            {
                // Xử lý payment
                bool paymentSuccess = await _walletService.ProcessPaymentAsync(order.UserId, order.TotalPrice);
                if (!paymentSuccess)
                {
                    throw new Exception("Payment failed: Insufficient balance or wallet not found");
                }

                // Cập nhật số lượng item
                var item = await _itemRepository.GetItemByIdAsync(order.ItemId);
                if (item == null)
                {
                    throw new Exception("Item not found");
                }

                // Tính số lượng dựa vào tổng tiền và giá item
                int quantity = (int)(order.TotalPrice / item.Price);

                // Kiểm tra lại số lượng item
                if (item.Quantity < quantity)
                {
                    throw new Exception("Item quantity not enough");
                }

                // Giảm số lượng item
                item.Quantity -= quantity;
                if (item.Quantity == 0)
                {
                    item.Status = ItemStatus.OutOfStock;
                }
                await _itemRepository.UpdateItemAsync(item);
            }

            // Cập nhật trạng thái order
            var updatedOrder = await _orderRepository.UpdateOrderStatusAsync(orderId, newStatus);
            return MapToDTO(updatedOrder);
        }
    }
}