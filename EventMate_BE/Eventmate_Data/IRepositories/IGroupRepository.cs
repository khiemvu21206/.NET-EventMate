using EventMate_Common.Status;
using EventMate_Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Eventmate_Data.IRepositories
{
    public interface IGroupRepository
    {
        Task<IEnumerable<Groups>> GetAllGroupsAsync();
        Task<User> GetUserByEmailAsync(string email);
        Task<IEnumerable<Groups>> GetAllGroupsByUserIdAsync(Guid id);

        //Task<IEnumerable<Groups>> GetGroupsByStatusAsync(GroupStatus status);
        Task<IEnumerable<Requests>> GetAllRequestAsync(Guid id);

        Task<Groups?> GetGroupByIdAsync(Guid groupId);
        Task AddGroupAsync(Groups groupEntity);
        Task DeleteGroupAsync(Guid groupId);
        Task<bool> ChangeGroupStatusAsync(Guid groupId, GroupStatus newStatus);
        Task<bool> AddUserToGroupAsync(User_Group userGroup);
        Task<bool> AddConversationToGroupAsync(Conversations conversation);
        Task<bool> IsUserInGroupAsync(Guid userId, Guid groupId);
        Task<bool> IsUserByIdAsync(Guid userId);
        Task AddRequestAsync(Requests requestEntity);
        Task<List<User_Group>> ListUsersInGroupAsync(Guid groupId);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User_Group> GetUserGroupByIdAsync(Guid id);
        Task DeleteUserGroupAsync(Guid id);
        Task<Requests> GetRequestByIdAsync(Guid id);
        Task DeleteRequestAsync(Guid id);
        Task<User_Group> GetUserGroupAsync(Guid userId, Guid groupId);
        Task<Requests> GetRequestAsync(Guid userId, Guid groupId);
        Task<bool> CreateTemplateTimeLineAsync(int eventType, Guid groupId, Guid userId);
        Task<bool> AddUserToConversationAsync(Guid userId, Guid conversationId);
        Task<Conversations?> GetConversationByGroupIdAsync(Guid groupId);
        Task<bool> ChangeGroupLeaderAsync(Guid userId, Guid groupId);
        Task<bool> RemoveUserFromGroupAsync(Guid userId, Guid groupId);
        Task<bool> ChangeGroupCurrencyAsync(Guid groupId, string currency);
        Task<bool> RemovePlansFromGroupAsync(Guid groupId);
    }
}
