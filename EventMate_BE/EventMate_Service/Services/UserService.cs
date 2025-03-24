
using Eventmate_Common.Helpers;
using EventMate_Common.Common;
using EventMate_Common.Constants;
using EventMate_Common.Enum;
using EventMate_Common.Status;
using Eventmate_Data.Entities;
using Eventmate_Data.IEventRepository;
using Eventmate_Data.IRepositories;
using EventMate_Data.Entities;
using EventMate_Data.IRepositories;
using EventMate_Data.Repositories;
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
    public class UserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;

        }
        public async Task<User?> GetUserByIdAsync(Guid userId)
        {
            return await _userRepository.GetUserByIdAsync(userId);
        }

        public async Task<bool> UpdateUserAsync(User user)
        {
            return await _userRepository.UpdateUserAsync(user);
        }


    }


}
