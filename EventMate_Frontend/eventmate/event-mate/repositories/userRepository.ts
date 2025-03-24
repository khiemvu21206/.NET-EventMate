// api/user.ts
import createRepository from '@/ultilities/createRepository';

interface UserInfo {
    id: string;
    email: string;
    address: string;
}

export const userRepository = createRepository({
    getUserInfo: async (fetch, token: string | undefined, userId: string) => {
        if (!token) {
            throw new Error('Token is required');
        }
        console.log('Fetching user info:', { userId, token });
        try {
            const response = await fetch(`https://localhost:7121/api/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('User info response:', response);
            return response;
        } catch (error) {
            console.error('Error fetching user info:', error);
            throw error;
        }
    },
    updateAddress: async (fetch, token: string | undefined, userId: string, address: string) => {
        if (!token) {
            throw new Error('Token is required');
        }
        return await fetch(`https://localhost:7121/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: {
                address: address,
                fullName: undefined,
                dateOfBirth: undefined,
                phone: undefined,
                companyName: undefined,
                description: undefined,
                avatar: undefined
            }
        });
    },
});

export async function fetchUserProfile(userId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    const result = await response.json();
    if (result.status === 200) {
      return result.data;
    } else {
      throw new Error(result.message || "Invalid response from server");
    }
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An unknown error occurred");
  }
}
