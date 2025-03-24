using EventMate_Common.Status;
using Eventmate_Data.IEventRepository;
using Eventmate_Data.IRepositories;
using EventMate_Data.Entities;
using EventMate_Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventMate_Service.Services
{
    public class ItemService
    {
        private readonly IItemRepository _itemRepository;
        private readonly IOrderRepository _orderRepository;
        public ItemService(IItemRepository itemRepository, IOrderRepository orderRepository)
        {
            _itemRepository = itemRepository;
            _orderRepository = orderRepository;
        }
        public async Task<IEnumerable<Item>> GetItemsAsync()
        {
            return await _itemRepository.GetAllItemsAsync();
        }
        public async Task<IEnumerable<Item>> GetItemByUserAsync(Guid userId)
        {
            return await _itemRepository.GetItemsByUserAsync(userId);
        }
        public async Task<Item?> GetItemByIdAsync(Guid itemId)
        {
            var item = await _itemRepository.GetItemByIdAsync(itemId);
            return item;
        }
        public async Task<Guid?> PurchaseItemAsync(Guid buyerId, Guid itemId, int quantity)
        {
            var item = await _itemRepository.GetItemByIdAsync(itemId);
            if (item == null || item.Quantity < quantity)
            {
                return null; // Không tìm thấy item hoặc số lượng không đủ
            }

            // Kiểm tra trạng thái sản phẩm
            if (item.Status == ItemStatus.OutOfStock || item.Status == ItemStatus.Discontinued)
            {
                return null;
            }

            // Tạo đơn hàng với status WaitingForApproval
            var order = new Order
            {
                OrderId = Guid.NewGuid(),
                UserId = buyerId,
                ItemId = itemId,
                TotalPrice = item.Price * quantity,
                Status = OrderStatus.WaitingForApproval,
                CreatedAt = DateTime.UtcNow
            };

            await _orderRepository.CreateOrderAsync(order);
            return order.OrderId;
        }
    }
}
