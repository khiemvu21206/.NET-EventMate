using EventMate.Data;
using Eventmate_Data.Entities;
using Eventmate_Common.Helpers;
using EventMate_Data.Entities;
using EventMate_Data.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventMate_Data.Repositories
{
    public class AuthRepository : IAuthRepository
    {

        private readonly DataContext _context;
        private readonly AESHelper _AESHelper;
        public AuthRepository(DataContext context, AESHelper AESHelper)
        {
            _context = context;
            _AESHelper = AESHelper;
        }
        public async Task<User?> IsValidUser(string email, string password)
        {
            try
            {

                var user = await _context.Users!.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == email);
                if (user == null)
                {
                    return null;
                }

                if (BCrypt.Net.BCrypt.Verify(password, user.Password))
                {
                    return user;
                }

                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<string> GetRoleUser(string email)
        {
            try
            {
                if (_context.Users == null)
                {
                    return string.Empty;
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
                if (user == null)
                {
                    return string.Empty;
                }

                var role = await _context.Role!.FirstOrDefaultAsync(r => r.RoleId == user.RoleId);
                return role != null ? role.RoleName : string.Empty;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<User?> Login_Google(string email, string googleId)
        {
            try
            {
                var user = await _context.Users!.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == email);

                if (user != null)
                {
                    if (user.GoogleId == null)
                    {
                        user.GoogleId = googleId;
                       await _context.SaveChangesAsync();
                        return user;
                    }
                    if (user.GoogleId != googleId)
                    {
                        return null;
                    }

                    return user;


                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task SignUp(User user)
        {
            try
            {
                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<User?> GetUserByEmail(string email)
        {
            try
            {
                return await _context.Users!.FirstOrDefaultAsync(u => u.Email == email);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<OTPAuthen> CreateOTP(string email, string password)
        {
            try
            {
                var otp = new OTPAuthen
                {
                    OTPCode = Commons.GenerateOTP(),
                    ExpireTime = DateTime.Now.AddMinutes(5),
                    Token = _AESHelper.Encrypt(email + "::" + password),
                    CreateAt = DateTime.Now,
                };
                await _context.OTPAuthens.AddAsync(otp);
                await _context.SaveChangesAsync();

                return otp;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }


        }

        public async Task<OTPAuthen> CheckOTP(string OTPCode, string token)
        {
            try
            {
                var otp = _context.OTPAuthens.FirstOrDefault(x => x.OTPCode == OTPCode && x.Token == token);

                return otp;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);

            }
        }
        public async Task SetToken(string email, string token)
        {
            try
            {
                var user = await _context.Users!.FirstOrDefaultAsync(u => u.Email == email);
                if (user != null)
                {
                    user.TokenReset = token;
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);

            }
        }
        public async Task ResetPassword(User user)
        {
            try
            {
                var userToUpdate = await _context.Users!.SingleOrDefaultAsync(u => u.Email == user.Email) ??
                               throw new Exception("User not found");
                userToUpdate.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                userToUpdate.TokenReset = null;
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);

            }
        }
        public async Task<string> GetToken(string email)
        {
            var user = await _context.Users!.FirstOrDefaultAsync(u => u.Email == email) ??
                       throw new Exception("User not found");
            return user.TokenReset!;
        }
        public async Task RemoveOTP(string otpCode)
        {
            var otp = await _context.OTPAuthens.FirstOrDefaultAsync(o => o.OTPCode == otpCode);
            if (otp == null) return;
            _context.Remove(otp);
            await _context.SaveChangesAsync();


        }
        public async Task RemoveOTPExpired()
        {
            var otps = await _context.OTPAuthens.Where(o => o.ExpireTime > DateTime.UtcNow).ToListAsync();
            if (otps.Count > 0)
            {
                _context.RemoveRange(otps);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<Guid> GetRoleId(string roleName)
        {
            var role = await _context.Role.FirstOrDefaultAsync(x => x.RoleName == roleName);
            return role.RoleId;
        }

    }
}
