/* eslint-disable @typescript-eslint/no-explicit-any */
import createRepository from '@/ultilities/createRepository';
export const ConversationRepository = createRepository({

getMessages: async (fetch, conversationId: string, currentPage: number, pageSize: number) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Conversation/get_messages/${conversationId}`, {
    method: "POST",
    data: JSON.stringify({ 
        currentPage: currentPage, 
        pageSize: pageSize 
    }),
  });
  return response;
},
getConversation: async (fetch, conversationId: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Conversation/get_conversation?id=${conversationId}`, {
    method: "GET",
  });
  return response;
}
}
);