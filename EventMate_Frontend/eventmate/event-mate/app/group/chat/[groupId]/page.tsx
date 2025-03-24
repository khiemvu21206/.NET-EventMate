/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaSmile } from 'react-icons/fa';
import Navbar from '@/components/group/Navbar';
import { useMessageList } from '@/hooks/message';
import useChat from '@/hooks/userChat';
import { useUserContext } from '@/providers/UserProvider';
import Tooltip from '@/components/generator/Tooltip';
import { formatTimeOrDate } from '@/lib/helpers';
import CustomEmojiPicker from '@/components/group/EmojiPicker';
import * as Avatar from "@radix-ui/react-avatar";
import useClickOutside from '@/hooks/useClickOutside';
import { useParams } from 'next/navigation';
import { ConversationRepository } from '@/repositories/ConversationRepository';
import { Conversation } from '@/model/common';



export default function ChatPage() {
  const { id } = useUserContext();
   const params = useParams();
  const groupId = typeof params.groupId === 'string' ? params.groupId : '';
  const [currentPage, setCurrentPage] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [listUserOnline, setListUserOnline] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  
  const emojiPickerRef = useRef<HTMLElement>(null);
  const handleCloseEmojiPicker = () => {
    setShowEmojiPicker(false);
  };
  useClickOutside(showEmojiPicker, emojiPickerRef as React.RefObject<HTMLDivElement>, 'mousedown', handleCloseEmojiPicker);
  const { messages, setMessages, isLoading, handleLoadMore, totalCount } = useMessageList(conversation?.id || '', currentPage, 20);
  const { sendMessage } = useChat({
    userId: id,
    conversationId: conversation?.id || '',
    setMessages,
    setListUserOnline
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!groupId) return; 

    const fetchConversation = async () => {
        const res = await ConversationRepository.getConversation(groupId);
        if (!res?.error) {
          setConversation(res.data);
        }
     
    };

    fetchConversation();
  }, [groupId]);
  useEffect(() => {
    const container = messagesEndRef.current;

    if (!container) return;

    if (currentPage === 1) {
      scrollToBottom();
    } else {
      container.scrollTo({ top: 1000, behavior: 'smooth' });
    }
  }, [messages]);



  // Kiểm tra xem tin nhắn có phải là tin nhắn đầu tiên của nhóm không
  const isFirstInGroup = (message: any, index: any) => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    return prevMessage.sender.userId !== message.sender.userId;
  };

  // Kiểm tra xem tin nhắn có phải là tin nhắn cuối cùng của nhóm không
  const isLastInGroup = (message: any, index: any) => {
    if (index === messages.length - 1) return true;
    const nextMessage = messages[index + 1];
    return nextMessage.sender.userId !== message.sender.userId;
  };

  // Kiểm tra xem có nên hiển thị timestamp không

  const onScrollToGetMoreMessage = async (event: any) => {

    if (
      event.currentTarget.scrollTop <= 0 && !isLoading &&
      messages.length < totalCount
    ) {
      setCurrentPage(currentPage + 1);
      handleLoadMore();
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex min-h-screen h-full overflow-y-hidden bg-gray-50">
      <Navbar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-800">Group Chat</h1>
          <p className="text-sm text-gray-500 mt-1">Chat with your group members</p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-8 py-6 max-h-[calc(100vh-200px)]"
          onScroll={onScrollToGetMoreMessage}>
          <div className="space-y-1">
            {messages.map((message, index) => (
              <div
                key={message.messageId}
                className={`flex items-end space-x-2 ${message.sender.userId === id ? 'flex-row-reverse space-x-reverse' : ''
                  } ${!isFirstInGroup(message, index) ? 'mt-1' : 'mt-4'}`}
              >
                {/* Avatar - chỉ hiển thị ở tin nhắn cuối cùng của nhóm */}
                {isLastInGroup(message, index) ? (
                  <div className="flex-shrink-0 flex relative items-center justify-center">

                    <Avatar.Root className="inline-flex h-[30px] w-[30px] select-none overflow-hidden rounded-full bg-slate-100">
                      <Avatar.Image
                        className="w-8 h-8 rounded-full object-cover"
                        src={message.sender.avatar}
                        alt={message.sender.fullName || message.sender.email}
                      />
                    </Avatar.Root>
                    {listUserOnline.includes(message.sender.userId) && (
                      <span className={`absolute -bottom-1 ${listUserOnline.includes(message.sender.userId) ? 'left-0' : 'right-0'
                        } w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full`}></span>

                    )}
                  </div>
                ) : (
                  <div className="w-8" /> // Placeholder để giữ căn chỉnh
                )}

                <div className={`flex flex-col ${message.sender.userId === id ? 'items-end' : 'items-start'
                  }`}>
                  {/* Tên người gửi - chỉ hiển thị ở tin nhắn đầu tiên của nhóm */}
                  {isFirstInGroup(message, index) && (
                    <div className="flex items-center space-x-2 mb-1 px-1">
                      <span className="text-sm font-medium text-gray-900">{message.sender.fullName || message.sender.email}</span>
                    </div>
                  )}

                  {/* Nội dung tin nhắn */}
                  <div
                    data-tooltip-id={message.messageId}
                    data-tooltip-content={formatTimeOrDate(message.sentAt)}
                    className={`px-4 py-2 rounded-2xl max-w-md ${message.sender.userId === id
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none'
                      }`}>
                    <p className="text-sm whitespace-pre-wrap break-words"
                    >{message.content}</p>

                  </div>

                  {/* Timestamp - chỉ hiển thị ở tin nhắn cuối cùng của nhóm hoặc khi có khoảng cách thời gian */}

                </div>
                <Tooltip id={message.messageId} />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 px-8 py-4 relative">
          <form className="flex items-center space-x-4">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <FaSmile size={20} />
            </button>
            {showEmojiPicker && (

              <CustomEmojiPicker
                onSelect={handleEmojiSelect}
                onClose={() => setShowEmojiPicker(false)}
              />
            )}
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage(newMessage);
                  setNewMessage('');
                  scrollToBottom();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              onClick={() => {
                sendMessage(newMessage);
                setNewMessage('');
                scrollToBottom();
              }}
              disabled={!newMessage.trim()}
              className="p-2 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPaperPlane size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
