"use client";
import { useEffect, useRef, useState } from "react";
import EmailValidator from "email-validator";

import { toastHelper } from "@/ultilities/toastMessageHelper";
import { validatePassword } from "@/lib/helpers";
import { useLanguage } from "@/providers/LanguageProvider";
import { AuthRepository } from "@/repositories/AuthRepository";
import CheckOTPModal from "@/components/authen/CheckOTPModal";
import Input from "@/components/common/Input";
import InputSecret from "@/components/common/InputSecret";
import { Button } from "@/components/common/button";
import { BUTTON_COMMON_TYPE } from "@/constants/constant";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import TermsModal from "@/components/authen/TermModal";

interface SignUpOrganizationComponentProps {
  setIsSignUpOrganization: (value: boolean) => void;
}

const SignUpOrganizationComponent = ({
  setIsSignUpOrganization,
}: SignUpOrganizationComponentProps) => {
  const { t } = useLanguage();

  // Các trường thông tin
  const [email, setEmail] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(true);
  const [isCompanyValid, setIsCompanyValid] = useState<boolean>(true);
  const [isAddressValid, setIsAddressValid] = useState<boolean>(true);
  const [businessLicense, setBusinessLicense] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [agree, setAgree] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowCheckOTPModal, setIsShowCheckOTPModal] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");

  // Kiểm tra mật khẩu (độ dài, chữ hoa, số, ký tự đặc biệt, khớp)
  const [checks, setChecks] = useState<{ [key: string]: boolean }>({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
    match: false,
  });

  useEffect(() => {
    setChecks(validatePassword(password, confirmPassword));
  }, [password, confirmPassword]);

  // Xác định lỗi cho password & confirm password
  const passwordError =
    password !== "" &&
    (!checks.length || !checks.uppercase || !checks.number || !checks.specialChar);
  const confirmPasswordError = confirmPassword !== "" && !checks.match;

  // Validate email
  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value.trim()) {
      setIsEmailValid(true);
      return;
    }
    const valid = EmailValidator.validate(value);
    setIsEmailValid(valid);
  };

  // Validate phone number: chỉ chấp nhận số với 10-15 chữ số
  const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value.trim()) {
      setIsPhoneValid(false);
      return;
    }
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(value)) {
      setIsPhoneValid(false);
    } else {
      setIsPhoneValid(true);
    }
  };

  // Validate Company: không được để trống
  const handleCompanyBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value.trim()) {
      setIsCompanyValid(false);
    } else {
      setIsCompanyValid(true);
    }
  };

  // Validate Address: không được để trống
  const handleAddressBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value.trim()) {
      setIsAddressValid(false);
    } else {
      setIsAddressValid(true);
    }
  };

  // Form hợp lệ khi tất cả các điều kiện đều đáp ứng
  const isFormValid =
    !!email &&
    isEmailValid &&
    Object.values(checks).every(Boolean) &&
    !!companyName &&
    isCompanyValid &&
    !!phoneNumber &&
    isPhoneValid &&
    !!address &&
    isAddressValid &&
    !!businessLicense &&
    agree;

  // Xử lý chọn file thông qua Button
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleChooseFile = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Kiểm tra loại file: chỉ cho phép ảnh hoặc PDF
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        return;
      }
      setBusinessLicense(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  // Xử lý đăng ký: sử dụng hàm tạo OTP
  const handleSignUp = async () => {
    if (!isFormValid) {
      toastHelper.error(t("authen:please-complete-all-fields"));
      return;
    }
    try {
      setLoading(true);
      const res = await AuthRepository.createOTP(email, password);

      if (!res.error) {
        setToken(res.data);
        setIsShowCheckOTPModal(true);
      } else {
        toastHelper.error(t("authen:signup-failed"));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="bg-gray-50 shadow-2xl rounded-lg px-6 py-8 w-full max-w-4xl mx-2">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {t("authen:event-signup")}
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Hàng 1: Email & Company Name */}
            <div className="mb-2">
              <label className="block mb-1 font-medium text-gray-700">
                {t("authen:email")}
              </label>
              <Input
                className={`h-10 w-full rounded-lg pr-3 border ${!isEmailValid ? "border-red-500" : "border-gray-300"
                  } focus:border-primary-500`}
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                placeholder={t("authen:email-input")}
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1 font-medium text-gray-700">
                {t("authen:company-name")}
              </label>
              <Input
                className={`h-10 w-full rounded-lg pr-3 border ${!isCompanyValid ? "border-red-500" : "border-gray-300"
                  } focus:border-primary-500`}
                type="text"
                name="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onBlur={handleCompanyBlur}
                placeholder={t("authen:company-input")}
              />
            </div>

            {/* Hàng 2: Password & Phone Number */}
            <div className="mb-2">
              <label className="block mb-1 font-medium text-gray-700">
                {t("authen:new-pass")}
              </label>
              <InputSecret
                className={`h-10 w-full rounded-lg pr-3 border ${passwordError ? "border-red-500" : "border-gray-300"
                  } focus:border-primary-500`}
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("authen:password-input")}
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1 font-medium text-gray-700">
                {t("authen:phone-number")}
              </label>
              <Input
                className={`h-10 w-full rounded-lg pr-3 border ${!isPhoneValid ? "border-red-500" : "border-gray-300"
                  } focus:border-primary-500`}
                type="text"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onBlur={handlePhoneBlur}
                placeholder={t("authen:phone-input")}
              />
            </div>

            {/* Hàng 3: Confirm Password & Address */}
            <div className="mb-2">
              <label className="block mb-1 font-medium text-gray-700">
                {t("authen:confirm-pass")}
              </label>
              <InputSecret
                className={`h-10 w-full rounded-lg pr-3 border ${confirmPasswordError ? "border-red-500" : "border-gray-300"
                  } focus:border-primary-500`}
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("authen:password-input")}
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1 font-medium text-gray-700">
                {t("authen:address")}
              </label>
              <Input
                className={`h-10 w-full rounded-lg pr-3 border ${!isAddressValid ? "border-red-500" : "border-gray-300"
                  } focus:border-primary-500`}
                type="text"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onBlur={handleAddressBlur}
                placeholder={t("authen:address-input")}
              />
            </div>

            {/* Hàng 4: Business License (chiếm 2 cột) */}
            <div className="mb-2 col-span-2">
              <label className="block mb-1 font-medium text-gray-700">
                {t("authen:license")}
              </label>
              <div className="flex items-center space-x-3">
                <Button
                  label={t("authen:choose-file")}
                  variant={BUTTON_COMMON_TYPE.PRIMARY}
                  onClickButton={handleChooseFile}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/png, image/jpeg, image/gif"
                />
              </div>
              {filePreview && (
                <div className="mt-2">
                  {businessLicense?.type.startsWith("image/") ? (
                    <img
                      src={filePreview}
                      alt="File Preview"
                      className="w-full max-h-60 object-contain border"
                    />
                  ) : businessLicense?.type === "application/pdf" ? (
                    <embed
                      src={filePreview}
                      type="application/pdf"
                      className="w-full h-60 border"
                    />
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Checklist validate mật khẩu */}
          <ul
            className={`mt-2 mb-2 space-y-1 border ${Object.values(checks).every(Boolean) ? "border-green-500" : "border-red-500"
              } p-2 rounded-lg`}
          >
            {[
              { key: "length", message: t("authen:password-validation:length") },
              { key: "uppercase", message: t("authen:password-validation:uppercase") },
              { key: "number", message: t("authen:password-validation:number") },
              { key: "specialChar", message: t("authen:password-validation:specialChar") },
              { key: "match", message: t("authen:password-validation:match") },
            ].map((item) => (
              <li
                key={item.key}
                className="flex items-center text-sm"
                style={{ color: checks[item.key] ? "green" : "red" }}
              >
                {checks[item.key] ? (
                  <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
                ) : (
                  <XCircleIcon className="w-5 h-5 mr-2 text-red-500" />
                )}
                {item.message}
              </li>
            ))}
          </ul>

          {/* Checkbox Terms và Nút Sign Up */}
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="agree" className="text-gray-700 text-sm cursor-pointer">
                {t("authen:agree-to")}{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:underline font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTermsModal(true);
                  }}
                >
                  {t("authen:term")}
                </a>
              </label>
            </div>
            {showTermsModal && (
              <TermsModal
                modalProps={{
                  isOpen: showTermsModal,
                  closeModal: () => setShowTermsModal(false),
                  title: t("authen:terms-title"),
                }}
              />
            )}
            <Button
              className="w-full font-semibold text-white py-2"
              label={t("authen:continue")}
              disabled={!isFormValid}
              isLoading={loading}
              onClickButton={handleSignUp}
            />
            <div className="text-center">
              <p
                className="text-gray-600 cursor-pointer"
                onClick={() => setIsSignUpOrganization(false)}
              >
                <a className="text-blue-600 hover:underline font-medium">
                  {t("authen:or-sign-up-normal")}
                </a>
              </p>
            </div>
            <div className="text-center mt-2">
              <p className="text-gray-600">
                {t("authen:already-have-account")}{" "}
                <a href="/login" className="text-blue-600 hover:underline font-medium">
                  {t("authen:login")}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <CheckOTPModal
        email={email}
        token={token}
        companyName={companyName}
        phoneNumber={phoneNumber}
        address={address}
        businessLicense={businessLicense || null}
        setToken={setToken}
        modalProps={{
          isOpen: isShowCheckOTPModal,
          closeModal: () => setIsShowCheckOTPModal(false),
          title: t("authen:otp-title"),
        }}
      />

      {/* Terms Modal */}
      <TermsModal
        modalProps={{
          isOpen: showTermsModal,
          closeModal: () => setShowTermsModal(false),
          title: t("authen:terms-title"),
        }}
      />
    </div>
  );
};

export default SignUpOrganizationComponent;
