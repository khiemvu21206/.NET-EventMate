using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EventMate_Data.Entities;

namespace Eventmate_Data.IRepositories
{
    public interface IActivityRepository
    {
        Task<IEnumerable<Activity>> GetAllActivitiesAsync();
        Task<Activity?> GetActivityByIdAsync(Guid activityId);
        Task AddActivityAsync(Activity activity);
        Task UpdateActivityAsync(Activity activity);
        Task DeleteActivityAsync(Guid activityId);
    }
} 