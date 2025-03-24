using EventMate_Data.Entities;
using Eventmate_Data.IEventRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Eventmate_Data.IRepositories;
using EventMate_Data.Repositories;
using EventMate_Common.Status;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer.Query.Internal;

namespace EventMate_Service.Services
{
    public class GroupService
    {
        private readonly IGroupRepository _groupRepository;

        public GroupService(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;

        }
        public async Task<IEnumerable<Groups>> GetAllGroupsAsync()
        {
            
            return await _groupRepository.GetAllGroupsAsync();     
        }
        public async Task<IEnumerable<Groups>> GetAllGroupsByUserIdAsync(Guid userId)
        {

            return await _groupRepository.GetAllGroupsByUserIdAsync(userId);
        }
        public async Task<IEnumerable<Requests>> GetAllRequestAsync(Guid id)
        {

            return await _groupRepository.GetAllRequestAsync(id);
        }


        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {

            return await _groupRepository.GetAllUsersAsync();
        }
        
        public async Task AddGroupAsync(Groups groupEntity)
        {            
            await _groupRepository.AddGroupAsync(groupEntity);
        }
        public async Task<Guid> GetUserId()
        {
            
            return Guid.NewGuid();
        }
        public async Task AddRequestAsync(Requests requestEntity)
        {
            await _groupRepository.AddRequestAsync(requestEntity);
        }
        public async Task DeleteGroupAsync(Guid id)
        {
            await _groupRepository.DeleteGroupAsync(id);
        }
        public async Task<Groups> GetGroupsByIdAsync(Guid groupId)
        {
            return await _groupRepository.GetGroupByIdAsync(groupId);
        }

        public async Task<bool> ChangeGroupStatusAsync(Guid groupId, GroupStatus newStatus)
        {
            return await _groupRepository.ChangeGroupStatusAsync(groupId, newStatus);
        }
        public async Task<bool> AddUserToGroupAsync(Guid userId, Guid groupId)
        {
            // Check if the user is already in the group  
            var isUserInGroup = await _groupRepository.IsUserInGroupAsync(userId, groupId);

            if (isUserInGroup)
            {
                // If the user is already in the group, return false  
                return false;
            }

            var userGroup = new User_Group
            {
                UsergroupId = Guid.NewGuid(), // Generate a new ID  
                UserId = userId,
                GroupId = groupId
            };

            // Add the user to the group through the repository  
            return await _groupRepository.AddUserToGroupAsync(userGroup);
        }
        
        public async Task<bool> AddConversationToGroupAsync(Conversations conversation)
        {
            // Assuming the conversation is already set up with necessary properties  
            return await _groupRepository.AddConversationToGroupAsync(conversation);
        }
        public async  Task<bool> IsUserByIdAsync(Guid userId)
        {
            // Assuming the conversation is already set up with necessary properties  
            return await _groupRepository.IsUserByIdAsync(userId);
        }
        public async Task<bool> IsUserInGroupAsync(string email,Guid groupId)
        {
            User u = await _groupRepository.GetUserByEmailAsync(email);
            var isUserInGroup = await _groupRepository.IsUserInGroupAsync(u.UserId, groupId);
            // Assuming the conversation is already set up with necessary properties  
            return isUserInGroup;
        }
        public async Task<List<User_Group>> ListUsersInGroupAsync(Guid groupId)
        {
            var user_group= await _groupRepository.ListUsersInGroupAsync(groupId);
            return user_group;
        }
        public async Task<User_Group> GetUserGroupByIdAsync(Guid id)
        {
            return await _groupRepository.GetUserGroupByIdAsync(id);
        }
        public async Task<User_Group> GetUserGroupAsync(Guid userId,Guid groupId)
        {
            return await _groupRepository.GetUserGroupAsync(userId,groupId);
        }

        public async Task DeleteUserGroupAsync(Guid id)
        {
            await _groupRepository.DeleteUserGroupAsync(id);
        }
        public async Task<Requests> GetRequestByIdAsync(Guid id)
        {
            return await _groupRepository.GetRequestByIdAsync(id);
        }

        public async Task DeleteRequestAsync(Guid id)
        {
            await _groupRepository.DeleteRequestAsync(id);
        }

        public async Task<Requests> GetRequestAsync(Guid userId, Guid groupId)
        {
            return await _groupRepository.GetRequestAsync(userId, groupId);

        }

        public async Task<bool> CreateTemplateTimeLineAsync(int eventType, Guid groupId, Guid userId)
        {
            try
            {
                return await _groupRepository.CreateTemplateTimeLineAsync(eventType, groupId, userId);
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> AddUserToConversationAsync(Guid userId, Guid groupId)
        {
            var conversation = await _groupRepository.GetConversationByGroupIdAsync(groupId);
            if (conversation == null)
            {
                return false;
            }
            return await _groupRepository.AddUserToConversationAsync(userId, conversation.Id);
        }

        public async Task<bool> ChangeGroupLeaderAsync(Guid userId, Guid groupId)
        {
            return await _groupRepository.ChangeGroupLeaderAsync(userId, groupId);
        }

        public async Task<bool> RemoveUserFromGroupAsync(Guid userId, Guid groupId)
        {
            return await _groupRepository.RemoveUserFromGroupAsync(userId, groupId);
        }

        public async Task<bool> ChangeGroupCurrencyAsync(Guid groupId, string currency)
        {
            return await _groupRepository.ChangeGroupCurrencyAsync(groupId, currency);
        }

        public async Task<bool> RemovePlansFromGroupAsync(Guid groupId)
        {
            return await _groupRepository.RemovePlansFromGroupAsync(groupId);
        }
    }

}
