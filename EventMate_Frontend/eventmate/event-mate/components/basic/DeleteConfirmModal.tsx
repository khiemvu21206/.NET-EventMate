import { BUTTON_COMMON_TYPE } from '@/constants/constant';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { ReactElement, useState } from 'react';
import Modal, { ModalProps } from '../basic/Modal';
import { useLanguage } from '@/providers/LanguageProvider';
import { Button } from '../common/button';



type DeleteConfirmModalProps = {
    onDeleteConfirm: () => Promise<void>;
    confirmText: string | ReactElement;
    modalProps: ModalProps;
};

const DeleteConfirmModal = ({
    modalProps,
    onDeleteConfirm,
    confirmText,
}: DeleteConfirmModalProps) => {
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
    const { t } = useLanguage();
    return (
        <Modal {...modalProps} widthMd="max-w-xl">
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    setLoadingSubmit(true);
                    await onDeleteConfirm();
                    setLoadingSubmit(false);
                    modalProps.closeModal();
                }}
                className="flex flex-col gap-2 items-start"
            >
                <div>{confirmText}</div>
                <div className="flex flex-col-reverse md:flex-row justify-between w-full mt-5">
                    <Button
                        className="w-full md:w-[45%] flex justify-center items-center mr-0 md:mr-2"
                        type="button"
                        label={t('commons:cancel')}
                        variant={BUTTON_COMMON_TYPE.CANCEL_BLACK}
                        onClickButton={modalProps.closeModal}
                    ></Button>
                    <Button
                        className="w-full md:w-[45%] flex items-center justify-center mb-2 md:mb-0"
                        color=""
                        type="submit"
                        disabled={loadingSubmit}
                        variant={BUTTON_COMMON_TYPE.DELETE_WITH_CHILDREN}
                        isLoading={loadingSubmit}
                    >
                        <TrashIcon className="h-6 w-6 mr-2" />
                        <div>{t('commons:yes-delete')}</div>
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default DeleteConfirmModal;
