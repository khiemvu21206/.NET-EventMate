using AutoMapper;
using EventMate_Service.Services;
using EventMate_WebAPI.ModelsMapping.Message;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

public class ChatHub : Hub
{

    private readonly ConversationService _conversationService;
    private readonly UserService _userService;
    private readonly IMapper _mapper;
    // Lưu danh sách người dùng đang online
    private static readonly ConcurrentDictionary<string, HashSet<string>> _conversationUsers = new();
    private static readonly ConcurrentDictionary<string, string> _userConnections = new(); // Lưu mapping userId -> ConnectionId

    public ChatHub(ConversationService conversationService, UserService userService, IMapper mapper)
    {
        _mapper = mapper;
        _userService = userService;
        _conversationService = conversationService;
    }

    public async Task JoinConversation(string conversationId, string userId)
    {
        var isInConver = await _conversationService.IsUserInConversation(conversationId, userId);

        if (isInConver)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conversationId);

            _conversationUsers.AddOrUpdate(conversationId,
                new HashSet<string> { userId },
                (key, users) => { users.Add(userId); return users; });

            _userConnections[Context.ConnectionId] = userId; 

            await Clients.Group(conversationId).SendAsync("UpdateUserList", _conversationUsers[conversationId]);

            await Clients.Caller.SendAsync("JoinConversationSuccess", "Bạn đã tham gia cuộc hội thoại thành công.");
        }
        else
        {
            await Clients.Caller.SendAsync("JoinConversationFailed", "Bạn không thuộc về cuộc hội thoại này.");
        }
    }

    public async Task LeaveConversation(string conversationId, string userId)
    {
        if (_conversationUsers.TryGetValue(conversationId, out var users))
        {
            users.Remove(userId);
            if (users.Count == 0)
            {
                _conversationUsers.TryRemove(conversationId, out _);
            }
        }

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId);
        await Clients.Group(conversationId).SendAsync("UpdateUserList", _conversationUsers.GetValueOrDefault(conversationId, new HashSet<string>()));
    }
    public override async Task OnDisconnectedAsync(Exception exception)
    {
        if (_userConnections.TryGetValue(Context.ConnectionId, out var userId))
        {
            _userConnections.TryRemove(Context.ConnectionId, out _);

            foreach (var conversation in _conversationUsers)
            {
                if (conversation.Value.Contains(userId))
                {
                    conversation.Value.Remove(userId);
                    if (conversation.Value.Count == 0)
                    {
                        _conversationUsers.TryRemove(conversation.Key, out _);
                    }
                    await Clients.Group(conversation.Key).SendAsync("UpdateUserList", conversation.Value);
                }
            }
        }

        await base.OnDisconnectedAsync(exception);
    }

    // Method to send messages to all connected clients
    public async Task SendMessage(string conversationId, string userId, string content)
    {
        var user = await _userService.GetUserByIdAsync(Guid.Parse(userId));
        if (user == null)
        {
            await Clients.Caller.SendAsync("SendMessageFailed", "Gửi tin nhắn thất bại, vui lòng thử lại.");
        }
        var isInConversation = await _conversationService.IsUserInConversation(conversationId, userId);
        if (!isInConversation)
        {
            await Clients.Caller.SendAsync("SendMessageFailed", "Bạn không có quyền gửi tin nhắn trong cuộc hội thoại này.");
            return;
        }

        var message = await _conversationService.SendMessage(conversationId, userId, content);
        message.User = user;
        var messageResponse = _mapper.Map<MessageResponse>(message);
        if (message!=null)
        {
            await Clients.Group(conversationId).SendAsync("ReceiveMessage", conversationId, userId, messageResponse);
        }
        else
        {
 
            await Clients.Caller.SendAsync("SendMessageFailed", "Gửi tin nhắn thất bại, vui lòng thử lại.");
        }
    }
    public List<string> GetUsersInConversation(string conversationId)
    {
        return _conversationUsers.TryGetValue(conversationId, out var users) ? users.ToList() : new List<string>();
    }

}
