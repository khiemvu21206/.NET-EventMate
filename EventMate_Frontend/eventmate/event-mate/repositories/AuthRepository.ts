
import createRepository from '@/ultilities/createRepository';


export const AuthRepository = createRepository({
  login: async (fetch, email: string, password: string) => {
    const response = await fetch("https://localhost:7121/api/Auth/Login", {
      method: "POST",
      data: {
        email,
        password,
      },
    });
    return response;
  },

  forgotPassword: async (fetch, data: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Auth/forgot-password`, {
      method: "POST",
       data,


    });
    return response;
  },

  createOTP: async (fetch, email: string, password: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Auth/create-otp`, {
      method: "POST",
      data: {
        email,
        password,
      },

    });
    return response;
  },

  resetPassword: async (fetch, password: string, token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Auth/reset-password`, {
      method: "POST",
      data: {
        password,
        token,
      },

    });
    return response;
  },

  verifyOTP: async (fetch, data: any) => {

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Auth/verify-otp`, {
        method: "POST",
        data: data,
      });
      return response;
    },

  changePassword: async (fetch, oldPassword: string, newPassword: string, token: string) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Auth/change-password`, {
        method: "POST",
        data: {
          oldPassword,
          newPassword,
          token,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    },
});

