using EventMate.Data;
using Eventmate_Data.Entities;
using Eventmate_Common.Helpers;
using EventMate_Data.Entities;
using Eventmate_Data.IRepositories;
using Microsoft.EntityFrameworkCore;
namespace Eventmate_Data.Repositories
{
    public class CostRepository : ICostRepository
    {
        private readonly DataContext _context;

        public CostRepository(DataContext context)
        {
            _context = context;
        }

        public async Task AddCostAsync(Cost cost)
        {
            await _context.Costs
                .AddAsync(cost);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Cost>> GetCostsByActivityIdAsync(Guid activityId)
        {
            return await _context.Costs
                .Where(c => c.ActivityId == activityId)
                .ToListAsync();
        }
        public async Task<IEnumerable<Cost>> GetCostsByGroupIdAsync(Guid groupId)
        {
            return await _context.Costs
                .Include(c => c.Creator)
                .Where(c => c.GroupId == groupId)
                .ToListAsync();
        }

        public async Task<Cost?> GetCostByIdAsync(Guid costId)
        {
            return await _context.Costs
                .Include(c => c.Creator)
                .FirstOrDefaultAsync(c=>c.CostId==costId);
        }

        public async Task UpdateCostAsync(Cost cost)
        {
            _context.Costs.Update(cost);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCostAsync(Guid costId)
        {
            var cost = await _context.Costs.FindAsync(costId);
            if (cost != null)
            {
                _context.Costs.Remove(cost);
                await _context.SaveChangesAsync();
            }
        }
    }

    
} 