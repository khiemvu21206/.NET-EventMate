"use client";


import { motion } from "framer-motion"; // Import thư viện animation
import { SiGoogle } from "react-icons/si";
import { Button } from "@/components/common/button";
import { useLanguage } from "@/providers/LanguageProvider";
import Input from "@/components/common/Input";
import { useState } from "react";
import { signIn } from "next-auth/react";
import ForgotpasswordModal from "@/components/authen/ForgotpasswordModal";

export default function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const handleLogin = async () => {
  try{
 const result = await signIn("credentials", { email, password, redirect: false });
  console.log(result);
  }catch(error){
    console.log(error);
  }
 
}
const [isShowForgotPasswordModal, setIsShowForgotPasswordModal] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
    >

      {/* Container chính với hiệu ứng scale */}
      <div
        className="bg-white/80 backdrop-blur-lg shadow-xl rounded-xl px-8 py-10 w-full max-w-md mx-4"
      >
        {/* Tiêu đề */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>

        {/* Form đăng nhập */}
        {/* Input Email */}
        <div className="relative" >
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <Input
            className=" !h-[44px] md:w-[400px] w-[350px] !rounded-xl pr-8"
            type="text"
            name="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
            }}
            placeholder={t('email-input')}
          />
           <label className="block mb-1 font-medium text-gray-700">Password</label>
          <Input
            className=" !h-[44px] md:w-[400px] w-[350px] !rounded-xl pr-8"
            type="text"
            name="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
            placeholder={t('password-input')}
          />
          
        </div>
        {/* Ghi nhớ + Quên mật khẩu */}
        <div className="flex items-center justify-between text-sm"
        onClick={() => setIsShowForgotPasswordModal(true)}>
        
            Forgot Password?
          

        </div>

        <Button
          className="w-full font-semibold transition-all text-white"
          label={t('payment:resume-your-plan')}
          isLoading={false}
          onClickButton={handleLogin}
        ></Button>
        {/* Đăng ký */}
        <div className="text-center mt-4">
          <p className="text-gray-600">Dont have an account?
          </p>
          <p className="text-gray-600">
            <a
              href="#"
              className="relative text-blue-600 font-medium transition-all duration-300
             before:absolute before:-bottom-1 before:left-1/2 before:w-0 before:h-[2px] 
             before:bg-blue-600 before:transition-all before:duration-300 
             hover:text-blue-700 hover:before:w-full hover:before:left-0 
             hover:scale-105"
            >
              Sign Up {" "}
            </a>
            Or{" "}
            <a
              href="#"
              className="relative text-blue-600 font-medium transition-all duration-300
             before:absolute before:-bottom-1 before:left-1/2 before:w-0 before:h-[2px] 
             before:bg-blue-600 before:transition-all before:duration-300 
             hover:text-blue-700 hover:before:w-full hover:before:left-0 
             hover:scale-105"
            >
              Sign up As Event Organizer
            </a>

          </p>
        </div>

        {/* Hoặc đăng nhập với mạng xã hội */}
        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-500">Or Sign In With</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Nút mạng xã hội */}
        <div className="flex justify-center space-x-4">
          {/* Nút Gmail */}
          <motion.a
            href="#"
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0px 4px 10px rgba(255, 0, 0, 0.3)" }}
          >
            <SiGoogle className="w-5 h-5" />
            <span>Google</span>
          </motion.a>
        </div>
        {isShowForgotPasswordModal && (
          <ForgotpasswordModal
            modalProps={{
              isOpen: isShowForgotPasswordModal,
              closeModal: () => setIsShowForgotPasswordModal(false),
              title: 'Forgot Password',
              children: <div>Forgot Password</div>
            }}
          />
        )}
      
      
         {/* <ConfirmModal
                title={t('chat:delete-avatar-confirm-title')}
                description={t('chat:delete-avatar-confirm-text')}
                closeModal={() => {
                   
                }}
                isOpen={true}
                okContent={t('chat:delete-avatar-confirm-button')}
                onOK={() => {
                   
                }}
                cancelContent={t('chat:delete-avatar-cancel-button')}
            /> */}
      </div>
    </div>
  );
}
