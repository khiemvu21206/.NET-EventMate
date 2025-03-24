using EventMate_Common.Enum;
using Eventmate_Data.Entities;
using Eventmate_Data.IRepositories;
using EventMate_Data.Entities;
using EventMate_Data.IRepositories;
using EventMate_Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace EventMate_Service.Services
{
    public class FriendService
    {
        private readonly IFriendRepository _friendRepository;
        private readonly IConversationRepository _conversation;

        public FriendService(IFriendRepository friendRepository, IConversationRepository conversation)
        {
            _friendRepository = friendRepository;
            _conversation = conversation;
        }

        public async Task RequestAddFrined(Guid userId, Guid friendId)
        {
            Friend friend = new Friend
            {
                UserId = userId,
                FriendId = friendId,
                CreatedDate = DateTime.UtcNow,
                Status = FriendStatus.Pending
            };
            await _friendRepository.RequestAddFriend(friend);

        }
        public async Task<Friend> GetFriendRequestByIdAsync(Guid id)
        {
            return await _friendRepository.GetFriendRequestByIdAsync(id);
        }

        public async Task<bool> AcceptFriendRequestAsync(Guid userId, Guid id)
        {
            var friendRequest = await _friendRepository.GetFriendRequestByIdAsync(id);

            if (friendRequest == null || friendRequest.FriendId != userId)
            {
                return false;
            }

            friendRequest.Status = FriendStatus.Accepted;
            var conversation = new Conversations
            {
                Id = Guid.NewGuid(),
                Type = EventMate_Common.Type.ConversationType.Exchange,
            };
           
             await _friendRepository.UpdateFriendAsync(friendRequest);
             await _conversation.AddConversation(conversation, [friendRequest.FriendId, friendRequest.UserId]);
            return true;
        }

        public async Task<bool> RejectFriendRequestAsync(Guid userId, Guid id)
        {
            var friendRequest = await _friendRepository.GetFriendRequestByIdAsync(id);
            if (friendRequest == null || friendRequest.FriendId != userId || friendRequest.UserId != userId)
            {
                return false;
            }

            friendRequest.Status = FriendStatus.Rejected;
            return await _friendRepository.UpdateFriendAsync(friendRequest);
        }

        public async Task<bool> CancelFriendRequestAsync(Guid requestId)
        {
            try
            {
                var friendRequest = await _friendRepository.GetFriendRequestByIdAsync(requestId);
                if (friendRequest == null || friendRequest.Status != FriendStatus.Pending)
                {
                    return false;
                }

                return await _friendRepository.DeleteFriendAsync(friendRequest);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error cancelling friend request: {ex.Message}");
            }
        }

        public async Task<bool> UnfriendAsync(Guid userId, Guid friendId)
        {
            try
            {
                var friendship = await _friendRepository.GetFriendshipAsync(userId, friendId);
                if (friendship == null || friendship.Status != FriendStatus.Accepted)
                {
                    return false;
                }

                return await _friendRepository.DeleteFriendAsync(friendship);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error unfriending: {ex.Message}");
            }
        }

        public async Task<List<Friend>> GetUserFriendsAsync(Guid userId)
        {
            return await _friendRepository.GetUserFriendsAsync(userId);
        }


        public async Task<List<Friend>> GetFriendRequestsAsync(Guid userId)
        {
            return await _friendRepository.GetFriendRequestsAsync(userId);
        }

        public async Task<List<User>> GetFriendSuggestionsAsync(Guid userId, string? keySearch)
        {
            try
            {
                return await _friendRepository.GetFriendSuggestionsAsync(userId, keySearch);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting mutual friends: {ex.Message}");
            }
        }
        public async Task<List<Friend>> GetListFriend(Guid userId)
        {
            return await _friendRepository.GetListFriend(userId);
        }
        public async Task<List<Friend>> GetListPending(Guid userId)
        {
            return await _friendRepository.GetListPending(userId);
        }
    }
} 