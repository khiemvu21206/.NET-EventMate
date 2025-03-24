import createRepository from '@/ultilities/createRepository';

interface ListRequestModel {
  currentPage: number;
  pageSize: number;
  keySearch?: string;
}

export const FriendRepository = createRepository({
  requestAddFriend: async (fetch, friendId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/friends/request-add-friend?friendId=${friendId}`, {
      method: "POST",
    });
    return response;
  },

  acceptFriendRequest: async (fetch, requestId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/friends/accept/${requestId}`, {
      method: "PUT",
    });
    return response;
  },

  rejectFriendRequest: async (fetch, requestId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/friends/reject/${requestId}`, {
      method: "PUT",
    });
    return response;
  },

  getFriendRequests: async (fetch, data: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/friends/requests`, {
      method: "POST",
      data,
    });
    return response;
  },

  getFriendSuggestions: async (fetch, data: ListRequestModel) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/friends/suggestions`, 
      {
        method: "POST",
        data
      }
    );
    return response;
  },

  cancelFriendRequest: async (fetch, requestId: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/friends/cancel-request/${requestId}`,
      {
        method: "DELETE",
      }
    );
    return response;
  },

  unfriend: async (fetch, friendId: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/friends/unfriend/${friendId}`,
      {
        method: "DELETE",
      }
    );
    return response;
  },
  getListFriends: async (fetch, data: ListRequestModel) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/friends/friends`, 
      {
        method: "POST",
        data
      }
    );
    return response;
  },
  getListPending: async (fetch, data: ListRequestModel) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/friends/pending-requests`, 
      {
        method: "POST",
        data
      }
    );
    return response;
  },
}); 