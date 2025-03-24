export interface RequestList{

    keySearch?: string;
    sortBy?: string;
    ascending?: boolean;
    currentPage?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
}

export interface Friend {
    id?:string;
    friend: {
        userId?: string;
        email?: string;
        fullName?: string;
        avatar?: string | null;
        address?: string | null;
        description: string | null;
    };
    status?: string;
    createAt:string;
}

export interface Sender {
    userId: string;
    avatar: string;
    fullName: string;
    email: string;
}

export interface Message {
    messageId: string;
    conversationId: string;
    sender: Sender;
    content: string;
    messageType: number;
    sentAt: string;
}