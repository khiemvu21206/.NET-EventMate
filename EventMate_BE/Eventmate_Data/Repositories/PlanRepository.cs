using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EventMate.Data;
using Eventmate_Data.IRepositories;
using EventMate_Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Eventmate_Data.Repositories
{
    public class PlanRepository : IPlanRepository
    {
        private readonly DataContext _context;

        public PlanRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Plans>> GetAllPlansAsync()
        {
            return await _context.Plans.ToListAsync();
        }

        public async Task<Plans?> GetPlanByIdAsync(Guid planId)
        {
            return await _context.Plans
                .Include(p => p.Activities)
                .ThenInclude(c=>c.Costs)
                .FirstOrDefaultAsync(c=>c.PlanId==planId);
        }

        public async Task AddPlanAsync(Plans plan)
        {
            await _context.Plans.AddAsync(plan);
            await _context.SaveChangesAsync();
        }

        public async Task UpdatePlanAsync(Plans plan)
        {
            _context.Plans.Update(plan);
            await _context.SaveChangesAsync();
        }

        public async Task DeletePlanAsync(Guid planId)
        {
            var plan = await GetPlanByIdAsync(planId);
            if (plan != null)
            {
                // Delete all activities associated with the plan
                if (plan.Activities != null && plan.Activities.Any())
                {
                    foreach (var activity in plan.Activities)
                    {
                        if (activity.Costs != null && activity.Costs.Any())
                        {
                            _context.Costs.RemoveRange(activity.Costs);
                        }
                    }
                    _context.Activities.RemoveRange(plan.Activities);
                }

                // Delete the plan
                _context.Plans.Remove(plan);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Activity>> GetAllActivitiesAsync()
        {
            return await _context.Activities.ToListAsync();
        }

        public async Task<Activity?> GetActivityByIdAsync(Guid activityId)
        {
            return await _context.Activities.FindAsync(activityId);
        }

        public async Task AddActivityAsync(Activity activity)
        {
            await _context.Activities.AddAsync(activity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateActivityAsync(Activity activity)
        {
            _context.Activities.Update(activity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteActivityAsync(Guid activityId)
        {
            var activity = await GetActivityByIdAsync(activityId);
            if (activity != null)
            {
                _context.Activities.Remove(activity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Plans>> GetPlansByGroupIdAsync(Guid groupId)
        {
            var plans = await _context.Plans
                .Include(p => p.Activities)
                .ThenInclude(c => c.User)
                .Where(plan => plan.GroupId == groupId)
                .OrderBy(plan => plan.Schedule)
                .ToListAsync();

            foreach (var plan in plans)
            {
                plan.Activities = plan.Activities.OrderBy(activity => activity.Schedule).ToList();
            }

            return plans;
        }

        public async Task<IEnumerable<Activity>> GetActivitiesByPlanIdAsync(Guid planId)
        {
            return await _context.Activities
                .Where(activity => activity.PlanId == planId)
                .ToListAsync();
        }
    }
}
