using EventMate.Data;
using Eventmate_Data.IRepositories;
using EventMate_Data.Entities;
using Microsoft.EntityFrameworkCore;
using EventMate_Common.Status;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Eventmate_Data.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly DataContext _context;

        public OrderRepository(DataContext context)
        {
            _context = context;
        }

        public async Task CreateOrderAsync(Order order)
        {
            _context.Orders!.Add(order);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Order>> GetOrdersByUserIdAsync(Guid userId, int skip, int take)
        {
            return await _context.Orders!
                .Include(o => o.Item)
                .Include(o => o.User)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        public async Task<List<Order>> GetOrdersBySellerIdAsync(Guid sellerId, int skip, int take)
        {
            return await _context.Orders!
                .Include(o => o.Item)
                .Include(o => o.User)
                .Where(o => o.Item.UserId == sellerId)
                .OrderByDescending(o => o.CreatedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        public async Task<Order?> GetOrderByIdAsync(Guid orderId)
        {
            return await _context.Orders!
                .Include(o => o.Item)
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);
        }

        public async Task<Order> UpdateOrderStatusAsync(Guid orderId, OrderStatus newStatus)
        {
            var order = await _context.Orders!.FindAsync(orderId);
            if (order == null)
                throw new Exception("Order not found");

            order.Status = newStatus;
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<int> GetTotalOrdersCountByUserIdAsync(Guid userId)
        {
            return await _context.Orders!
                .Where(o => o.UserId == userId)
                .CountAsync();
        }

        public async Task<int> GetTotalOrdersCountBySellerIdAsync(Guid sellerId)
        {
            return await _context.Orders!
                .Where(o => o.Item.UserId == sellerId)
                .CountAsync();
        }
    }
}
