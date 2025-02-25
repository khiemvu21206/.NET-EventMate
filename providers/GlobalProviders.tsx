import ReactPortal from "@/components/basic/ReactPortal";
import { ReactNode } from "react";
import { cssTransition, ToastContainer } from "react-toastify";
import LanguageProvider from "./LanguageProvider";
import UserProvider from "./UserProvider";
import { SessionProvider } from "next-auth/react";
const customTransition = cssTransition({
    enter: 'custom-enter',
    exit: 'custom-exit',
});
const GlobalProviders = ({ children }: { children: ReactNode }) => {
    return (
        <SessionProvider refetchOnWindowFocus={false}>

        <LanguageProvider>
          <UserProvider >
            
        { children }
    <ReactPortal wrapperId="global-toast-wrapper">
        <ToastContainer
            transition={customTransition}
            limit={1}
            position={ 'top-left'}
            theme="colored"
            className="display-linebreak"
            draggable={false}
            closeButton={false}
            hideProgressBar={true}
        />
    </ReactPortal>
    </UserProvider>
          </LanguageProvider>

        </SessionProvider>
);
    
}
export default GlobalProviders;