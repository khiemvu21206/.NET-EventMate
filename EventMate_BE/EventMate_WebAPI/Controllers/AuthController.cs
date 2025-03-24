using AutoMapper;
using EventMate_Common.Common;
using EventMate_Common.Status;
using EventMate_Data.Entities;
using EventMate_Service.Services;
using EventMate_WebAPI.ModelsMapping.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Runtime.InteropServices;
using static System.Net.WebRequestMethods;

namespace EventMate_WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly IMapper _mapper;
        public AuthController(AuthService authService, IMapper mapper)
        {
            _authService = authService;
            _mapper = mapper;
        }

        [HttpPost("login")]
        public async Task<IActionResult> LogIn([FromBody] LoginModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest();
                }

                var userRequest = _mapper.Map<User>(model);

                var user = await _authService.LoginAsync(userRequest);

                if (user == null)
                {
                    return Unauthorized();
                }
                else if (user.Status.Equals(UserStatus.Inactive))
                {
                    return Forbid();
                }

              var token =  _authService.CreateToken(user);
                var userResponse = _mapper.Map<UserResponse>(user);
                return Ok(new ApiResponse<object>(200, ResponseKeys.LoginSuccess, new {user = userResponse,token = token?.Result }));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
        [HttpPost("login-google")]
        public async Task<IActionResult> Login_Google([FromBody] LoginGoogleModel loginGoogle)
        {
            try
            {
                IActionResult response;
                // Check if the account exists using email and Google ID
                var user = await _authService.Login_GoogleAsync(loginGoogle.Email, loginGoogle.GoogleId);

                if (user == null)
                {
                    // Map the LoginGoogleModel to a User entity
                    var newUser = _mapper.Map<User>(loginGoogle);
                    newUser.Password = "1@113$2aMGs";
                    // Create a new account
                    user = await _authService.CreateNewAccount(newUser);
                }

                // Return the generated token
                var token = _authService.CreateToken(user);
                var userResponse = _mapper.Map<UserResponse>(user);
                return Ok(new ApiResponse<object>(200, ResponseKeys.LoginSuccess, new { user = userResponse, token = token?.Result }));

            }
            catch (Exception ex)
            {
                // Return a 500 Internal Server Error with a custom error message
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }
        [HttpPost("create-otp")]
        public async Task<IActionResult> CreateOTP(OTPRequest request)
        {
            try
            {
                if (await _authService.IsExistUser(request.Email))
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.EmailAlreadyExist, "Email already exists"));
                }

                var otp = await _authService.CreateOTP(request.Email, request.Password);

                return Ok(new ApiResponse<string>(200, ResponseKeys.OtpSentSuccessfully, otp.Token));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOTP([FromForm] VerifyOTPRequest verifyOTPRequest)
        {
            try
            {
                var userRequest = _mapper.Map<User>(verifyOTPRequest);
                var otp = await _authService.VerifyOTP(verifyOTPRequest.OTP, verifyOTPRequest.Token, userRequest, verifyOTPRequest.BusinessLicense);
                if (otp == null)
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.OtpInvalid, "OTP is not valid"));
                }

                if (otp.ExpireTime <= DateTime.Now)
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.OtpExpired, "OTP has expired."));
                }

                return Ok(new ApiResponse<string>(400, ResponseKeys.AccountCreated, "Authentication successful! Account has been created"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }


        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] string email)
        {
            try
            {

                var isUser = await _authService.IsExistUser(email);

                if (!isUser)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.EmailNotFound, "Email Not Found"));
                }
                else
                {

                   await _authService.SendResetPasswordEmail(email);
                    return Ok(new ApiResponse<string>(200, ResponseKeys.EmailSent, "Email sent"));
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
            try
            {

                // Check for null values in model properties
                if (string.IsNullOrEmpty(model.Password) || string.IsNullOrEmpty(model.Token))
                return BadRequest(new ApiResponse<string>(404, ResponseKeys.EmailNotFound, "Password and token cannot be empty"));  

                // Attempt to reset password
                var user = await _authService.GetUserByToken(model.Token);
                if (user == null) return NotFound(new ApiResponse<string>(404, ResponseKeys.EmailNotFound, "Email Not Found"));
                if (user.TokenReset == null) return BadRequest(new ApiResponse<string>(400, ResponseKeys.TokenNotFound, "Token Not Found"));
                user.Password = model.Password;
                await _authService.ChangePasswordAsync(user);
                return Ok(new ApiResponse<string>(200, ResponseKeys.ResetPassSuccess, "Password reset successfully"));
              
            }
            catch (SecurityTokenException ex)
            {
                return BadRequest(new ApiResponse<string>(400, ex.Message));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<string>(404, ex.Message));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponse<string>(400, ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            try
            {
                if (string.IsNullOrEmpty(model.NewPassword) || string.IsNullOrEmpty(model.OldPassword) || string.IsNullOrEmpty(model.Token))
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.PasswordNotNull, "Password and token cannot be empty"));

                var user = await _authService.GetUserByToken(model.Token);
                if (user == null) return NotFound(new ApiResponse<string>(404, ResponseKeys.EmailNotFound, "Email Not Found"));
                var checkpass = _authService.VerifyPassword( model.OldPassword, user.Password);
                if (checkpass == false) return BadRequest(new ApiResponse<string>(400, ResponseKeys.OldPassIncorrect, "Old password is incorrect"));
                //Check old and new pass are null
                user.Password = model.NewPassword;
                await _authService.ChangePasswordAsync(user);

                return Ok(new ApiResponse<string>(200, ResponseKeys.ResetPassSuccess, "Password reset successfully"));
            }
            catch (Exception ex)
            {
                // Handle potential errors
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }

        }
    
    }

}