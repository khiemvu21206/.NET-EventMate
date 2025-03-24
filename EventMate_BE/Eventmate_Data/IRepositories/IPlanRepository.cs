using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EventMate_Data.Entities;

namespace Eventmate_Data.IRepositories
{
    public interface IPlanRepository
    {
        Task<IEnumerable<Plans>> GetAllPlansAsync();
        Task<Plans?> GetPlanByIdAsync(Guid planId);
        Task AddPlanAsync(Plans plan);
        Task UpdatePlanAsync(Plans plan);
        Task DeletePlanAsync(Guid planId);
        Task<IEnumerable<Activity>> GetAllActivitiesAsync();
        Task<Activity?> GetActivityByIdAsync(Guid activityId);
        Task AddActivityAsync(Activity activity);
        Task UpdateActivityAsync(Activity activity);
        Task DeleteActivityAsync(Guid activityId);
        Task<IEnumerable<Plans>> GetPlansByGroupIdAsync(Guid groupId);
        Task<IEnumerable<Activity>> GetActivitiesByPlanIdAsync(Guid planId);
        // Add any additional methods that might be needed for consistency
    }
}
