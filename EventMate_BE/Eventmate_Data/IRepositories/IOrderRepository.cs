using EventMate_Data.Entities;
using EventMate_Common.Status;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Eventmate_Data.IRepositories
{
    public interface IOrderRepository
    {
        Task CreateOrderAsync(Order order);
        Task<List<Order>> GetOrdersByUserIdAsync(Guid userId, int skip, int take);
        Task<List<Order>> GetOrdersBySellerIdAsync(Guid sellerId, int skip, int take);
        Task<Order?> GetOrderByIdAsync(Guid orderId);
        Task<Order> UpdateOrderStatusAsync(Guid orderId, OrderStatus newStatus);
        Task<int> GetTotalOrdersCountByUserIdAsync(Guid userId);
        Task<int> GetTotalOrdersCountBySellerIdAsync(Guid sellerId);
    }
}
