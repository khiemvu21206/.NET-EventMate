using EventMate.Data;
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
    public class ConversationRepository : IConversationRepository
    {
        private readonly DataContext _context;
        public ConversationRepository(DataContext context) {
        _context = context;
        }

        public async Task AddConversation(Conversations conversation, List<Guid> listUserId)
        {
            await _context.Conversations.AddAsync(conversation);

            var userConversations = listUserId.Select(userId => new User_Conversation
            {
                UserId = userId,
                ConversationId = conversation.Id
            }).ToList();

            await _context.Conversations.AddAsync(conversation);
            await _context.User_Conversations.AddRangeAsync(userConversations);
          
            await _context.SaveChangesAsync();
        }

        public async Task<Conversations> GetConversationById(Guid conversationId)
        {
            var conversation = _context.Conversations.Include(c => c.User_Conversations).FirstOrDefault(con => con.Id == conversationId);
            return conversation;
        }
        public async Task<bool> IsUserInConversation(Guid conversationId, Guid userId)
        {
            var conversation = await _context.Conversations
                .Include(c => c.User_Conversations)
                .FirstOrDefaultAsync(con => con.Id == conversationId);

            if (conversation == null) return false;

            return conversation.User_Conversations.Any(uc => uc.UserId == userId);
        
        }

        public async Task SendMessage(Messages message)
        {
            await _context.Messages.AddAsync(message);
            await _context.SaveChangesAsync();
        }

        public async Task<ICollection<Messages>> GetMessages(Guid conversationId)
        {
            var message  = await _context.Messages.Include(m => m.User)
                .Where(m => m.ConversationId == conversationId).OrderByDescending(m => m.SentAt).ToListAsync();
            return message;
        }
        public async Task<Conversations> GetConversationByGroupId(Guid groupId)
        {
            var conversation = await _context.Conversations.FirstOrDefaultAsync(x => x.GroupId == groupId);
            return conversation;
        }
    }
}
