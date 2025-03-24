"use client";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/common/button";
import InputSecret from "@/components/common/InputSecret";
import { validatePassword } from "@/lib/helpers";
import { useLanguage } from "@/providers/LanguageProvider";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { useUserContext } from "@/providers/UserProvider";
import { AuthRepository } from "@/repositories/AuthRepository"; 

interface ChangePasswordModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const ChangePasswordModal = ({ isOpen, closeModal }: ChangePasswordModalProps) => {
  const { t } = useLanguage();
  const { token } = useUserContext();
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [checks, setChecks] = useState<{ [key: string]: boolean }>({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
    match: false,
  });

  useEffect(() => {
    setChecks(validatePassword(newPassword, confirmPassword));
  }, [newPassword, confirmPassword]);

  const newPasswordError =
    newPassword !== "" &&
    (!checks.length || !checks.uppercase || !checks.number || !checks.specialChar);
  const confirmPasswordError = confirmPassword !== "" && !checks.match;
  const isFormValid = Object.values(checks).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !token) {
      if (!token) toast.error("Authentication token is missing");
      return;
    }

    setLoading(true);
    try {
      const response = await AuthRepository.changePassword(oldPassword, newPassword, token);

      if (response.status === 200) {
        toast.success(response.data.message);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        closeModal();
      } else {
        switch (response.status) {
          case 400:
            toast.error(response.data.message );
            break;
          case 404:
            toast.error(response.data.message);
            break;
          case 500:
            toast.error(response.data.message);
            break;
          default:
            toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-50 shadow-2xl rounded-lg px-10 py-12 w-full max-w-md mx-4 relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Old Password
            </label>
            <InputSecret
              className="h-12 w-full rounded-lg pr-4 border focus:border-primary-500"
              type="password"
              name="oldPassword"
              value={oldPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setOldPassword(e.target.value)
              }
              placeholder={t("authen:old-pass")}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              New Password
            </label>
            <InputSecret
              className={`h-12 w-full rounded-lg pr-4 border ${
                newPasswordError ? "border-red-500" : "border-gray-300"
              } focus:border-primary-500`}
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPassword(e.target.value)
              }
              placeholder={t("authen:new-pass")}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Confirm Password
            </label>
            <InputSecret
              className={`h-12 w-full rounded-lg pr-4 border ${
                confirmPasswordError ? "border-red-500" : "border-gray-300"
              } focus:border-primary-500`}
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              placeholder={t("authen:confirm-pass")}
            />
          </div>

          <ul
            className={`mt-4 mb-4 space-y-1 border ${
              Object.values(checks).every(Boolean)
                ? "border-green-500"
                : "border-red-500"
            } p-4 rounded-lg`}
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

          <Button
            type="submit"
            className="w-full font-semibold text-white py-3"
            label={t("authen:continue") || "Continue"}
            disabled={!isFormValid || loading}
            isLoading={loading}
          />
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ChangePasswordModal;