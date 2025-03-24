using EventMate.Data;
using Eventmate_Data.IRepositories;
using EventMate_Data.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Eventmate_Data.Repositories
{
    public class ItemRepository : IItemRepository
    {
        private readonly DataContext _context;
        public ItemRepository(DataContext context) {
        _context = context;
        }

        public async Task<IEnumerable<Item>> GetAllItemsAsync()
        {
            var items = await _context.Item!.ToListAsync();
            return items;
        }

        public async Task<IEnumerable<Item>> GetItemsByUserAsync(Guid userId)
        {
            var items = await _context.Item!
                .Where(e => e.UserId == userId)
                .ToListAsync();
            return items;
        }
        public async Task<Item?> GetItemByIdAsync(Guid itemId)
        {
            var item = await _context.Item!.FindAsync(itemId);
            return item;
        }
        public async Task UpdateItemAsync(Item item)
        {
            _context.Item!.Update(item);
            await _context.SaveChangesAsync();
        }
    }
}
