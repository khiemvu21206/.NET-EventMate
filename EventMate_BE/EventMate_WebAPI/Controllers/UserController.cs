
using AutoMapper;
using EventMate_Common.Common;
using EventMate_Common.Constants;
using EventMate_Common.Status;
using EventMate_Data.Entities;
using EventMate_Service.Services;
using EventMate_WebAPI.ModelsMapping;
using EventMate_WebAPI.ModelsMapping.Authentication;
using EventMate_WebAPI.ModelsMapping.Event;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EventMate_WebAPI.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly AwsService _awsService;
        public UserController(UserService userService, AwsService awsService)
        {
            _userService = userService;
            _awsService = awsService;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserProfile(Guid userId)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "User not found"));
                }

                var userProfile = new
                {
                    user.UserId,
                    user.FullName,
                    user.Email,
                    user.Avatar,
                    user.DateOfBirth,
                    user.Address,
                    user.Phone,
                    user.Description,
                    user.CompanyName,
                    user.Status,
                    user.CreatedAt,
                    Role = user.Role?.RoleName,
                    WalletBalance = user.Wallet?.Balance
                };

                return Ok(new ApiResponse<object>(200, ResponseKeys.FetchUserSuccess, userProfile));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }


        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUserProfile(Guid userId, EditUser model)
        {
            try
            {
                if (model == null)
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.InvalidRequest, "Invalid user data"));
                }

                var user = await _userService.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "User not found"));
                }

                if (model.Avatar != null)
                {
                    string fileName = $"{user.UserId}";
                    // Ánh xạ dữ liệu từ model sang entity

                    // Xóa file cũ (nếu có)
                    if (!string.IsNullOrEmpty(user.Avatar))
                    {
                        string oldFileName = fileName.Split('/').Last();
                        await _awsService.deleteFile("amzn-eventmate-avatar", oldFileName);
                    }

                    // Đọc dữ liệu từ file tải lên
                    using (var stream = model.Avatar.OpenReadStream())
                    {
                        await _awsService.addFile(stream, "amzn-eventmate-avatar", fileName);
                    }


                    string s = string.Format(Constants.urlImg, "amzn-eventmate-avatar", fileName);
                    user.Avatar = s;
                }
                    // Cập nhật thông tin người dùng
                    user.FullName = model.FullName;
              
                user.DateOfBirth = model.DateOfBirth;
                user.Address = model.Address;
                user.Phone = model.Phone;
                user.CompanyName = model.CompanyName;
                user.Description = model.Description;

                var result = await _userService.UpdateUserAsync(user);
                if (!result)
                {
                    return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, "Failed to update user"));
                }

                return Ok(new ApiResponse<string>(200, ResponseKeys.UserUpdated, "User updated successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
       

    }



}
