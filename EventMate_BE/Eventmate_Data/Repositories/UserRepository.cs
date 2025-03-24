using EventMate.Data;
using Eventmate_Data.Entities;
using Eventmate_Data.IRepositories;
using EventMate_Data.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Eventmate_Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Guid?> GetRoleIdbyName(string roleName)
        {
            var role = await _context.Role
         .FirstOrDefaultAsync(r => r.RoleName.Equals(roleName));

            return role?.RoleId;
        }
        public async Task<User?> GetUserByIdAsync(Guid userId)
        {
            try
            {
                return await _context.Users
                    .Include(u => u.Role)
                    .Include(u => u.Wallet)
                    .FirstOrDefaultAsync(u => u.UserId == userId);
            }
            catch (Exception ex)
            {
                throw new Exception("Database error: " + ex.Message);
            }
        }

        public async Task<bool> UpdateUserAsync(User user)
        {
            try
            {
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Database error: " + ex.Message);
            }
        }
    
    }
}

