using EventMate_Data.Entities;
using Eventmate_Data.IRepositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventMate_Service.Services
{
    public class CostService
    {
        private readonly ICostRepository _costRepository;

        public CostService(ICostRepository costRepository)
        {
            _costRepository = costRepository;
        }

        public async Task AddCostAsync(Cost cost)
        {
            await _costRepository.AddCostAsync(cost);
        }

        public async Task<IEnumerable<Cost>> GetCostsByActivityIdAsync(Guid activityId)
        {
            return await _costRepository.GetCostsByActivityIdAsync(activityId);
        }

        public async Task<IEnumerable<Cost>> GetCostsByGroupIdAsync(Guid groupId)
        {
            return await _costRepository.GetCostsByGroupIdAsync(groupId);
        }

        public async Task<Cost?> GetCostByIdAsync(Guid costId)
        {
            return await _costRepository.GetCostByIdAsync(costId);
        }

        public async Task UpdateCostAsync(Cost cost)
        {
            await _costRepository.UpdateCostAsync(cost);
        }

        public async Task DeleteCostAsync(Guid costId)
        {
            await _costRepository.DeleteCostAsync(costId);
        }
    }
} 