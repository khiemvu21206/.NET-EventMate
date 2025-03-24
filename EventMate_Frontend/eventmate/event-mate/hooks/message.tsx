import { Message } from "@/model/common";
import { ConversationRepository } from "@/repositories/ConversationRepository";
import { uniqBy } from "lodash";
import { useEffect, useState } from "react";

export const useMessageList = (conversationId: string, currentPage: number, pageSize: number) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [retryCall, setRetryCall] = useState<number>(0);
    const [totalCount, setTotalCount] = useState(0);

    const handleLoadMore = () => {
        setRetryCall(new Date().getTime());
    };

    const getMessageList = async () => {
        try {
            setIsLoading(true);
            const res = await ConversationRepository.getMessages(conversationId, currentPage, pageSize);
            if (!res.error) {
                if (currentPage > 1) {
                    const newMessages = res.data.data.reverse(); 
                    setMessages((current) => {
                        return uniqBy([...newMessages,...current], 'messageId');
                    });

                } else {
                    setMessages(res.data.data.reverse());
                }
                setTotalCount(res.data.totalCount);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if(!conversationId) return;
        getMessageList();
    }, [retryCall,conversationId]);

    return { messages, setMessages, isLoading, handleLoadMore, totalCount };
}