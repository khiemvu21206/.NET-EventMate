using EventMate_Data.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Eventmate_Data.IRepositories
{
    public interface ICostRepository
    {
        Task AddCostAsync(Cost cost);
        Task<IEnumerable<Cost>> GetCostsByActivityIdAsync(Guid activityId);
        Task<Cost?> GetCostByIdAsync(Guid costId);
        Task UpdateCostAsync(Cost cost);
        Task DeleteCostAsync(Guid costId);
        Task<IEnumerable<Cost>> GetCostsByGroupIdAsync(Guid groupId);
    }
}