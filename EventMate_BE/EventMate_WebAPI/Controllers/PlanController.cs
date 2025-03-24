using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using EventMate_Common.Common;
using EventMate_Common.Constants;
using EventMate_Data.Entities;

using EventMate_Service.Services;
using AutoMapper;
using EventMate_WebAPI.ModelsMapping.Group;
using System.Numerics;
using System.Diagnostics;
using Activity = EventMate_Data.Entities.Activity;

namespace EventMate_WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlanController : Controller
    {
        private readonly GroupService _groupService;
        private readonly PlanService _planService;
        private readonly AwsService _awsService;
        private readonly EmailService _emailService;
        private readonly IMapper _mapper;
        public PlanController(GroupService groupService,PlanService planService, IMapper mapper, AwsService awsService, EmailService emailService)
        {
            _planService = planService;
            _mapper = mapper;
            _awsService = awsService;
            _emailService = emailService;
            _groupService = groupService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var plans = await _planService.GetAllPlansAsync();
                var planModels = _mapper.Map<IEnumerable<PlanModel>>(plans);
                return Ok(new ApiResponse<IEnumerable<PlanModel>>(200, ResponseKeys.FetchPlanSuccess, planModels));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var plan = await _planService.GetPlanByIdAsync(id);
                if (plan == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Plan not found."));
                }
                var planModel = _mapper.Map<PlanModel>(plan);
                return Ok(new ApiResponse<PlanModel>(200, ResponseKeys.FetchPlanSuccess, planModel));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PlanCreateModel planCreateModel)
        {
            try
            {
                var groupEntity = await _groupService.GetGroupsByIdAsync(planCreateModel.GroupId); // Changed from event to group  
                if (groupEntity == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy nhóm.")); // Updated message  
                }
                var plan = _mapper.Map<Plans>(planCreateModel);
                await _planService.AddPlanAsync(plan);
                return StatusCode(200, new ApiResponse<string>(200, ResponseKeys.PlanCreated, "Create plan success"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] PlanEditModel planEditModel)
        {
            try
            {
                var planEntity = await _planService.GetPlanByIdAsync(planEditModel.PlanId);
                if (planEntity == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy plan.")); // Updated message
                }
                // Map the PlanModel to the existing plan entity
                planEntity.Title = planEditModel.Title;
                planEntity.Description = planEditModel.Description;
                planEntity.Schedule = planEditModel.Schedule;
                planEntity.Status = planEditModel.Status;
                await _planService.UpdatePlanAsync(planEntity);
                return StatusCode(200, new ApiResponse<string>(200, ResponseKeys.PlanUpdated, "Update plan success"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var planEntity = await _planService.GetPlanByIdAsync(id);  
                if (planEntity == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy plan.")); // Updated message  
                }
                await _planService.DeletePlanAsync(id);
                return Ok(new ApiResponse<string>(200, ResponseKeys.PlanDeleted, "Plan deleted successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpGet("activities")]
        public async Task<IActionResult> GetAllActivities()
        {
            try
            {
                var activities = await _planService.GetAllActivitiesAsync();
                var activityModels = _mapper.Map<IEnumerable<ActivityModel>>(activities);
                return Ok(new ApiResponse<IEnumerable<ActivityModel>>(200, ResponseKeys.FetchActivitySuccess, activityModels));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpGet("activities/{id}")]
        public async Task<IActionResult> GetActivityById(Guid id)
        {
            try
            {
                var activity = await _planService.GetActivityByIdAsync(id);
                if (activity == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Activity not found."));
                }
                var activityModel = _mapper.Map<ActivityModel>(activity);
                return Ok(new ApiResponse<ActivityModel>(200, ResponseKeys.FetchActivitySuccess, activityModel));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpPost("activities")]
        public async Task<IActionResult> CreateActivity([FromBody] ActivityCreateModel activityCreateModel)
        {
            try
            {
                var activity = _mapper.Map<Activity>(activityCreateModel);
                await _planService.AddActivityAsync(activity);
                return Ok(new ApiResponse<string>(200, ResponseKeys.ActivityCreated, "Activity created successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpPut("activities")]
        public async Task<IActionResult> UpdateActivity([FromBody] ActivityEditModel activityEditModel)
        {
            try
            {
                var activityEntity = await _planService.GetActivityByIdAsync(activityEditModel.ActivityId);
                if (activityEntity == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy activity.")); // Updated message
                }

                activityEntity.Content = activityEditModel.Content;
                activityEntity.Schedule = activityEditModel.Schedule;
                activityEntity.Category = activityEditModel.Category;
                activityEntity.Status = activityEditModel.Status;
                // Map the ActivityModel to the existing activity entity
                await _planService.UpdateActivityAsync(activityEntity);
                return Ok(new ApiResponse<string>(200, ResponseKeys.ActivityUpdated, "Activity updated successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpDelete("activities/{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            try
            {
                var acitivityEntity = await _planService.GetActivityByIdAsync(id);
                if (acitivityEntity == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy plan.")); // Updated message  
                }
                await _planService.DeleteActivityAsync(id);
                return Ok(new ApiResponse<string>(200, ResponseKeys.ActivityDeleted, "Activity deleted successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpGet("getListPlan/{groupId}")]
        public async Task<IActionResult> GetListPlanByGroupId(Guid groupId)
        {
            try
            {
                var groupEntity = await _groupService.GetGroupsByIdAsync(groupId); // Changed from event to group  
                if (groupEntity == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy nhóm.")); // Updated message  
                }
                var plans = await _planService.GetPlansByGroupIdAsync(groupId);
                var planModels = _mapper.Map<IEnumerable<PlanModel>>(plans);
                return Ok(new ApiResponse<IEnumerable<PlanModel>>(200, ResponseKeys.FetchPlanSuccess, planModels));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpGet("getListActivity/{planId}")]
        public async Task<IActionResult> GetListActivityByPlanId(Guid planId)
        {
            try
            {
                var planEntity = await _planService.GetPlanByIdAsync(planId);
                if (planEntity == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy plan.")); // Updated message
                }
                var activities = await _planService.GetActivitiesByPlanIdAsync(planId);
                var activityModels = _mapper.Map<IEnumerable<ActivityModel>>(activities);
                return Ok(new ApiResponse<IEnumerable<ActivityModel>>(200, ResponseKeys.FetchActivitySuccess, activityModels));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
    }
}
