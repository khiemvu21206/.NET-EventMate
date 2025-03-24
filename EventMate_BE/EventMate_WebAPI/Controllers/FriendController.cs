using EventMate_Common.Common;
using EventMate_Common.Constants;
using EventMate_Common.Enum;
using EventMate_Common.Status;
using EventMate_Data.Entities;
using EventMate_Service.Services;
using EventMate_WebAPI.ModelsMapping.Common;
using EventMate_WebAPI.ModelsMapping.Group;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace EventMate_WebAPI.Controllers
{
    [Route("api/friends")]
    [ApiController]
    public class FriendController : ControllerBase
    {
        private readonly FriendService _friendService;
        private readonly GroupService _groupService;
        private readonly UserService _userService;

        public FriendController(FriendService friendService, GroupService groupService, UserService userService)
        {
            _friendService = friendService;
            _groupService = groupService;
            _userService = userService;
        }

        [HttpPost("request-add-friend")]
        public async Task<IActionResult> RequestAddFriend(string friendId)
        {
            try
            {
            
                if (!Guid.TryParse(friendId, out Guid parsedFriendId))
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.InvalidRequest, "Invalid FriendId format."));
                }

                var friend = await _userService.GetUserByIdAsync(parsedFriendId);
                if (friend == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.UserNotFound, "User Not Found"));
                }

                var token = HttpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", "");
                var userId = Helper.GetUserFromToken(token);
                if (!userId.HasValue)
                {
                    return Unauthorized();
                }

                await _friendService.RequestAddFrined(userId.Value, parsedFriendId);

                return Ok(new ApiResponse<string>(200, ResponseKeys.RequestAddFriend, "Friend request sent successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }


        [HttpPut("accept/{id}")]
        public async Task<IActionResult> AcceptFriendRequest(Guid id)
        {
            try
            {
                var friendRequest = await _friendService.GetFriendRequestByIdAsync(id);
                if (friendRequest == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.UserNotFound, "Friend request not found"));
                }

                if (friendRequest.Status != FriendStatus.Pending)
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.InvalidRequest, "Friend request is not in pending status"));
                }
                var token = HttpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", "");
                var userId = Helper.GetUserFromToken(token);
                var result = await _friendService.AcceptFriendRequestAsync(userId.Value, id);
                if (!result)
                {
                    return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, "Failed to accept friend request"));
                }

                return Ok(new ApiResponse<string>(200, ResponseKeys.RequestAddFriend, "Friend request accepted successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpPut("reject/{id}")]
        public async Task<IActionResult> RejectFriendRequest(Guid id)
        {
            try
            {
                var friendRequest = await _friendService.GetFriendRequestByIdAsync(id);
                if (friendRequest == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Friend request not found"));
                }

                if (friendRequest.Status != FriendStatus.Pending)
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.InvalidRequest, "Friend request is not in pending status"));
                }
                var token = HttpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", "");
                var userId = Helper.GetUserFromToken(token);

                var result = await _friendService.RejectFriendRequestAsync(userId.Value, id);
                if (!result)
                {
                    return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, "Failed to reject friend request"));
                }

                return Ok(new ApiResponse<string>(200, ResponseKeys.RequestRejectFriend, "Friend request rejected successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpPost("requests")]
        public async Task<IActionResult> GetFriendRequests(ListRequestModel request)
        {
            try
            {
                if (request == null)
                    return BadRequest(new ApiResponse<object>(400, ResponseKeys.InvalidRequest, "Invalid request data"));

                var token = HttpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", "");
                var userId = Helper.GetUserFromToken(token);
                if (!userId.HasValue)
                {
                    return Unauthorized(new ApiResponse<string>(401, ResponseKeys.Unauthorized, "Unauthorized access"));
                }

                var friendRequests = await _friendService.GetFriendRequestsAsync(userId.Value);
              

                // Transform the data
                var requestsQuery = friendRequests.Select(r => new
                {
                    id = r.Id,
                    sender = new
                    {
                        userId = r.UserId,
                        fullName = r.User.FullName,
                        avatar = r.User.Avatar
                    },
                    status = r.Status.ToString(),
                    createdAt = r.CreatedDate
                }).AsQueryable();

                // Apply search
                if (!string.IsNullOrWhiteSpace(request.KeySearch))
                {
                    requestsQuery = requestsQuery.ApplySearch(request.KeySearch, 
                        r => r.sender.fullName);
                }

                // Apply sorting
                if (!string.IsNullOrEmpty(request.SortBy))
                {
                    requestsQuery = requestsQuery.ApplySorting(request.SortBy, request.Ascending ?? true);
                }
                else
                {
                    // Default sorting by creation date
                    requestsQuery = requestsQuery.OrderByDescending(r => r.createdAt);
                }

                var totalCount = requestsQuery.Count();

                // Apply paging
                requestsQuery = requestsQuery.ApplyPaging(request.CurrentPage, request.PageSize);

                var response = new
                {
                    totalCount,
                    currentPage = request.CurrentPage,
                    data = requestsQuery.ToList()
                };

                return Ok(new ApiResponse<object>(200, "", response));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpPost("suggestions")]
        public async Task<IActionResult> GetFriendSuggestions(ListRequestModel request)
        {
            try
            {
                if (request == null)
                    return BadRequest(new ApiResponse<object>(400, ResponseKeys.InvalidRequest, "Invalid request data"));

                var token = HttpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", "");
                var userId = Helper.GetUserFromToken(token);
                if (!userId.HasValue)
                {
                    return Unauthorized(new ApiResponse<string>(401, ResponseKeys.Unauthorized, "Unauthorized access"));
                }

                var suggestions = await _friendService.GetFriendSuggestionsAsync(userId.Value, request?.KeySearch);


                // Transform the data
                var suggestionsQuery = suggestions.Select(u => new
                {
                    userId = u.UserId,
                    fullName = u.FullName,
                    avatar = u.Avatar,
                    email = u.Email,
                    description = u.Description,
                    address = u.Address
                }).AsQueryable();

                var totalCount = suggestionsQuery.Count();

                // Apply paging
                suggestionsQuery = suggestionsQuery.ApplyPaging(request.CurrentPage, request.PageSize);

                var response = new
                {
                    totalCount,
                    currentPage = request.CurrentPage,
                    data = suggestionsQuery.ToList()
                };

                return Ok(new ApiResponse<object>(200, "", response));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpDelete("cancel-request/{id}")]
        public async Task<IActionResult> CancelFriendRequest(Guid id)
        {
            try
            {
                var friendRequest = await _friendService.GetFriendRequestByIdAsync(id);
                if (friendRequest == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Friend request not found"));
                }

                var token = HttpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", "");
                var userId = Helper.GetUserFromToken(token);
                if (!userId.HasValue || friendRequest.UserId != userId.Value)
                {
                    return Unauthorized(new ApiResponse<string>(401, ResponseKeys.Unauthorized, "Unauthorized to cancel this request"));
                }

                var result = await _friendService.CancelFriendRequestAsync(id);
                if (!result)
                {
                    return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, "Failed to cancel friend request"));
                }

                return Ok(new ApiResponse<string>(200, ResponseKeys.CancelFrinedSuccess, "Friend request cancelled successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpDelete("unfriend/{friendId}")]
        public async Task<IActionResult> Unfriend(Guid friendId)
        {
            try
            {
                var token = HttpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", "");
                var userId = Helper.GetUserFromToken(token);
                if (!userId.HasValue)
                {
                    return Unauthorized(new ApiResponse<string>(401, ResponseKeys.Unauthorized, "Unauthorized access"));
                }

                var result = await _friendService.UnfriendAsync(userId.Value, friendId);
                if (!result)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Friendship not found"));
                }

                return Ok(new ApiResponse<string>(200, ResponseKeys.UnfriendSuccess, "Unfriended successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpPost("friends")]
        public async Task<IActionResult> GetListFriends(ListRequestModel request)
        {
            var token = HttpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", "");
            var userId = Helper.GetUserFromToken(token);
            if (!userId.HasValue)
            {
                return Unauthorized(new ApiResponse<string>(401, ResponseKeys.Unauthorized, "Unauthorized access"));
            }

            var friendRequests = await _friendService.GetListFriend(userId.Value);
            var requestsQuery = friendRequests.Select(r => new
            {
                id = r.Id,
                friend = new
                {
                    userId = r.UserId != userId ? r.UserId : r.FriendId,
                    fullName = r.UserId == userId ? r.FriendUser.FullName: r.User.FullName,
                    avatar = r.UserId == userId ? r.FriendUser.Avatar: r.User.Avatar,
                    address = r.UserId == userId ? r.FriendUser.Address : r.User.Address,
                    description = r.UserId == userId ? r.FriendUser.Description : r.User.Description,
                    email = r.UserId == userId ? r.FriendUser.Email : r.User.Email,
                },
                status = r.Status.ToString(),
                createdAt = r.CreatedDate
            }).AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.KeySearch))
            {
                requestsQuery = requestsQuery.ApplySearch(request.KeySearch,
                    r => r.friend.fullName);
            }

            var totalCount = requestsQuery.Count();

            // Apply paging
            requestsQuery = requestsQuery.ApplyPaging(request.CurrentPage, request.PageSize);
            var response = new
            {
                totalCount,
                currentPage = request.CurrentPage,
                data = requestsQuery.ToList()
            };

            return Ok(new ApiResponse<object>(200, "", response));
        }

        [HttpPost("pending-requests")]
        public async Task<IActionResult> GetListPending(ListRequestModel request)
        {
            var token = HttpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", "");
            var userId = Helper.GetUserFromToken(token);
            if (!userId.HasValue)
            {
                return Unauthorized(new ApiResponse<string>(401, ResponseKeys.Unauthorized, "Unauthorized access"));
            }

            var friendRequests = await _friendService.GetListPending(userId.Value);
            var requestsQuery = friendRequests.Select(r => new
            {
                id = r.Id,
                friend = new
                {
                    userId = r.FriendUser.UserId,
                    fullName = r.FriendUser.FullName,
                    avatar = r.FriendUser.Avatar,
                    address = r.FriendUser.Address,
                    description = r.FriendUser.Description,
                },
                status = r.Status.ToString(),
                createdAt = r.CreatedDate
            }).AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.KeySearch))
            {
                requestsQuery = requestsQuery.ApplySearch(request.KeySearch,
                    r => r.friend.fullName);
            }

            var totalCount = requestsQuery.Count();

            // Apply paging
            requestsQuery = requestsQuery.ApplyPaging(request.CurrentPage, request.PageSize);
            var response = new
            {
                totalCount,
                currentPage = request.CurrentPage,
                data = requestsQuery.ToList()
            };

            return Ok(new ApiResponse<object>(200, "", response));
        }


    }
} 