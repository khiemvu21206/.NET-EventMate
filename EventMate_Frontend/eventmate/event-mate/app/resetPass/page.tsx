"use client";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/common/button";
import InputSecret from "@/components/common/InputSecret";
import { validatePassword } from "@/lib/helpers";
import { useLanguage } from "@/providers/LanguageProvider";
import { AuthRepository } from "@/repositories/AuthRepository";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const RestPasswordPage = () => {
  const { t } = useLanguage();
  const router = useRouter();


  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [checks, setChecks] = useState<{ [key: string]: boolean }>({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
    match: false
  });
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setToken(params.get("token"));
    }
  }, []);
  useEffect(() => {
    setChecks(validatePassword(newPassword, confirmPassword));
  }, [newPassword, confirmPassword]);

  // Xác định lỗi cho từng ô input secret
  const newPasswordError =
    newPassword !== "" &&
    (!checks.length || !checks.uppercase || !checks.number || !checks.specialChar);
  const confirmPasswordError =
    confirmPassword !== "" && !checks.match;

  const handleReset = async () => {
    console.log("ok")
    try {
      setLoading(true);
      const res = await AuthRepository.resetPassword(newPassword, token || '');
      if (!res.error) {
        router.push('/login');
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // Form hợp lệ khi tất cả các tiêu chí mật khẩu đều đạt
  const isFormValid = Object.values(checks).every(Boolean);

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
        {/* Tiêu đề */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">New Password</label>
            <InputSecret
              className={`h-12 w-full rounded-lg pr-4 border ${
                newPasswordError ? "border-red-500" : "border-gray-300"
              } focus:border-primary-500`}
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
              placeholder={t('authen:new-pass')}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
            <InputSecret
              className={`h-12 w-full rounded-lg pr-4 border ${
                confirmPasswordError ? "border-red-500" : "border-gray-300"
              } focus:border-primary-500`}
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              placeholder={t('authen:confirm-pass')}
            />
          </div>
        </div>

        {/* Danh sách kiểm tra mật khẩu */}
        <ul className={`mt-4 mb-4 space-y-1 border ${
          Object.values(checks).every(Boolean) ? "border-green-500" : "border-red-500"
        } p-4 rounded-lg`}>
          {[
            { key: "length", message: t('authen:password-validation:length') || "At least 8 characters" },
            { key: "uppercase", message: t('authen:password-validation:uppercase') || "At least one uppercase letter" },
            { key: "number", message: t('authen:password-validation:number') || "At least one number" },
            { key: "specialChar", message: t('authen:password-validation:specialChar') || "At least one special character" },
            { key: "match", message: t('authen:password-validation:match') || "Passwords must match" }
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

        <Button
          className="w-full font-semibold text-white py-3"
          label={t('authen:continue') || "Continue"}
          disabled={!isFormValid}
          isLoading={loading}
          onClickButton={handleReset}
        />
      </div>
    </div>
  );
};

export default RestPasswordPage;