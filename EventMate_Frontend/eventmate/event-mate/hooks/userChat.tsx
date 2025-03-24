import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { Message } from "@/model/common";
import { toastHelper } from "@/ultilities/toastMessageHelper";
import { useRouter } from "next/navigation";
export interface useChatProps {
    userId?: string;
    conversationId: string;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    setListUserOnline: React.Dispatch<React.SetStateAction<string[]>>;
}

const useChat = ({ userId, conversationId, setMessages, setListUserOnline }: useChatProps) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const router = useRouter();
    useEffect(() => {
        if (!userId || !conversationId) return;

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(process.env.NEXT_PUBLIC_BACKEND_URL_CHAT!, {
                transport: signalR.HttpTransportType.WebSockets,
                withCredentials: true
            })
            .withAutomaticReconnect()
            .build();
        newConnection.on("UpdateUserList", (updatedUsers) => {
            console.log("Updated users:", updatedUsers);
            setListUserOnline(updatedUsers);
        });
        newConnection.on("JoinConversationFailed", (error) => {
            toastHelper.error(error);
            router.push("/");
        });
        newConnection.start()
            .then(async () => {
                await newConnection.invoke("JoinConversation", conversationId, userId);
                newConnection.on("ReceiveMessage", (convId, userId, message: Message) => {
                    if (convId === conversationId) {
                        setMessages((prev: Message[]) => [...prev, message]);
                    }
                });

                newConnection.on("SendMessageFailed", (error) => {
                    toastHelper.error("Lỗi gửi tin nhắn:", error);
                });



            })
            .catch(err => console.error("SignalR Connection Error: ", err));

        setConnection(newConnection);

        return () => {
            if (newConnection) {
                newConnection.invoke("LeaveConversation", conversationId);
                newConnection.stop();
            }
        };
    }, [userId, conversationId]);

    const sendMessage = async (message: string) => {
        if (connection && message.trim()) {
            await connection.invoke("SendMessage", conversationId, userId, message);
        }
    };

    return { sendMessage };
};

export default useChat;