using AutoMapper;
using EventMate_Common.Common;
using EventMate_Common.Constants;
using EventMate_Common.Status;
using EventMate_Common.Type;
using EventMate_Data.Entities;
using EventMate_Service.Services;
using EventMate_WebAPI.ModelsMapping.Event;
using EventMate_WebAPI.ModelsMapping.Group;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using System.Text.Json;
using System.Text.RegularExpressions;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace EventMate_WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupController : Controller
    {

        private readonly GroupService _groupService;
        private readonly AwsService _awsService;
        private readonly EmailService _emailService;
        private readonly IMapper _mapper;
        private readonly string link_url = "http://localhost:3000/group/";
        public GroupController(GroupService groupService, IMapper mapper, AwsService awsService, EmailService emailService)
        {
            _groupService = groupService;
            _mapper = mapper;
            _awsService = awsService;
            _emailService = emailService;
        }

        [HttpPost("getAll")]
        public async Task<IActionResult> GetAllGroup([FromBody] GroupFilterRequest filterRequest)
        {
            try
            {
                // Fetch all groups from the service and convert to a list  
                var groups = (await _groupService.GetAllGroupsAsync()).ToList();

                // Apply search filter  
                if (!string.IsNullOrEmpty(filterRequest.SearchTerm))
                {
                    groups = groups.Where(g => g.GroupName.Contains(filterRequest.SearchTerm)).ToList(); // Adjust field as necessary  
                }

                // Apply sorting  
                if (!string.IsNullOrEmpty(filterRequest.SortBy))
                {
                    Comparison<Groups> comparison = null;

                    // Define comparison based on the SortBy value  
                    switch (filterRequest.SortBy.ToLower())
                    {
                        case "groupname":
                            comparison = (g1, g2) => string.Compare(g1.GroupName, g2.GroupName, StringComparison.Ordinal);
                            break;
                        case "createdat":
                            comparison = (g1, g2) => DateTime.Compare(g1.CreatedAt, g2.CreatedAt);
                            break;
                        // Add more cases for different properties as needed  
                        default:
                            break;
                    }

                    // Sort the list based on the comparison and Ascending flag  
                    if (comparison != null)
                    {
                        if (filterRequest.Ascending)
                        {
                            groups.Sort(comparison);
                        }
                        else
                        {
                            groups.Sort((g1, g2) => comparison(g2, g1));
                        }
                    }
                }

                // Pagination  
                var totalCount = groups.Count;
                var pagedData = groups
                    .Skip((filterRequest.CurrentPage - 1) * filterRequest.PageSize)
                    .Take(filterRequest.PageSize)
                    .ToList();

                // Create the response object  
                var response = new
                {
                    totalCount,
                    currentPage = filterRequest.CurrentPage,
                    data = pagedData
                };

                return Ok(new ApiResponse<object>(200, ResponseKeys.FetchGroupSuccess, response));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
        [HttpPost("getAllGroupByUserId/{userId}")]
        public async Task<IActionResult> GetAllGroupByUser([FromBody] GroupFilterRequest filterRequest,Guid userId)
        {
            try
            {
                // Fetch all groups from the service and convert to a list  
                var groups = (await _groupService.GetAllGroupsByUserIdAsync(userId)).ToList();

                // Apply search filter  
                if (!string.IsNullOrEmpty(filterRequest.SearchTerm))
                {
                    groups = groups.Where(g => g.GroupName.Contains(filterRequest.SearchTerm)).ToList(); // Adjust field as necessary  
                }

                // Apply sorting  
                if (!string.IsNullOrEmpty(filterRequest.SortBy))
                {
                    Comparison<Groups> comparison = null;

                    // Define comparison based on the SortBy value  
                    switch (filterRequest.SortBy.ToLower())
                    {
                        case "groupname":
                            comparison = (g1, g2) => string.Compare(g1.GroupName, g2.GroupName, StringComparison.Ordinal);
                            break;
                        case "createdat":
                            comparison = (g1, g2) => DateTime.Compare(g1.CreatedAt, g2.CreatedAt);
                            break;
                        // Add more cases for different properties as needed  
                        default:
                            break;
                    }

                    // Sort the list based on the comparison and Ascending flag  
                    if (comparison != null)
                    {
                        if (filterRequest.Ascending)
                        {
                            groups.Sort(comparison);
                        }
                        else
                        {
                            groups.Sort((g1, g2) => comparison(g2, g1));
                        }
                    }
                }

                // Pagination  
                var totalCount = groups.Count;
                var pagedData = groups
                    .Skip((filterRequest.CurrentPage - 1) * filterRequest.PageSize)
                    .Take(filterRequest.PageSize)
                    .ToList();
                var groupModels=_mapper.Map<List<GroupModel>>(pagedData);
                // Create the response object  
                var response = new
                {
                    totalCount,
                    currentPage = filterRequest.CurrentPage,
                    data = groupModels
                };

                return Ok(new ApiResponse<object>(200, ResponseKeys.FetchGroupSuccess, response));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
        [HttpPost("getAllUser")]
        public async Task<IActionResult> GetAllUser()
        {
            try
            {
                var groups = await _groupService.GetAllUsersAsync();
                return Ok(new ApiResponse<IEnumerable<User>>(200, ResponseKeys.FetchGroupSuccess, groups));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }



        [HttpGet("getAllRequest/{userId}")]
        public async Task<IActionResult> GetAllRequest(Guid userId)
        {
            try
            {
                // Check if the user exists. Change condition to check for non-existence.  
                if (await _groupService.IsUserByIdAsync(userId))
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy user."));
                }

                var requests = await _groupService.GetAllRequestAsync(userId);

                // Check if requests are null or empty, and respond accordingly  
                if (requests == null || !requests.Any())
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy yêu cầu."));
                }
                // Create a response object  
                var response = _mapper.Map<IEnumerable<RequestModel>>(requests);
                return StatusCode(200, new ApiResponse<IEnumerable<RequestModel>>(200, ResponseKeys.FetchGroupSuccess, response));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
        [HttpGet("findUser/{id}")]
        public async Task<IActionResult> findUserById(Guid id)
        {
            try
            {


                if (await _groupService.IsUserByIdAsync(id))
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy group."));
                }

                return BadRequest(new ApiResponse<string>(400, ResponseKeys.NotFound, "oke"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
        [HttpGet("findGroup/{id}")]
        public async Task<IActionResult> findGroupById(Guid id)
        {
            try
            {

                var groupEntity = await _groupService.GetGroupsByIdAsync(id); // Changed from event to group  
                if (groupEntity == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy nhóm.")); // Updated message  
                }
                var response = _mapper.Map<GroupDetailModel>(groupEntity);


                return Ok(new ApiResponse<GroupDetailModel>(200, ResponseKeys.FetchGroupSuccess, response));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpPost("AddGroup")]
        public async Task<IActionResult> PostGroup(GroupCreateModel groupCreateModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<string>(400, ResponseKeys.InvalidRequest, "Dữ liệu không hợp lệ."));
            }
            
            try
            {
                
                string s = string.Format(Constants.urlImg, "amzn-eventmate-group", groupCreateModel.Img.FileName);
                Groups groups = new Groups()
                {
                    GroupId = Guid.NewGuid(),
                    GroupName = groupCreateModel.GroupName,
                    CreatedAt = DateTime.Now,
                    Description = groupCreateModel.Description,
                    EventId = groupCreateModel.EventId,
                    Leader = groupCreateModel.Leader,
                    TotalMember = groupCreateModel.TotalMember,
                    Visibility = groupCreateModel.Visibility,
                    Status = GroupStatus.Active,
                    Img = s,
                    Currency="VND"
                };
                await _groupService.AddGroupAsync(groups);
                await _awsService.addFile(groupCreateModel.Img, "amzn-eventmate-group");
                var success = await _groupService.AddUserToGroupAsync(groups.Leader, groups.GroupId);
                if (!success)
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.ErrorUserAlreadyInGroup, "Người dùng đã ở trong nhóm này."));
                }
                var conversation = new Conversations
                {
                    Id = new Guid(), // Assign the conversation ID (if applicable)  
                    Name = groups.GroupName,
                    GroupId = groups.GroupId,
                    Type = ConversationType.Group, // Adjust based on your application logic  
                    CreatedAt = DateTime.UtcNow,
                    Status = ConversationStatus.In_Progress // Set default status or modify as needed  
                };
                var successConversation = await _groupService.AddConversationToGroupAsync(conversation);
                if (!successConversation)
                {
                    return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, "Không thể thêm cuộc trò chuyện vào nhóm."));
                }
                // Add leader to the conversation
                await _groupService.AddUserToConversationAsync(groups.Leader, groups.GroupId);
                return Ok(new ApiResponse<string>(200, ResponseKeys.GroupCreated, groups.GroupId.ToString())); // Updated response message and key  
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
        [HttpPost("requestCreate")]
        public async Task<IActionResult> CreateRequest(Guid groupId, Guid senderId, string email)
        {
            try
            {
                if (groupId == Guid.Empty || senderId == Guid.Empty)
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.ErrorUserAlreadyInGroup, "Group ID and User ID are required."));

                }
                var groupEntity = await _groupService.GetGroupsByIdAsync(groupId); // Changed from event to group  
                if (groupEntity == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy nhóm.")); // Updated message  
                }
                //if (await _groupService.IsUserInGroupAsync(email, groupId))
                //{
                //    return BadRequest(new ApiResponse<string>(401, ResponseKeys.DuplicateGroupName, "user already in group")); // Updated message  

                //}
                if (await _groupService.IsUserByIdAsync(senderId))
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy user." + senderId)); // Updated message  
                }
                var group = _groupService.GetGroupsByIdAsync(groupId);
                var request = new Requests
                {
                    RequestId = Guid.NewGuid(),
                    GroupId = groupId,
                    SenderId = senderId,
                    Email = email,
                    RequestType = RequestType.Invite, // Set default or based on your logic  
                    Status = RequestStatus.Pending // Set initial status  
                };

                await _groupService.AddRequestAsync(request);
                await _emailService.SendEmail(email, "you are request to join this group", "click this link to view your in invitation to group " + request.Group.GroupName + " :"
                   + link_url + "accept-invitation/" + groupId + "/" + email);
                return Ok(new ApiResponse<string>(200, ResponseKeys.RequestCreated, "Request created successfully.")); // Updated response message and key  
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGroup(Guid id)
        {
            try
            {
                var groupEntity = await _groupService.GetGroupsByIdAsync(id); // Changed service to _groupService  
                if (groupEntity == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy nhóm cần xóa.")); // Updated message  
                }

                await _groupService.DeleteGroupAsync(id); // Changed method to DeleteGroupAsync  
                return Ok(new ApiResponse<string>(200, ResponseKeys.GroupDeleted, "Nhóm đã được xóa thành công.")); // Updated response message  
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
        [HttpPut("change-status/{groupId}")]
        public async Task<IActionResult> ChangeGroupStatus(Guid groupId, [FromBody] GroupStatus newStatus)
        {
            try
            {
                var groupEntity = await _groupService.GetGroupsByIdAsync(groupId); // Changed from event to group  
                if (groupEntity == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy nhóm cần cập nhật.")); // Updated message  
                }

                var success = await _groupService.ChangeGroupStatusAsync(groupId, newStatus); // Changed service method  
                if (!success)
                {
                    return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, "Không thể cập nhật trạng thái nhóm.")); // Updated error message  
                }

                return Ok(new ApiResponse<string>(200, ResponseKeys.GroupUpdated, "Trạng thái nhóm đã được cập nhật thành công.")); // Updated response message and key  
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
        [HttpPost("add-user-to-group/{groupId}/{userId}")]
        public async Task<IActionResult> AddUserToGroup(Guid groupId, Guid userId)
        {

            try
            {
                if (groupId == Guid.Empty || userId == Guid.Empty)
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.ErrorUserAlreadyInGroup, "Group ID and User ID are required."));

                }
                var groupEntity = await _groupService.GetGroupsByIdAsync(groupId); // Changed from event to group  
                if (groupEntity == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy nhóm.")); // Updated message  
                }
                if (await _groupService.IsUserByIdAsync(userId))
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy user.")); // Updated message  
                }
                var success = await _groupService.AddUserToGroupAsync(userId, groupId);
                if (!success)
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.ErrorUserAlreadyInGroup, "Người dùng đã ở trong nhóm này."));
                }

                // Add user to the conversation
                await _groupService.AddUserToConversationAsync(userId, groupId);

                return Ok(new ApiResponse<string>(200, ResponseKeys.UserAddedToGroup, "Người dùng đã được thêm vào nhóm thành công."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
        [HttpPost("add-conversation-to-group/{groupId}")]
        public async Task<IActionResult> AddConversationToGroup(Guid groupId, [FromBody] string conversationName)
        {
            try
            {
                if (groupId == Guid.Empty || string.IsNullOrWhiteSpace(conversationName))
                {
                    return BadRequest("Group ID, Conversation ID, and Conversation Name are required.");
                }

                var conversation = new Conversations
                {
                    Id = new Guid(), // Assign the conversation ID (if applicable)  
                    Name = conversationName,
                    GroupId = groupId,
                    Type = ConversationType.Group, // Adjust based on your application logic  
                    CreatedAt = DateTime.UtcNow,
                    Status = ConversationStatus.In_Progress // Set default status or modify as needed  
                };
                var success = await _groupService.AddConversationToGroupAsync(conversation);
                if (!success)
                {
                    return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, "Không thể thêm cuộc trò chuyện vào nhóm."));
                }

                return Ok(new ApiResponse<string>(200, ResponseKeys.ConversationAddedToGroup, "Cuộc trò chuyện đã được thêm vào nhóm thành công."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
        [HttpGet("list-users-in-group/{groupId}")]
        public async Task<IActionResult> ListUsersInGroup(Guid groupId)
        {
            try
            {
                if (groupId == Guid.Empty)
                {
                    return BadRequest("Group ID is required.");
                }
                var users = await _groupService.ListUsersInGroupAsync(groupId);

                if (users == null || !users.Any())
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NoUsersFound, "Không tìm thấy users."));
                }
                var response = _mapper.Map<List<User_GroupModel>>(users);

                return Ok(new ApiResponse<List<UserModel>>(200, ResponseKeys.UsersRetrieved, response.Select(s => s.User).ToList()));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
        [HttpDelete("DeleteUserGroup/{userId}/{groupId}")]
        public async Task<IActionResult> DeleteUserGroup(Guid userId,Guid groupId)
        {
            try
            {
                var userGroupEntity = await _groupService.GetUserGroupAsync(userId,groupId); // Assuming you have a GetUserGroupByIdAsync  

                if (userGroupEntity == null)
                {
                    return NotFound(new ApiResponse<string>(
                        404,
                        ResponseKeys.NotFound,
                        "Không tìm thấy liên kết người dùng và nhóm cần xóa."
                    ));
                }

                await _groupService.DeleteUserGroupAsync(userGroupEntity.UsergroupId);

                return Ok(new ApiResponse<string>(
                    200,
                    ResponseKeys.UserGroupDeleted, // Change ResponseKey  
                    "Liên kết người dùng và nhóm đã được xóa thành công." // Change Message  
                ));
            }
            catch (Exception ex)
            {
                // Log the exception!  This is crucial for debugging.  
                // _logger.LogError(ex, "Error deleting UserGroup with ID: {UserGroupId}", id);  

                return StatusCode(500, new ApiResponse<string>(
                    500,
                    ResponseKeys.ErrorSystem,
                    $"Lỗi hệ thống: {ex.Message}" // Include the specific error message.  
                ));
            }
        }
        [HttpDelete("DeleteRequest/{userId}/{groupId}")]
        public async Task<IActionResult> DeleteRequest(Guid userId,Guid groupId)
        {
            try
            {
                var requestEntity = await _groupService.GetRequestAsync(userId, groupId);

                if (requestEntity == null)
                {
                    return NotFound(new ApiResponse<string>(
                        404,
                        ResponseKeys.NotFound,
                        "Không tìm thấy yêu cầu cần xóa."
                    ));
                }

                await _groupService.DeleteRequestAsync(requestEntity.RequestId);

                return Ok(new ApiResponse<string>(
                    200,
                    ResponseKeys.RequestDeleted,
                    "Yêu cầu đã được xóa thành công."
                ));
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "Error deleting request with ID: {RequestId}", id); // Log the error  
                return StatusCode(500, new ApiResponse<string>(
                    500,
                    ResponseKeys.ErrorSystem,
                    $"Lỗi hệ thống: {ex.Message}"
                ));
            }
        }
        [HttpPost("CreateTemplate/{groupId}/{userId}/{eventType}")]
        public async Task<IActionResult> CreateTemplateTimeLine(Guid groupId, Guid userId, int eventType)
        {
            try
            {
                if (groupId == Guid.Empty || userId == Guid.Empty)
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.InvalidRequest, "Group ID and User ID are required."));
                }

                var groupEntity = await _groupService.GetGroupsByIdAsync(groupId);
                if (groupEntity == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy nhóm."));
                }

                var success = await _groupService.CreateTemplateTimeLineAsync(eventType, groupId, userId);
                if (!success)
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.ErrorSystem, "Không thể tạo template timeline."));
                }

                return Ok(new ApiResponse<string>(200, ResponseKeys.TemplateCreated, "Template timeline đã được tạo thành công."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
        [HttpPut("ChangeGroupLeader/{userId}/{groupId}")]
        public async Task<IActionResult> ChangeGroupLeader(Guid userId, Guid groupId)
        {
            try
            {
                if (groupId == Guid.Empty || userId == Guid.Empty)
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.InvalidRequest, "Group ID and User ID are required."));
                }

                var groupEntity = await _groupService.GetGroupsByIdAsync(groupId);
                if (groupEntity == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy nhóm."));
                }

                var success = await _groupService.ChangeGroupLeaderAsync(userId, groupId);
                if (!success)
                {
                    return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, "Không thể thay đổi trưởng nhóm."));
                }

                return Ok(new ApiResponse<string>(200, ResponseKeys.GroupUpdated, "Trưởng nhóm đã được thay đổi thành công."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
        [HttpDelete("RemoveUserFromGroup/{userId}/{groupId}")]
        public async Task<IActionResult> RemoveUserFromGroup(Guid userId, Guid groupId)
        {
            try
            {
                if (groupId == Guid.Empty || userId == Guid.Empty)
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.InvalidRequest, "Group ID and User ID are required."));
                }

                var success = await _groupService.RemoveUserFromGroupAsync(userId, groupId);
                if (!success)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy người dùng trong nhóm."));
                }

                return Ok(new ApiResponse<string>(200, ResponseKeys.UserRemovedFromGroup, "Người dùng đã được xóa khỏi nhóm thành công."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
        [HttpPut("ChangeGroupCurrency/{groupId}/{currency}")]
        public async Task<IActionResult> ChangeGroupCurrency(Guid groupId, string currency)
        {
            try
            {
                if (groupId == Guid.Empty || string.IsNullOrWhiteSpace(currency))
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.InvalidRequest, "Group ID and currency are required."));
                }

                var groupEntity = await _groupService.GetGroupsByIdAsync(groupId);
                if (groupEntity == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy nhóm."));
                }

                var success = await _groupService.ChangeGroupCurrencyAsync(groupId, currency);
                if (!success)
                {
                    return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, "Không thể thay đổi tiền tệ của nhóm."));
                }

                return Ok(new ApiResponse<string>(200, ResponseKeys.GroupUpdated, "Tiền tệ của nhóm đã được thay đổi thành công."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
        [HttpDelete("RemovePlanFromGroup/{groupId}")]
        public async Task<IActionResult> RemovePlanFromGroup(Guid groupId)
        {
            try
            {
                if (groupId == Guid.Empty)
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.InvalidRequest, "Group ID is required."));
                }

                var groupEntity = await _groupService.GetGroupsByIdAsync(groupId);
                if (groupEntity == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy nhóm."));
                }

                var success = await _groupService.RemovePlansFromGroupAsync(groupId);
                if (!success)
                {
                    return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, "Không thể xóa các kế hoạch của nhóm."));
                }

                return Ok(new ApiResponse<string>(200, ResponseKeys.PlansRemoved, "Các kế hoạch của nhóm đã được xóa thành công."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
    }
}
