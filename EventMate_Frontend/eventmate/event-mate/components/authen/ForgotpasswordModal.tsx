/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLanguage } from "@/providers/LanguageProvider";
import Modal, { ModalProps } from "../basic/Modal";
import Input from "../common/Input";
import { useState } from "react";
import { AuthRepository } from "@/repositories/AuthRepository";
import { Button } from "../common/button";
import EmailValidator from "email-validator";
import { toastHelper } from "@/ultilities/toastMessageHelper";

type ForgotPasswordModalProps = {
  modalProps: ModalProps;
};

const ForgotPasswordModal = ({ modalProps }: ForgotPasswordModalProps) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);

  // Xử lý validate email khi blur
  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.trim().length === 0) {
      setIsEmailValid(true);
      return;
    }
    const valid = EmailValidator.validate(value);
    setIsEmailValid(valid);
    if (!valid) {
      toastHelper.error(t("errors:validate-email-failed"));
    }
  };

  const handleForgotPassword = async () => {
    // Kiểm tra email có hợp lệ hay không trước khi submit
    if (!email || !isEmailValid) {
      toastHelper.error(t("errors:validate-email-failed"));
      return;
    }
    setLoading(true);
    const res = await AuthRepository.forgotPassword(email);
    if (!res.error) {
      modalProps.closeModal();
      // Bạn có thể thêm thông báo thành công ở đây nếu cần
    } else {
      toastHelper.error(t("authen:reset-password-fail"));
    }
    setLoading(false);
  };

  return (
    <Modal {...modalProps} widthMd="max-w-xl md:max-w-2xl">
      <div className="bg-white rounded-xl p-8 w-full mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
        {t("authen:enter-your-email-to-reset-password")}
        </h2>
        <div className="mb-4">
          <Input
            className="h-12 w-full rounded-lg border border-gray-300 focus:border-primary-500 px-4"
            type="email"
            name="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            onBlur={handleEmailBlur}
            placeholder={t("authen:email-input")}
          />
          {!isEmailValid && (
            <p className="text-red-500 text-sm mt-1">
              {t("errors:validate-email-failed")}
            </p>
          )}
        </div>
        <Button
          className="w-full font-semibold text-white py-3"
          label={t("authen:reset-password")}
          isLoading={loading}
          onClickButton={handleForgotPassword}
        />
      </div>
    </Modal>
  );
};

export default ForgotPasswordModal;
