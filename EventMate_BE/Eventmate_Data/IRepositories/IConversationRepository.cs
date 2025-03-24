using EventMate_Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Eventmate_Data.IRepositories
{
    public interface IConversationRepository
    {
        public Task AddConversation(Conversations conversations, List<Guid> listuserId);
        public Task<Conversations> GetConversationById(Guid conversationId);
        Task<bool> IsUserInConversation(Guid conversationId, Guid userId);
        Task SendMessage(Messages message);
        Task<ICollection<Messages>> GetMessages(Guid conversationId);
        Task<Conversations> GetConversationByGroupId(Guid conversationId);
    }
}
