import Modal, { ModalProps } from '@/components/basic/Modal';
import { BUTTON_COMMON_TYPE } from '@/constants/constant';
import classNames from '@/ultilities/common/classNames';
import { useState } from 'react';
import { Button } from '../common/button';

interface IConfirmModalProps extends ModalProps {
    description?: string;
    onOK?: () => void;
    onCancel?: () => void;
    okContent?: React.ReactNode;
    cancelContent?: React.ReactNode;
    // checkbox props
    checkboxLabel?: string;
    checkboxCallback?: (checked: boolean) => void;
}

const ConfirmModal = ({
    description,
    onOK,
    onCancel,
    okContent = 'Yes',
    cancelContent = 'Cancel',
    checkboxLabel,
    checkboxCallback,
    ...modelProps
}: IConfirmModalProps) => {
    const [checkedDontShowConfirm, setCheckedDontShowConfirm] = useState<boolean>(false);

    const handleConfirm = () => {
        onOK?.();
        checkboxCallback?.(checkedDontShowConfirm);
        modelProps.closeModal();
    };

    return (
        <Modal {...modelProps} widthMd="max-w-xl">
            <div className="flex flex-col gap-2 items-start">
                <div
                    className={classNames(
                        'text-[var(--color-description)] whitespace-pre-line',
                        checkboxLabel ? 'mb-2' : 'mb-4'
                    )}
                >
                    {description}
                </div>
                {checkboxLabel && (
                    <div className="flex gap-2 items-center mb-2">
                        <input
                            id={`checkbox-confirm-${checkboxLabel}`}
                            className="cursor-pointer"
                            type="checkbox"
                            onChange={(e) => setCheckedDontShowConfirm(e.target.checked)}
                        />
                        <label
                            className="cursor-pointer text-sm text-[var(--color-description)]"
                            htmlFor={`checkbox-confirm-${checkboxLabel}`}
                        >
                            {checkboxLabel}
                        </label>
                    </div>
                )}
                <div className="flex flex-col-reverse md:flex-row justify-between w-full mt-3">
                    <Button
                        className="w-full md:w-[45%] flex items-center justify-center"
                        type="button"
                        label={cancelContent}
                        variant={BUTTON_COMMON_TYPE.CANCEL_BLACK}
                        onClickButton={() => {
                            onCancel?.();
                            modelProps.closeModal();
                        }}
                    />

                    <Button
                        className="w-full md:w-[45%] flex items-center justify-center  mb-2 md:mb-0"
                        color=""
                        type="submit"
                        data-testid="confirm-button"
                        variant={BUTTON_COMMON_TYPE.DELETE_WITH_CHILDREN}
                        onClickButton={handleConfirm}
                    >
                        {okContent}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
