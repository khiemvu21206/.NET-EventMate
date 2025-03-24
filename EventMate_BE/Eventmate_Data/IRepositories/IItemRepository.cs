using EventMate_Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Eventmate_Data.IRepositories
{
    public interface IItemRepository
    {
        Task<IEnumerable<Item>> GetAllItemsAsync();
        Task<IEnumerable<Item>> GetItemsByUserAsync(Guid userId);
        Task<Item?> GetItemByIdAsync(Guid itemId);
        Task UpdateItemAsync(Item item);
    }
}
