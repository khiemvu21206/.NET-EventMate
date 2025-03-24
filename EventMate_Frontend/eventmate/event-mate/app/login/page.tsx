"use client";

import { useLanguage } from "@/providers/LanguageProvider";
import { toastHelper } from "@/ultilities/toastMessageHelper";
import { Button } from "@/components/common/button";
import ForgotpasswordModal from "@/components/authen/ForgotpasswordModal";
import Input from "@/components/common/Input";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import InputSecret from "@/components/common/InputSecret";
import { BUTTON_COMMON_TYPE } from "@/constants/constant";
import * as EmailValidator from "email-validator";

const Login = () => {
  const { t } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Quản lý trạng thái valid
  const [isPasslValid, setIsPassValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const { data, status } = useSession();
  // Kiểm tra password khi blur
  const handlePasswordBlur = (e: any) => {
    const value = e.target.value;
    if (value.trim().length === 0) {
      setIsPassValid(false);
    } else {
      setIsPassValid(true);
    }
  };

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.trim().length === 0) {
      setIsEmailValid(true);
      return;
    }
    const isValid = EmailValidator.validate(value);
    setIsEmailValid(isValid);
    if (!isValid) {
      toastHelper.error(t("errors:validate-email-failed"));
    }
  };

  const validateEmail = (email: string, isNotify: boolean = true) => {
    const isValid = EmailValidator.validate(email);
    if (!isValid && isNotify && email.length !== 0) {
      toastHelper.error(t("errors:validate-email-failed"));
    }
    return isValid;
  };

  const validateSubmit = () => {
    let isAllValid = true;
    if (!validateEmail(email, false)) {
      setIsEmailValid(false);
      toastHelper.error(t("errors:validate-email-failed"));
      isAllValid = false;
    } else {
      setIsEmailValid(true);
    }
    if (password.trim().length === 0) {
      setIsPassValid(false);
      toastHelper.error(t("errors:validate-password-required"));
      isAllValid = false;
    } else {
      setIsPassValid(true);
    }
    return isAllValid;
  };

  const handleLoginGoogle = async () => {
    const result = await signIn("google", { callbackUrl: "/home" });
    if (result?.error) {
      toastHelper.error(t(`authen:login-fail-${result.status}`));
    } else {
      toastHelper.success(t("authen:login-success"));
    }
  };

  const handleLogin = async () => {
    try {
      if (!validateSubmit()) return;
      setLoading(true);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        toastHelper.error(t(`authen:login-fail-${result.status}`));
      } else {
        console.log(data, status);
        toastHelper.success(t("authen:login-success"));
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const [isShowForgotPasswordModal, setIsShowForgotPasswordModal] = useState(false);

  return (
    <div
      className="flex items-center justify-center min-h-[calc(100vh-80px)]"
      style={{
        backgroundImage: "url('/images/designed-background.gif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >

      <div className="bg-gray-50 shadow-2xl rounded-lg px-10 py-12 w-full max-w-md mx-4">
        <div className="flex justify-center">
          <h2 className="text-3xl font-bold text-left text-gray-800 mb-8">
            {t("authen:login")}
          </h2>
        </div>
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              {t("authen:email")}
            </label>
            <Input
              className={`h-12 w-full rounded-lg pr-4 border ${isEmailValid
                ? "border-gray-300 focus:border-primary-500"
                : "border-red-500 focus:border-red-600"
                }`}
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              placeholder={t("authen:email-input")}
            />
            {!isEmailValid && (
              <p className="text-red-500 text-sm mt-1">
                {t("errors:validate-email-failed")}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              {t("authen:password")}
            </label>
            <InputSecret
              className={`h-12 w-full rounded-lg pr-4 border ${isPasslValid
                ? "border-gray-300 focus:border-primary-500"
                : "border-red-500 focus:border-red-600"
                }`}
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={handlePasswordBlur}
              placeholder={t("authen:password-input")}
            />
            {!isPasslValid && (
              <p className="text-red-500 text-sm mt-1">
                {t("errors:validate-password-required")}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => setIsShowForgotPasswordModal(true)}
          >
            {t("authen:forgot-password")}
          </button>
        </div>

        <Button
          className="mt-6 w-full font-semibold text-white"
          label={t("authen:login")}
          isLoading={loading}
          onClickButton={handleLogin}
        />

        <div className="text-center mt-6">
          <p className="text-gray-600 mt-1">
            {t("authen:no-account")}{" "}
            <a href="/signUp" className="text-blue-600 hover:underline font-medium">
              {t("authen:signup")}
            </a>
          </p>
        </div>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-gray-500">{t("authen:or-sign")}</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <Button
          className="w-full font-semibold text-white"
          label={t("authen:login-google")}
          variant={BUTTON_COMMON_TYPE.GOOGLE}
          isLoading={loading}
          onClickButton={handleLoginGoogle}
        />

        {isShowForgotPasswordModal && (
          <ForgotpasswordModal
            modalProps={{
              isOpen: isShowForgotPasswordModal,
              closeModal: () => setIsShowForgotPasswordModal(false),
              title: "Forgot Password",
              children: <div>{t("authen:forgot-password")}</div>,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Login;
