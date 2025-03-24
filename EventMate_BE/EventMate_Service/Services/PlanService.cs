using Eventmate_Data.IRepositories;
using EventMate_Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventMate_Service.Services
{
    public class PlanService
    {
        private readonly IPlanRepository _planRepository;

        public PlanService(IPlanRepository planRepository)
        {
            _planRepository = planRepository;
        }

        public async Task<IEnumerable<Plans>> GetAllPlansAsync()
        {
            return await _planRepository.GetAllPlansAsync();
        }

        public async Task<Plans?> GetPlanByIdAsync(Guid planId)
        {
            return await _planRepository.GetPlanByIdAsync(planId);
        }

        public async Task AddPlanAsync(Plans plan)
        {
            await _planRepository.AddPlanAsync(plan);
        }

        public async Task UpdatePlanAsync(Plans plan)
        {
            await _planRepository.UpdatePlanAsync(plan);
        }

        public async Task DeletePlanAsync(Guid planId)
        {
            await _planRepository.DeletePlanAsync(planId);
        }

        public async Task<IEnumerable<Activity>> GetAllActivitiesAsync()
        {
            return await _planRepository.GetAllActivitiesAsync();
        }

        public async Task<Activity?> GetActivityByIdAsync(Guid activityId)
        {
            return await _planRepository.GetActivityByIdAsync(activityId);
        }

        public async Task AddActivityAsync(Activity activity)
        {
            await _planRepository.AddActivityAsync(activity);
        }

        public async Task UpdateActivityAsync(Activity activity)
        {
            await _planRepository.UpdateActivityAsync(activity);
        }

        public async Task DeleteActivityAsync(Guid activityId)
        {
            await _planRepository.DeleteActivityAsync(activityId);
        }

        public async Task<IEnumerable<Plans>> GetPlansByGroupIdAsync(Guid groupId)
        {
            return await _planRepository.GetPlansByGroupIdAsync(groupId);
        }

        public async Task<IEnumerable<Activity>> GetActivitiesByPlanIdAsync(Guid planId)
        {
            return await _planRepository.GetActivitiesByPlanIdAsync(planId);
        }

        // Add any additional methods that might be needed for consistency
    }
}
