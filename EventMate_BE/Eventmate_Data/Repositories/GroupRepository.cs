using EventMate.Data;
using EventMate_Common.Status;
using Eventmate_Data.IRepositories;
using EventMate_Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Eventmate_Data.Repositories
{
    public class GroupRepository : IGroupRepository
    {
        private readonly DataContext _context;
        public GroupRepository(DataContext context)
        {
            _context = context;
        }
        public async Task AddGroupAsync(Groups groupEntity)
        {
            await _context.Groups!.AddAsync(groupEntity);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ChangeGroupStatusAsync(Guid groupId, GroupStatus newStatus)
        {
            var groupEntity = await _context.Groups!.FindAsync(groupId); // Changed from Events to Groups  
            if (groupEntity == null)
            {
                return false; // Return false if group is not found  
            }

            groupEntity.Status = newStatus; // Update the status  
            _context.Groups.Update(groupEntity); // Use the Groups DbSet  
            await _context.SaveChangesAsync(); // Save changes to the database  

            return true; // Return true indicating the operation was successful  
        }

        public async Task DeleteGroupAsync(Guid groupId)
        {
            try
            {
                var groupEntity = await _context.Groups
                                .Include(g => g.Plans)
                                    .ThenInclude(p => p.Activities)
                                .Include(g => g.Costs)
                                .Include(g => g.Conversation)
                                    .ThenInclude(c => c.Messages)
                                .Include(g => g.Conversation)
                                    .ThenInclude(c => c.User_Conversations)
                                .Include(g => g.User_Groups)
                                .Include(g => g.Requests)
                                .Include(g => g.Albums)
                                .FirstOrDefaultAsync(g => g.GroupId == groupId);

                if (groupEntity != null)
                {
                    // Check and delete related Plans and their Activities if any
                    if (groupEntity.Plans != null)
                    {
                        foreach (var plan in groupEntity.Plans)
                        {
                            if (plan.Activities != null)
                            {
                                foreach (var activity in plan.Activities)
                                {
                                    if (activity.Costs != null)
                                    {
                                        _context.Costs.RemoveRange(activity.Costs);
                                    }
                                }
                                _context.Activities.RemoveRange(plan.Activities);
                            }
                        }
                        _context.Plans.RemoveRange(groupEntity.Plans);
                    }

                    // Check and delete related Costs if any
                    if (groupEntity.Costs != null)
                    {
                        _context.Costs.RemoveRange(groupEntity.Costs);
                    }

                    // Check and delete related Conversations, Messages, and User_Conversations if any
                    if (groupEntity.Conversation != null)
                    {
                        if (groupEntity.Conversation.Messages != null)
                        {
                            _context.Messages.RemoveRange(groupEntity.Conversation.Messages);
                        }
                        if (groupEntity.Conversation.User_Conversations != null)
                        {
                            _context.User_Conversations.RemoveRange(groupEntity.Conversation.User_Conversations);
                        }
                        _context.Conversations.Remove(groupEntity.Conversation);
                    }

                    // Check and delete User_Groups if any
                    if (groupEntity.User_Groups != null)
                    {
                        _context.User_Groups.RemoveRange(groupEntity.User_Groups);
                    }

                    // Check and delete Requests if any
                    if (groupEntity.Requests != null)
                    {
                        _context.Requests.RemoveRange(groupEntity.Requests);
                    }

                    // Check and delete Albums if any
                    if (groupEntity.Albums != null)
                    {
                        _context.Albums.RemoveRange(groupEntity.Albums);
                    }

                    // Finally, remove the group entity itself
                    _context.Groups.Remove(groupEntity);

                    // Save all changes to the database
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        public async Task<IEnumerable<Groups>> GetAllGroupsAsync()
        {
            return await _context.Groups!.ToListAsync();
        }
        public async Task<IEnumerable<Groups>> GetAllGroupsByUserIdAsync(Guid id)
        {
            return await _context.Groups!
            .Include(g => g.User_Groups)
            .Include(g => g.Events)
            .Where(g => g.User_Groups.Any(ug => ug.UserId == id))
            .ToListAsync();
        }

        public async Task<IEnumerable<Requests>> GetAllRequestAsync(Guid id)
        {
            if (_context.Users == null || _context.Requests == null)
            {
                // Handle the case where either DbSet is null.  Throw an exception, log an error, or return an empty list.  
                return new List<Requests>(); // Example: Return an empty list.  
            }

            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                // Handle the case where the user with the given id is not found.  
                return new List<Requests>(); // Or throw an exception, log an error, etc.  
            }
            var r = await _context.Requests
                .Include(c => c.Sender)
                .Include(c => c.Group).ToListAsync();
            //var email = r.Select(r => r.Email).ToList();
            var requests = r
                .Where(x => x.Email.Trim().ToLower().Equals(user.Email.Trim().ToLower())).ToList();

            return requests;
        }

        public async Task<Groups?> GetGroupByIdAsync(Guid groupId)
        {
            var groupEntity = await _context.Groups!
                .Include(c => c.User)
                .Include(c => c.Events)
                .FirstOrDefaultAsync(c => c.GroupId.Equals(groupId));
            return groupEntity;
        }

        public async Task<bool> IsUserByIdAsync(Guid userId)
        {
            try
            {
                var groupEntity = await _context.Users

                        .FirstOrDefaultAsync(u => u.UserId == userId);
                return groupEntity == null;
            }
            catch (Exception ex)
            {
                return true;
            }

        }
        public async Task<bool> AddUserToGroupAsync(User_Group userGroup)
        {
            await _context.User_Groups.AddAsync(userGroup);
            var group = await _context.Groups.FindAsync(userGroup.GroupId);
            if (group != null)
            {
                group.TotalMember += 1;
                _context.Groups.Update(group);
            }
            return await _context.SaveChangesAsync() > 0;
        }
        public async Task<bool> IsUserInGroupAsync(Guid userId, Guid groupId)
        {
            return await _context.User_Groups
                .AnyAsync(ug => ug.UserId == userId && ug.GroupId == groupId);
        }
        public async Task<bool> AddConversationToGroupAsync(Conversations conversation)
        {
            await _context.Conversations.AddAsync(conversation);
            return await _context.SaveChangesAsync() > 0; // Returns true if the conversation was saved  
        }
        public async Task<List<User_Group>> ListUsersInGroupAsync(Guid groupId)
        {
            return await _context.User_Groups
                .Where(ug => ug.GroupId == groupId)
                .Include(ug => ug.User)
                .ToListAsync();
        }
        public async Task AddRequestAsync(Requests requestEntity)
        {
            try
            {
                await _context.Requests.AddAsync(requestEntity);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users
                .ToListAsync();
        }
        public async Task<User_Group> GetUserGroupByIdAsync(Guid id)
        {
            return await _context.User_Groups.FindAsync(id);
        }
        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(c => c.Email.ToLower() == email);
        }
        public async Task<User_Group> GetUserGroupAsync(Guid userId, Guid groupId)
        {
            return await _context.User_Groups.FirstOrDefaultAsync(s => s.UserId == userId && s.GroupId == groupId);
        }
        public async Task DeleteUserGroupAsync(Guid id)
        {
            var userGroup = await _context.User_Groups.FindAsync(id);
            if (userGroup == null)
            {
                throw new Exception($"User_Group with id {id} not found.");
            }

            _context.User_Groups.Remove(userGroup);
            await _context.SaveChangesAsync();
        }
        public async Task<Requests> GetRequestByIdAsync(Guid id)
        {
            return await _context.Requests.FindAsync(id);
        }
        public async Task<Requests> GetRequestAsync(Guid userId, Guid groupId)
        {
            var u = await _context.Users.FindAsync(userId);
            return await _context.Requests.FirstOrDefaultAsync(s => s.Email == u.Email && s.GroupId == groupId);
        }

        public async Task DeleteRequestAsync(Guid id)
        {
            var request = await _context.Requests.FindAsync(id);
            if (request == null)
            {
                throw new Exception($"Request with id {id} not found.");
            }

            _context.Requests.Remove(request);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> CreateTemplateTimeLineAsync(int eventType, Guid groupId, Guid userId)
        {
            try
            {
                var group = await _context.Groups
                    .Include(g => g.Plans)
                    .FirstOrDefaultAsync(g => g.GroupId == groupId);

                if (group == null) return false;

                var activities = new List<Activity>();
                var plans = new List<Plans>();

                switch (eventType)
                {
                    case 1: // Cultural
                        // First timeline: Preparation activities
                        plans.Add(new Plans
                        {
                            PlanId = Guid.NewGuid(),
                            GroupId = groupId,
                            Title = "Preparation for Cultural Event",
                            Description = "Preparation phase including gathering friends, booking hotels, and buying tickets",
                            Status = PlanStatus.InProgress,
                            Schedule = DateTime.UtcNow.AddDays(3)
                        });
                        activities.AddRange(new[]
                        {
                            new Activity {
                                PlanId = plans[0].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Meetup and Gather Friends",
                                Category = "Gathering",
                                Schedule = DateTime.UtcNow.AddDays(1),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            },
                            new Activity {
                                PlanId = plans[0].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Hotel Booking",
                                Category = "Accommodation",
                                Schedule = DateTime.UtcNow.AddDays(1),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            },
                            new Activity {
                                PlanId = plans[0].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Food Arrangements",
                                Category = "Catering",
                                Schedule = DateTime.UtcNow.AddDays(2),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            },
                            new Activity {
                                PlanId = plans[0].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Ticket Purchase",
                                Category = "Tickets",
                                Schedule = DateTime.UtcNow.AddDays(2),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            }
                        });

                        // Second timeline: Event attendance activities
                        plans.Add(new Plans
                        {
                            PlanId = Guid.NewGuid(),
                            GroupId = groupId,
                            Title = "Cultural Event Attendance",
                            Description = "Activities during the cultural event",
                            Status = PlanStatus.InProgress,
                            Schedule = DateTime.UtcNow.AddDays(5)
                        });
                        activities.AddRange(new[]
                        {
                            new Activity {
                                PlanId = plans[1].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Attend Opening Ceremony",
                                Category = "Event",
                                Schedule = DateTime.UtcNow.AddDays(4),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            },
                            new Activity {
                                PlanId = plans[1].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Explore Cultural Exhibits",
                                Category = "Event",
                                Schedule = DateTime.UtcNow.AddDays(4),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            }
                        });

                        // Third timeline: Post-event activities
                        plans.Add(new Plans
                        {
                            PlanId = Guid.NewGuid(),
                            GroupId = groupId,
                            Title = "Post-Event Activities",
                            Description = "Activities after the cultural event",
                            Status = PlanStatus.InProgress,
                            Schedule = DateTime.UtcNow.AddDays(7)
                        });
                        activities.AddRange(new[]
                        {
                            new Activity {
                                PlanId = plans[2].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Rest at Hotel",
                                Category = "Relaxation",
                                Schedule = DateTime.UtcNow.AddDays(6),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            },
                            new Activity {
                                PlanId = plans[2].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Lunch",
                                Category = "Dining",
                                Schedule = DateTime.UtcNow.AddDays(6),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            },
                            new Activity {
                                PlanId = plans[2].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Karaoke",
                                Category = "Entertainment",
                                Schedule = DateTime.UtcNow.AddDays(6),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            },
                            new Activity {
                                PlanId = plans[2].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Buy Local Gifts",
                                Category = "Shopping",
                                Schedule = DateTime.UtcNow.AddDays(7),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            }
                        });
                        break;

                    case 2: // Concerts
                        // First timeline: Preparation activities
                        plans.Add(new Plans
                        {
                            PlanId = Guid.NewGuid(),
                            GroupId = groupId,
                            Title = "Preparation for Concert",
                            Description = "Preparation phase including gathering friends, booking hotels, and buying tickets",
                            Status = PlanStatus.InProgress,
                            Schedule = DateTime.UtcNow.AddDays(3)
                        });
                        activities.AddRange(new[]
                        {
                            new Activity {
                                PlanId = plans[0].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Meetup and Gather Friends",
                                Category = "Gathering",
                                Schedule = DateTime.UtcNow.AddDays(1),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            },
                            new Activity {
                                PlanId = plans[0].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Hotel Booking",
                                Category = "Accommodation",
                                Schedule = DateTime.UtcNow.AddDays(1),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            },
                            new Activity {
                                PlanId = plans[0].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Food Arrangements",
                                Category = "Catering",
                                Schedule = DateTime.UtcNow.AddDays(2),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            },
                            new Activity {
                                PlanId = plans[0].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Ticket Purchase",
                                Category = "Tickets",
                                Schedule = DateTime.UtcNow.AddDays(2),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            }
                        });

                        // Second timeline: Event attendance activities
                        plans.Add(new Plans
                        {
                            PlanId = Guid.NewGuid(),
                            GroupId = groupId,
                            Title = "Concert Attendance",
                            Description = "Activities during the concert",
                            Status = PlanStatus.InProgress,
                            Schedule = DateTime.UtcNow.AddDays(5)
                        });
                        activities.AddRange(new[]
                        {
                            new Activity {
                                PlanId = plans[1].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Attend Concert",
                                Category = "Event",
                                Schedule = DateTime.UtcNow.AddDays(4),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            },
                            new Activity {
                                PlanId = plans[1].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Meet the Artists",
                                Category = "Event",
                                Schedule = DateTime.UtcNow.AddDays(4),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            }
                        });

                        // Third timeline: Post-event activities
                        plans.Add(new Plans
                        {
                            PlanId = Guid.NewGuid(),
                            GroupId = groupId,
                            Title = "Post-Concert Activities",
                            Description = "Activities after the concert",
                            Status = PlanStatus.InProgress,
                            Schedule = DateTime.UtcNow.AddDays(7)
                        });
                        activities.AddRange(new[]
                        {
                            new Activity {
                                PlanId = plans[2].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Rest at Hotel",
                                Category = "Relaxation",
                                Schedule = DateTime.UtcNow.AddDays(6),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            },
                            new Activity {
                                PlanId = plans[2].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Lunch",
                                Category = "Dining",
                                Schedule = DateTime.UtcNow.AddDays(6),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            },
                            new Activity {
                                PlanId = plans[2].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Karaoke",
                                Category = "Entertainment",
                                Schedule = DateTime.UtcNow.AddDays(6),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            },
                            new Activity {
                                PlanId = plans[2].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Buy Concert Merchandise",
                                Category = "Shopping",
                                Schedule = DateTime.UtcNow.AddDays(7),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            }
                        });
                        break;

                    case 3: // Food Festival
                        // First timeline: Preparation activities
                        plans.Add(new Plans
                        {
                            PlanId = Guid.NewGuid(),
                            GroupId = groupId,
                            Title = "Preparation for Food Festival",
                            Description = "Preparation phase including gathering friends, booking hotels, and buying tickets",
                            Status = PlanStatus.InProgress,
                            Schedule = DateTime.UtcNow.AddDays(3)
                        });
                        activities.AddRange(new[]
                        {
                            new Activity {
                                PlanId = plans[0].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Meetup and Gather Friends",
                                Category = "Gathering",
                                Schedule = DateTime.UtcNow.AddDays(1),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            },
                            new Activity {
                                PlanId = plans[0].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Hotel Booking",
                                Category = "Accommodation",
                                Schedule = DateTime.UtcNow.AddDays(1),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            },
                            new Activity {
                                PlanId = plans[0].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Food Arrangements",
                                Category = "Catering",
                                Schedule = DateTime.UtcNow.AddDays(2),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            },
                            new Activity {
                                PlanId = plans[0].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Ticket Purchase",
                                Category = "Tickets",
                                Schedule = DateTime.UtcNow.AddDays(2),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            }
                        });

                        // Second timeline: Event attendance activities
                        plans.Add(new Plans
                        {
                            PlanId = Guid.NewGuid(),
                            GroupId = groupId,
                            Title = "Food Festival Attendance",
                            Description = "Activities during the food festival",
                            Status = PlanStatus.InProgress,
                            Schedule = DateTime.UtcNow.AddDays(5)
                        });
                        activities.AddRange(new[]
                        {
                            new Activity {
                                PlanId = plans[1].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Visit Food Stalls",
                                Category = "Event",
                                Schedule = DateTime.UtcNow.AddDays(4),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            },
                            new Activity {
                                PlanId = plans[1].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Attend Cooking Shows",
                                Category = "Event",
                                Schedule = DateTime.UtcNow.AddDays(4),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            }
                        });

                        // Third timeline: Post-event activities
                        plans.Add(new Plans
                        {
                            PlanId = Guid.NewGuid(),
                            GroupId = groupId,
                            Title = "Post-Food Festival Activities",
                            Description = "Activities after the food festival",
                            Status = PlanStatus.InProgress,
                            Schedule = DateTime.UtcNow.AddDays(7)
                        });
                        activities.AddRange(new[]
                        {
                            new Activity {
                                PlanId = plans[2].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Rest at Hotel",
                                Category = "Relaxation",
                                Schedule = DateTime.UtcNow.AddDays(6),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            },
                            new Activity {
                                PlanId = plans[2].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Lunch",
                                Category = "Dining",
                                Schedule = DateTime.UtcNow.AddDays(6),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            },
                            new Activity {
                                PlanId = plans[2].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Karaoke",
                                Category = "Entertainment",
                                Schedule = DateTime.UtcNow.AddDays(6),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            },
                            new Activity {
                                PlanId = plans[2].PlanId,
                                ActivityId = Guid.NewGuid(),
                                Content = "Buy Local Gifts",
                                Category = "Shopping",
                                Schedule = DateTime.UtcNow.AddDays(7),
                                CreatedBy = userId,
                                Status = PlanDetailStatus.InProgress
                            }
                        });
                        break;
                }

                foreach (var plan in plans)
                {
                    _context.Plans.Add(plan);
                    await _context.SaveChangesAsync();

                    var planActivities = activities.Where(a => a.PlanId == plan.PlanId).ToList();
                    foreach (var activity in planActivities)
                    {
                        _context.Activities.Add(activity);
                    }
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return false;
            }
        }

        public async Task<bool> AddUserToConversationAsync(Guid userId, Guid conversationId)
        {
            var conversation = await _context.Conversations
                .Include(c => c.User_Conversations)
                .FirstOrDefaultAsync(c => c.Id == conversationId);

            if (conversation == null)
            {
                return false;
            }

            if (conversation.User_Conversations.Any(uc => uc.UserId == userId))
            {
                return false; // User already in conversation
            }

            var userConversation = new User_Conversation
            {
                UserId = userId,
                ConversationId = conversationId
            };

            _context.User_Conversations.Add(userConversation);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Conversations?> GetConversationByGroupIdAsync(Guid groupId)
        {
            return await _context.Conversations
                .FirstOrDefaultAsync(c => c.GroupId == groupId);
        }

        public async Task<bool> ChangeGroupLeaderAsync(Guid userId, Guid groupId)
        {
            var group = await _context.Groups.FirstOrDefaultAsync(g => g.GroupId == groupId);
            if (group == null)
            {
                return false;
            }

            group.Leader = userId;
            _context.Groups.Update(group);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> RemoveUserFromGroupAsync(Guid userId, Guid groupId)
        {
            var userGroup = await _context.User_Groups.FirstOrDefaultAsync(ug => ug.UserId == userId && ug.GroupId == groupId);
            if (userGroup == null)
            {
                return false;
            }

            // Remove user from User_Conversations
            var userConversation = await _context.User_Conversations
            .Include(uc => uc.Conversation)
            .FirstOrDefaultAsync(uc => uc.UserId == userId && uc.Conversation.GroupId == groupId);
            if (userConversation != null)
            {
                _context.User_Conversations.Remove(userConversation);
            }

            _context.User_Groups.Remove(userGroup);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> ChangeGroupCurrencyAsync(Guid groupId, string currency)
        {
            var group = await _context.Groups.FirstOrDefaultAsync(g => g.GroupId == groupId);
            if (group == null)
            {
                return false;
            }

            group.Currency = currency;
            _context.Groups.Update(group);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> RemovePlansFromGroupAsync(Guid groupId)
        {
            try
            {
                var groupEntity = await _context.Groups
                .Include(g => g.Plans)
                    .ThenInclude(p => p.Activities)
                    .ThenInclude(p=>p.Costs)
                .FirstOrDefaultAsync(g => g.GroupId == groupId);

                if (groupEntity == null || groupEntity.Plans == null)
                {
                    return false;
                }

                foreach (var plan in groupEntity.Plans)
                {
                    if (plan.Activities != null)
                    {
                        foreach (var activity in plan.Activities)
                        {
                            if (activity.Costs != null)
                            {
                                _context.Costs.RemoveRange(activity.Costs);
                            }
                        }
                        _context.Activities.RemoveRange(plan.Activities);
                    }
                }
                _context.Plans.RemoveRange(groupEntity.Plans);

                return await _context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return false;
            }
        }
    }

}
