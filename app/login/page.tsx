"use client";

// import { AuthRepository } from "@/repositories/AuthRepository";
import { useLanguage } from "@/providers/LanguageProvider";
import { toastHelper } from "@/ultilities/toastMessageHelper";
import { Button } from "@/components/common/button";
import ForgotpasswordModal from "@/components/authen/ForgotpasswordModal";
import Input from "@/components/common/Input";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import InputSecret from "@/components/common/InputSecret";
import { BUTTON_COMMON_TYPE } from "@/constants/constant";
import * as EmailValidator from 'email-validator';
const Login = () => {
  const { t } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string, isNotify: boolean = true) => {
    if (!EmailValidator.validate(email)) {
      if (isNotify && email.length != 0) {
        toastHelper.error(t('errors:validate-email-failed'));
      }
      return false;
    }
    return true;
  };
  const validateSubmit = () => {
    let checkSubmit = false;
    if (validateEmail(email)) {
    checkSubmit = true
    }
    if (password.length > 0) {
    
     checkSubmit = true
    }else{
        toastHelper.error(t('errors:validate-password-required'));
    }
    return checkSubmit;
  };
  const handleLoginGoogle = async () => {

    const result = await signIn("google", { callbackUrl: "/" });
    if (result?.error) {
      toastHelper.error(t(`authen:login-fail-${result.status}`));
    } else {
      toastHelper.success(t('authen:login-success'));

    }
  }
  const handleLogin = async () => {
    try {
      if(!validateSubmit()) return;
      setLoading(true);
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        toastHelper.error(t(`authen:login-fail-${result.status}`));
      } else {
        toastHelper.success(t('authen:login-success'));
        router.push('/');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
          <InputSecret
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
          className="w-full font-semibold text-white items-center justify-center"
          label={t('payment:resume-your-plan')}
          isLoading={loading}
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

          <Button
            className="w-full font-semibold text-white items-center justify-center"
            label={t('payment:resume-your-plan')}
            variant={BUTTON_COMMON_TYPE.GOOGLE}
            isLoading={loading}
            onClickButton={handleLoginGoogle}
          ></Button>
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
      </div>
    </div>
  );
}

export default Login;