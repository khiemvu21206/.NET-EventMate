using EventMate_Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Eventmate_Data.IRepositories
{
    public interface IUserRepository
    {
        public Task<Guid?> GetRoleIdbyName(string roleName);
        Task<User?> GetUserByIdAsync(Guid userId);
        Task<bool> UpdateUserAsync(User user);
    }
}
