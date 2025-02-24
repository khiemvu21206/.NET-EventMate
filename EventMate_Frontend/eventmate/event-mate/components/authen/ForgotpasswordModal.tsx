/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLanguage } from "@/providers/LanguageProvider";
import Modal, { ModalProps } from "../basic/Modal";
import Input from "../common/Input";
import { useState } from "react";
import { AuthRepository } from "@/repositories/AuthRepository";
import { Button } from "../common/button";

type ForgotpasswordModalProps = {

    modalProps: ModalProps;
};


const ForgotpasswordModal = ({
    modalProps
} : ForgotpasswordModalProps) => {
     const { t } = useLanguage();

     const [email, setEmail] = useState<string>("");
     const [loading, setLoading] = useState<boolean>(false);

     const handleForgotPassword = async () => {
      if(!email) return;
      setLoading(true);
      const res  = await AuthRepository.forgotPassword(email);
      if(!res.error){
      
        modalProps.closeModal();
      }
      setLoading(false);
     };

    return (
        <Modal {...modalProps} widthMd="max-w-xl">
        <div className="rounded-xl px-8 py-10 w-full max-w-md mx-4"
      >
        {/* Tiêu đề */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Enter Your Email Account</h2>

        <div className="relative" >
        
          <Input
            className=" !h-[44px] md:w-[400px] w-[350px] !rounded-xl pr-8"
            type="text"
            name="email"
            value={email}
            onChange={(e: any) => {
              setEmail(e.target.value);
            }}
            onKeyDown={(e: any) => {
              if (e.key === 'Enter') {
                handleForgotPassword();
              }
            }}
            placeholder={t('email-input')}

          />

           
          
        </div>
            <Button
                  className="w-full font-semibold text-white items-center justify-center"
                  label={t('payment:resume-your-plan')}
                  isLoading={loading}
                  onClickButton={handleForgotPassword}
                ></Button>
        
        


      </div>
        </Modal>
    );
};
export default ForgotpasswordModal;