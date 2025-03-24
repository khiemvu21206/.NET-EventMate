using Eventmate_Data.IRepositories;
using EventMate_Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventMate_Service.Services
{
    public class ConversationService
    {
        private readonly IConversationRepository _conversationRepository;
        public ConversationService(IConversationRepository conversationRepository)
        {
            _conversationRepository = conversationRepository;   
        }

        public async Task AddConversation(List<Guid> listuserId)
        {
            var conversation = new Conversations
            {
                Id = Guid.NewGuid(),
                Type = EventMate_Common.Type.ConversationType.Exchange,
            };
            await _conversationRepository.AddConversation(conversation, listuserId);

        }

        
        public async Task<bool> IsUserInConversation(string conversationId, string userId)
        {
            try
            {
                return await _conversationRepository.IsUserInConversation(Guid.Parse(conversationId), Guid.Parse(userId));
            }
            catch (Exception ex)
            {
            
                return false;
            }
        }

        public async Task<Messages> SendMessage( string conversationId, string userId, string message)
        {
            try
            {
                var mess = new Messages
                {
                    MessageId = Guid.NewGuid(),
                    Content = message,
                    ConversationId = Guid.Parse(conversationId),
                    SenderId = Guid.Parse(userId),
                    SentAt = DateTime.UtcNow,
                    Status = 0,
                    MessageType = 0
                };
                await _conversationRepository.SendMessage(mess);
                return mess;
            }
            catch (Exception ex)
            {
                return null;
            }

        }
        public async Task<ICollection<Messages>> GetMessages(string conversationId)
        {
            try
            {
                var messages = await _conversationRepository.GetMessages(Guid.Parse(conversationId));
                return messages;

            }
            catch (Exception ex)
            {
                throw;
            }
          
        }
        public async Task<Conversations> GetConversationById(string conversationId)
        {
            return await _conversationRepository.GetConversationById(Guid.Parse(conversationId));
        }

        public async Task<Conversations> GetConversationsByGroupId(string groupId)
        {
            return await _conversationRepository.GetConversationByGroupId(Guid.Parse(groupId));
        }
       
    }
}
