
using Eventmate_Common.Helpers;
using EventMate_Common.Common;
using EventMate_Common.Constants;
using EventMate_Common.Enum;
using EventMate_Common.Status;
using Eventmate_Data.Entities;
using Eventmate_Data.IRepositories;
using EventMate_Data.Entities;
using EventMate_Data.IRepositories;
using EventMate_Data.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace EventMate_Service.Services
{
    public class AuthService
    {
        private readonly IAuthRepository authRepository;
        private readonly IUserRepository userRepository;
        private readonly IConfiguration _configuration;
        private readonly EmailService _emailService;
        private readonly AwsService _awsService;
        private readonly AESHelper _AESHelper;

        public AuthService(IAuthRepository authRepository, IConfiguration configuration, IUserRepository userRepository,
            EmailService emailService, AESHelper AESHelper,
             AwsService awsService)
        {
            this.authRepository = authRepository;
            this.userRepository = userRepository;
            _configuration = configuration;
            _emailService = emailService;
            _AESHelper = AESHelper;
            _awsService = awsService;
        }

        public async Task<User> LoginAsync(User userMapper)
        {

            //Check email and pass
            var user = await authRepository.IsValidUser(userMapper.Email, userMapper.Password);

            return user;

        }
        public async Task<User> Login_GoogleAsync(string email, string googleID)
        {

            //Check email and googleID
            var user = await authRepository.Login_Google(email, googleID);

            return user;

        }
        public async Task<string?> CreateToken(User? user)
        {
            if (user == null) return string.Empty;
            if (user.Status == UserStatus.Inactive) return "Inactive";

            //add email to claim
            var authClaims = new List<Claim>
            {
                new(ClaimTypes.Email, user.Email),
                new("userId", user.UserId.ToString()),
                new("username",user.FullName),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            //Get role of user
            var userRole = await authRepository.GetRoleUser(user.Email);
            authClaims.Add(new Claim(ClaimTypes.Role, userRole));



            var authenKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]!));

            var jwtService = new JwtService(_configuration["JWT:Secret"]!, _configuration["JWT:ValidIssuer"]!);
            ////Create token
            var token = jwtService.GenerateTokenLogin(authClaims);

            return token;
        }
        public async Task<User> CreateNewAccount(User user)
        {
            try
            {
                if (await IsExistUser(user.Email))
                {
                    throw new InvalidOperationException("User already exists." + user.Email);
                }

                // Set new user information
                user.CreatedAt = DateTime.Now;
                user.Status = UserStatus.Active;
                user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                // Get RoleId for role "User"
                var roleId = await userRepository.GetRoleIdbyName("User");
                if (roleId.HasValue && user.RoleId ==null)
                {
                    user.RoleId = roleId.Value;
                }

                // SignUp new User
                await authRepository.SignUp(user);

                return user;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }


        }
        public async Task SendOTPtoEmail(string OTPCode, string email)
        {

            var subject = Constants.SubjectOTPEmail;
            var body = string.Format(Constants.OTPEmailBody, OTPCode);

            await _emailService.SendEmail(email, subject, body);
        }
        public async Task<bool> IsExistUser(string email)
        {
            var existingUser = await authRepository.GetUserByEmail(email);
            return existingUser != null;

        }
        public async Task<OTPAuthen> CreateOTP(string email, string password)
        {
            try
            {
                var otp = await authRepository.CreateOTP(email, password);

                await SendOTPtoEmail(otp.OTPCode, email);
                return otp;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<OTPAuthen> VerifyOTP(string OTPCode, string token, User userRequest, IFormFile License)
        {
            try
            {
                var otp = await authRepository.CheckOTP(OTPCode, token);
                if (otp != null)
                {
                    var emailPassword = _AESHelper.Decrypt(token);
                    var email = emailPassword.Split("::")[0];
                    var password = emailPassword.Split("::")[1];
                    var userId = Guid.NewGuid();

                    var user = new User
                    {
                        UserId = userId,
                        Email = email,
                        Password = password,
                        CompanyName = userRequest.CompanyName,
                        Address = userRequest.Address,
                        Phone = userRequest.Phone,
                        Status = License ==null ? UserStatus.Active : UserStatus.Pendding,
                    };
                    if (License != null)
                    {
                        user.License = await UploadIng(License, userId.ToString());
                        user.RoleId = await authRepository.GetRoleId("Organization");
                      
                    }

                    //await authRepository.RemoveOTP(OTPCode);       
                    await CreateNewAccount(user);
                    await authRepository.RemoveOTP(OTPCode);
                }

                return otp;
            }

            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task SendResetPasswordEmail(string userEmail)
        {
            try
            {
                var resetToken = GenerateToken(userEmail);
                var baseurl = _configuration["AppSettings:BaseUrl"];
                var resetUrl = $"{baseurl}/resetPass?token={resetToken}";
                var subject = Constants.SubjectResetPassEmail;
                var body = string.Format(Constants.BodyResetPassEmail, userEmail, resetUrl);

                await _emailService.SendEmail(userEmail, subject, body);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }
        public async Task<User> GetUserByToken(string token)
        {
            var jwtService = new JwtService(_configuration["JWT:Secret"]!, _configuration["JWT:ValidIssuer"]!);

            if (JwtService.IsTokenExpired(token))
            {
                throw new Exception("Token expired");
            }
            var principal = jwtService.GetPrincipal(token) ?? throw new Exception("Invalid token");
            var emailClaim = principal.FindFirst(ClaimTypes.Email) ?? throw new Exception("Email claim not found in token");

            var email = emailClaim.Value;


            //get user by email
            var user = await authRepository.GetUserByEmail(email);
            return user;

        }
        public bool VerifyPassword(string oldPassword, string tempPassword)
        {
            return BCrypt.Net.BCrypt.Verify(oldPassword, tempPassword);
        }
        public async Task ChangePasswordAsync(User user, string newPassword, string oldPassword)
        {

            try
            {
                await authRepository.ResetPassword(user);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
        public string GenerateToken(string email)
        {
            var jwtService = new JwtService(_configuration["JWT:Secret"]!, _configuration["JWT:ValidIssuer"]!);
            var token = jwtService.GenerateToken(email);
            authRepository.SetToken(email, token);
            return token;
        }

        private async Task<string> ValidateToken(string token)
        {
            var jwtService = new JwtService(_configuration["JWT:Secret"]!, _configuration["JWT:ValidIssuer"]!);

            if (JwtService.IsTokenExpired(token))
            {
                throw new SecurityTokenException(ResponseKeys.TokenExpired);
            }

            var principal = jwtService.GetPrincipal(token);
            if (principal == null)
            {
                throw new SecurityTokenException(ResponseKeys.InvalidToken);
            }

            var emailClaim = principal.FindFirst(ClaimTypes.Email);
            if (emailClaim == null)
            {
                throw new InvalidOperationException(ResponseKeys.EmailClaimNotFound);
            }

            var email = emailClaim.Value;

            var tokenFromDb = await authRepository.GetToken(email);
            if (tokenFromDb == null)
            {
                throw new KeyNotFoundException(ResponseKeys.TokenNotFound);
            }

            if (tokenFromDb != token)
            {
                throw new UnauthorizedAccessException(ResponseKeys.InvalidToken);
            }

            return email;
        }
        public string GetEmailInToken(string token)
        {
            var jwtService = new JwtService(_configuration["JWT:Secret"]!, _configuration["JWT:ValidIssuer"]!);
            if (JwtService.IsTokenExpired(token))
            {
                throw new Exception("Token expired");
            }

            var principal = jwtService.GetPrincipal(token) ?? throw new Exception("Invalid token");
            var emailClaim = principal.FindFirst(ClaimTypes.Email) ?? throw new Exception("Email claim not found in token");

            var email = emailClaim.Value;
            return email;
        }

        public async Task ChangePasswordAsync(User user)
        {

            try
            {
                //Reset pass
                await authRepository.ResetPassword(user);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
        public async Task RemoveOTPExpired()
        {
            try
            {
                await authRepository.RemoveOTPExpired();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

        }
        public async Task<string> UploadIng(IFormFile file, string filename)
        {
            await _awsService.addFile(file, "amzn-eventmate-organization");
            return string.Format(Constants.urlImg, "amzn-eventmate-organization", filename);
        }
    }


}

