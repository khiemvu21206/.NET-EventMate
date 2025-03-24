"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
// import { AUTHENTICATION_ERROR_CODE } from "@/constants/constant";
// import { PUB_TOPIC } from "@/constants/pubTopic";
import { clearAuthInfo, setAuthInfo } from "@/ultilities/auth";
import { signOut, useSession } from "next-auth/react";
import {
  ReactNode,
  useEffect,
  createContext,
  useContext,
  useMemo,

} from "react";
// import PubSub from "pubsub-js";
import { usePathname, useRouter } from 'next/navigation';
import { EM_STATUS, WHITELIST_URLS, WHITELIST_URLS_AUTHEN } from "@/constants/constant";
import { AUTHENTICATION_ERROR_CODE } from "@/constants/httpResponse";

interface UserState {
  email: string;
  name: string;
  id: string;
  avatar: string;
  role: string;
  token?: string;
  status: "loading" | "authenticated" | "unauthenticated";
  logout: () => void;
}

const initialState: UserState = {
  email: "",
  name: "",
  id: "",
  avatar: "",
  role: "",
  status: "loading",
  logout: () => { },
};

export const UserContext = createContext<UserState>(initialState);


export const useUserContext = () => useContext(UserContext);


function UserProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  // const currentPage = usePathname();
  const { data: sessionResponse, status } = useSession();

  const currentPage = usePathname();
  // Lưu thông tin user vào local storage khi đăng nhập thành công
  useEffect(() => {
    if (sessionResponse && status === EM_STATUS.authenticated) {
      setAuthInfo(sessionResponse);
    }
  }, [sessionResponse, status]);

  // ========== Manage route ============
  useEffect(() => {
    // Auto redirect to home page when user is authenticated
    console.log(currentPage, status)

    if (currentPage === '/login' && status === EM_STATUS.authenticated) { 
      router.push('/');
    }
    if (currentPage === '/' && status === EM_STATUS.authenticated) {
      const redirectUrl = localStorage.getItem('redirectUrl');
      if(redirectUrl!=null)
      {
        router.push(redirectUrl);
        return;
      }
      router.push('/');
    }

    if (status === EM_STATUS.loading) return;
    if (!currentPage || WHITELIST_URLS.includes(currentPage) || status === EM_STATUS.loading) return;
    // if (sessionResponse?.error === EM_STATUS.RefreshAccessTokenError) {
    //   router.push('/login');
    // }
    

    if (status === EM_STATUS.unauthenticated && !sessionResponse?.user && !WHITELIST_URLS.includes(currentPage)) {
      if(currentPage.includes("accept-invitation"))
      {
        localStorage.setItem('redirectUrl', '/group/invitation-list');  
        const currentUrl = localStorage.getItem('redirectUrl');
        console.log(currentUrl+' redirectURL');
      }
      const redirectUrl = currentPage === '/'
        ? '/login'
        : `/login?error=${AUTHENTICATION_ERROR_CODE.UNAUTHORIZED}`;
      router.push(redirectUrl);
    }

  }, [currentPage, router, sessionResponse, status]);


  // Hàm logout
  const handleLogout = async () => {
    clearAuthInfo();
    signOut({
      redirect: true,
      callbackUrl: "/login"
    });
  };


  const userContextValue = useMemo(
    () => ({
      email: sessionResponse?.user?.email || "",
      name: sessionResponse?.user?.name || "",
      id: sessionResponse?.user?.id || "",
      avatar: sessionResponse?.user?.avatar || "",
      role: sessionResponse?.user?.role || "",
      token: sessionResponse?.user?.token || "",
      status,
      logout: handleLogout,
    }),
    [sessionResponse, status]
  );

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;



