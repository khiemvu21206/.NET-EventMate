/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Modal, { ModalProps } from "../basic/Modal";
import Input from "../common/Input";
import { useLanguage } from "@/providers/LanguageProvider";
import { Button } from "../common/button";
import { AuthRepository } from "@/repositories/AuthRepository";
import { useRouter } from "next/navigation";
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon';

type CheckOTPModalProps = {
    email: string;
    token: string;
    modalProps: ModalProps;
    setToken: (token: string) => void;
}

const CheckOTPModal = ({
    email,
    token,
    setToken,
    modalProps,
}: CheckOTPModalProps) => {
    const { t } = useLanguage();
    const router = useRouter();

    const [otp, setOTP] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingResend, setLoadingResend] = useState<boolean>(false);
    const handleCheckOTP = async () => {
        setLoading(true);
        try {
            const res = await AuthRepository.verifyOTP(token, otp);
            if (!res.error) {
                router.push('/login');
                modalProps.closeModal();
                setToken('');
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
        setLoading(false);
    };
    const handleResendOTP = async () => {
        try {
            setLoadingResend(true);
            const res = await AuthRepository.createOTP(email, token);
            if (!res.error) {
                setToken(res.data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoadingResend(false);
        }
    };
    return (
        <Modal {...modalProps} widthMd="max-w-xl">
            <div className="rounded-xl px-8 py-10 w-full max-w-md mx-4"
            >
                {/* Tiêu đề */}
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{t("authen:otp-input-lable")}</h2>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{email}</h2>

                <div className="relative" >

                    <Input
                        className=" !h-[44px] md:w-[400px] w-[350px] !rounded-xl pr-8"
                        type="text"
                        name="email"
                        value={otp}
                        onChange={(e: any) => {
                            setOTP(e.target.value);
                        }}
                        onKeyDown={(e: any) => {
                            if (e.key === 'Enter') {
                                handleCheckOTP();
                            }
                        }}
                        placeholder={t('authen:otp-input-placeholder')}

                    />
                </div>

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{t("authen:otp-note")}</h2>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{t("authen:otp-missing")}</h2>
                {loadingResend ?
                    <div className="loading-btn">
                        <ArrowPathIcon className="w-6 h-6 ml-2 animate-spin" />
                    </div>
                    :
                    <p
                        onClick={handleResendOTP}
                    >{t("authen:resend-otp")}</p>
                }
                <Button
                    className="w-full font-semibold text-white items-center justify-center"
                    label={t('authen:continue')}
                    isLoading={loading}
                    onClickButton={handleCheckOTP}
                ></Button>




            </div>
        </Modal>
    );
}
export default CheckOTPModal;