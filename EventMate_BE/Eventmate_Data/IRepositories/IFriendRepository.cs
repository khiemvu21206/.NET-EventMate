using Eventmate_Data.Entities;
using EventMate_Data.Entities;

namespace EventMate_Data.IRepositories
{
    public interface IFriendRepository
    {
        Task<Friend> GetFriendRequestByIdAsync(Guid id);
        Task<bool> UpdateFriendAsync(Friend friend);
        Task RequestAddFriend(Friend friend);

        Task<List<Friend>> GetUserFriendsAsync(Guid userId);
        Task<List<User>> GetFriendSuggestionsAsync(Guid userId, string? keySearch);
        Task<List<Friend>> GetFriendRequestsAsync(Guid userId);

        Task<Friend> GetFriendshipAsync(Guid userId, Guid friendId);
        Task<bool> DeleteFriendAsync(Friend friend);
        Task<List<Friend>> GetListPending(Guid userId);
        Task<List<Friend>> GetListFriend(Guid userId);
    }
} 