using AutoMapper;
using EventMate_Common.Common;
using EventMate_Service.Services;
using EventMate_WebAPI.ModelsMapping.Common;
using EventMate_WebAPI.ModelsMapping.Message;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace EventMate_WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConversationController : ControllerBase
    {
        private readonly ConversationService _conversationService;
        private readonly IMapper _mapper;
        public ConversationController(ConversationService conversationService, IMapper mapper)
        {
            _conversationService = conversationService;
            _mapper = mapper;
        }

        [HttpPost("get_messages/{conversationId}")]
        public async Task<IActionResult> GetMessagesConversation(string conversationId, [FromBody] PagingRequest request)
        {
            if (string.IsNullOrEmpty(conversationId))
            {
                return BadRequest(new ApiResponse<string>(400, "Invalid conversationId", "The conversationId field is required."));
            }

            var conversation = await _conversationService.GetConversationById(conversationId);
            if (conversation == null)
            {
                return NotFound(new ApiResponse<string>(404, ResponseKeys.ConversationNotFound, "Conversation Not Found"));
            }

            var messages = await _conversationService.GetMessages(conversationId);
            var totalCount = messages.Count();

            var query = messages.AsQueryable();
            query = query.ApplyPaging(request.CurrentPage, request.PageSize);
            var messageResponse = _mapper.Map<ICollection<MessageResponse>>(query);
            var data = new
            {
                totalCount,
                currentPage = request.CurrentPage,
                data = messageResponse.ToList()
            };

            return Ok(new ApiResponse<object>(200, null, data));
        }
        [HttpGet("get_conversation")]
        public async Task<IActionResult> GetConversation( string id)
        {
           

            var messages = await _conversationService.GetConversationsByGroupId(id);
            if (messages == null)
                return NotFound(new ApiResponse<string>(404, ResponseKeys.ConversationNotFound, "Conversation Not Found"));

            return Ok(new ApiResponse<object>(200, null, messages));
        }
    }
}
