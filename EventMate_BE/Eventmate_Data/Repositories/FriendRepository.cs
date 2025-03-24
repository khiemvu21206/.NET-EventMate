using EventMate.Data;
using EventMate_Common.Enum;
using Eventmate_Data.Entities;
using EventMate_Data.Entities;
using EventMate_Data.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace EventMate_Data.Repositories
{
    public class FriendRepository : IFriendRepository
    {
        private readonly DataContext _context;

        public FriendRepository(DataContext context)
        {
            _context = context;
        }
        public async Task RequestAddFriend(Friend friend)
        {
            try
            {
                _context.Friends.Add(friend);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Database error: " + ex.Message);
            }

        }
        public async Task<Friend> GetFriendRequestByIdAsync(Guid id)
        {
            return await _context.Friends
                .Include(f => f.User)
                .Include(f => f.FriendUser)
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<bool> UpdateFriendAsync(Friend friend)
        {
            try
            {
                _context.Friends.Update(friend);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Database error: " + ex.Message);
            }
        }



        public async Task<List<Friend>> GetUserFriendsAsync(Guid userId)
        {
            try
            {
                return await _context.Friends
                    .Where(f => (f.UserId == userId || f.FriendId == userId) && 
                                f.Status == EventMate_Common.Enum.FriendStatus.Accepted)
                    .Include(f => f.User)
                    .Include(f => f.FriendUser)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Database error: " + ex.Message);
            }
        }

        public async Task<List<User>> GetFriendSuggestionsAsync(Guid userId, string? keySearch)
        {
            try
            {
                const int MAX_SUGGESTIONS = 50;

                var excludeIds = await _context.Friends
                    .Where(f => (f.UserId == userId || f.FriendId == userId) &&
                                (f.Status == FriendStatus.Accepted || f.Status == FriendStatus.Pending))
                    .Select(f => f.UserId == userId ? f.FriendId : f.UserId)
                    .ToListAsync();
                excludeIds.Add(userId);

                List<User> suggestedUsers = new List<User>();

                if (!string.IsNullOrWhiteSpace(keySearch))
                {
                    suggestedUsers = await _context.Users
                        .Where(u => !excludeIds.Contains(u.UserId) &&
                                    (u.FullName.Contains(keySearch) || u.Email.Contains(keySearch)))
                        .OrderByDescending(u => u.CreatedAt)
                        .Take(MAX_SUGGESTIONS)
                        .ToListAsync();
                }

                if (suggestedUsers.Count < MAX_SUGGESTIONS)
                {
                    var existingIds = suggestedUsers.Select(u => u.UserId).Concat(excludeIds).ToHashSet();

                    var friendsOfFriends = await (
                        from f1 in _context.Friends
                        join f2 in _context.Friends on f1.FriendId equals f2.UserId
                        where f1.UserId == userId
                              && f1.Status == FriendStatus.Accepted
                              && f2.Status == FriendStatus.Accepted
                              && !excludeIds.Contains(f2.FriendId)  // Thêm điều kiện loại trừ
                              && !existingIds.Contains(f2.FriendId)
                        select f2.FriendId
                    ).Distinct().ToListAsync();

                    var userGroups = await _context.User_Groups
                        .Where(ug => ug.UserId == userId)
                        .Select(ug => ug.GroupId)
                        .ToListAsync();

                    var sameGroupUsers = await _context.User_Groups
                        .Where(ug => userGroups.Contains(ug.GroupId) &&
                                     !excludeIds.Contains(ug.UserId) &&  // Thêm điều kiện loại trừ
                                     !existingIds.Contains(ug.UserId) &&
                                     !friendsOfFriends.Contains(ug.UserId))
                        .Select(ug => ug.UserId)
                        .Distinct()
                        .ToListAsync();

                    var priorityUsers = await _context.Users
                        .Where(u => !excludeIds.Contains(u.UserId) &&  // Thêm điều kiện loại trừ
                                    (friendsOfFriends.Contains(u.UserId) || sameGroupUsers.Contains(u.UserId)))
                        .Select(u => new
                        {
                            User = u,
                            Priority = friendsOfFriends.Contains(u.UserId) ? 1 : 2
                        })
                        .OrderBy(x => x.Priority)
                        .ThenByDescending(x => x.User.CreatedAt)
                        .Select(x => x.User)
                        .ToListAsync();

                    suggestedUsers.AddRange(priorityUsers);
                }

                if (suggestedUsers.Count < MAX_SUGGESTIONS)
                {
                    var existingIds = suggestedUsers.Select(u => u.UserId).Concat(excludeIds).ToHashSet();
                    var remainingCount = MAX_SUGGESTIONS - suggestedUsers.Count;

                    var additionalUsers = await _context.Users
                        .Where(u => !excludeIds.Contains(u.UserId) &&  // Thêm điều kiện loại trừ
                                    !existingIds.Contains(u.UserId))
                        .OrderByDescending(u => u.CreatedAt)
                        .Take(remainingCount)
                        .ToListAsync();

                    suggestedUsers.AddRange(additionalUsers);
                }

                return suggestedUsers.Take(MAX_SUGGESTIONS).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Database error: " + ex.Message);
            }
        }


        public async Task<List<Friend>> GetFriendRequestsAsync(Guid userId)
        {
            try
            {
                return await _context.Friends
                    .Where(f => f.FriendId == userId && f.Status == EventMate_Common.Enum.FriendStatus.Pending)
                    .Include(f => f.User)
                    .OrderByDescending(f => f.CreatedDate)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Database error: " + ex.Message);
            }
        }

        public async Task<Friend> GetFriendshipAsync(Guid userId, Guid friendId)
        {
            return await _context.Friends
                .FirstOrDefaultAsync(f => 
                    (f.UserId == userId && f.FriendId == friendId) || 
                    (f.UserId == friendId && f.FriendId == userId));
        }

        public async Task<bool> DeleteFriendAsync(Friend friend)
        {
            try
            {
                _context.Friends.Remove(friend);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Database error: " + ex.Message);
            }
        }
        public async Task<List<Friend>> GetListPending(Guid userId)
        {
            try
            {
                return await _context.Friends
                    .Where(f => f.UserId == userId && f.Status == EventMate_Common.Enum.FriendStatus.Pending)
                    .Include(f => f.FriendUser)
                    .OrderByDescending(f => f.CreatedDate)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Database error: " + ex.Message);
            }
        }

        public async Task<List<Friend>> GetListFriend(Guid userId)
        {
            try
            {
                return await _context.Friends
                    .Where(f => (f.UserId == userId || f.FriendId == userId) && f.Status == EventMate_Common.Enum.FriendStatus.Accepted)
                    .Include(f => f.FriendUser)
					.Include(f => f.User)
					.OrderByDescending(f => f.CreatedDate)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Database error: " + ex.Message);
            }
        }

    }
} 