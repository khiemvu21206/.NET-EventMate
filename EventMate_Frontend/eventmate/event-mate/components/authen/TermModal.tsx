"use client";

import Modal, { ModalProps } from "../basic/Modal";
import { useLanguage } from "@/providers/LanguageProvider";

type TermsModalProps = {
    modalProps: ModalProps;
};

export default function TermsModal({ modalProps }: TermsModalProps) {
    const { t } = useLanguage();

    return (
        <Modal {...modalProps} widthMd="max-w-xl md:max-w-2xl">
            <div className="rounded-xl px-6 py-6 w-full bg-white shadow-lg h-[500px] overflow-auto">
                <h2 className="text-xl font-semibold text-center text-gray-900">
                    {t("authen:terms-title") || "Terms and Conditions"}
                </h2>
                <div className="text-gray-700 text-sm space-y-4 mt-4 max-h-60 overflow-y-auto p-4 border border-gray-300 rounded-md bg-white">
                    <p>By using this service, you agree to the following terms...</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at nisl nec...</p>
                    <p>We reserve the right to modify these terms at any time...</p>
                    <p>More terms and conditions details here...</p>
                </div>
            </div>
        </Modal>
    );
}
