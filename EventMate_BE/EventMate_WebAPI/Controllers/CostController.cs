using AutoMapper;
using EventMate_Common.Common;
using EventMate_Data.Entities;
using EventMate_Service.Services;
using EventMate_WebAPI.ModelsMapping.Cost;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventMate_WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CostController : ControllerBase
    {
        private readonly CostService _costService;
        private readonly IMapper _mapper;

        public CostController(CostService costService, IMapper mapper)
        {
            _costService = costService;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> AddCost([FromBody] CostCreateModel costCreateModel)
        {
            var cost = _mapper.Map<Cost>(costCreateModel);
            await _costService.AddCostAsync(cost);
            return Ok(new ApiResponse<string>(200, ResponseKeys.CostCreated, "Cost added successfully."));
        }

        [HttpGet("activity/{activityId}")]
        public async Task<IActionResult> GetCostsByActivityId(Guid activityId)
        {
            var costs = await _costService.GetCostsByActivityIdAsync(activityId);
            var costModels = _mapper.Map<IEnumerable<CostModel>>(costs);
            return Ok(new ApiResponse<IEnumerable<CostModel>>(200, ResponseKeys.FetchCostSuccess, costModels));
        }
        [HttpGet("group/{groupId}")]
        public async Task<IActionResult> GetCostsByGroupId(Guid groupId)
        {
            try
            {
                var costs = await _costService.GetCostsByGroupIdAsync(groupId);
                var costModels = _mapper.Map<IEnumerable<CostModel>>(costs);
                return Ok(new ApiResponse<IEnumerable<CostModel>>(200, ResponseKeys.FetchCostSuccess, costModels));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<string>(400, ResponseKeys.BadRequest, "bad request: "+ex.Message));

            }

        }
        [HttpGet("{costId}")]
        public async Task<IActionResult> GetCostById(Guid costId)
        {
            var cost = await _costService.GetCostByIdAsync(costId);
            if (cost == null)
            {
                return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Cost not found."));
            }
            var costModel = _mapper.Map<CostModel>(cost);
            return Ok(new ApiResponse<CostModel>(200, ResponseKeys.FetchCostSuccess, costModel));
        }

        [HttpPut("UpdateCost")]
        public async Task<IActionResult> UpdateCost(CostUpdateModel costModel)
        {
            try
            {
                var cost = await _costService.GetCostByIdAsync(costModel.CostId);
                if (cost == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Cost not found."));
                }
                cost.Status = costModel.Status;
                cost.CreatedAt = costModel.CreatedAt;
                cost.CreatedBy = costModel.CreatedBy;
                cost.Amount = costModel.Amount;
                cost.Category = costModel.Category;
                cost.Description = costModel.Description;
          
                await _costService.UpdateCostAsync(cost);
                return Ok(new ApiResponse<string>(200, ResponseKeys.CostUpdated, "Cost updated successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<string>(400, ResponseKeys.BadRequest, "bad request: " + ex.Message));
            }

        }
        

        [HttpDelete("{costId}")]
        public async Task<IActionResult> DeleteCost(Guid costId)
        {
            await _costService.DeleteCostAsync(costId);
            return Ok(new ApiResponse<string>(200, ResponseKeys.CostDeleted, "Cost deleted successfully."));
        }
    }
} 