import { Fragment, ReactNode, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import ArrowSmallLeftIcon from '@heroicons/react/24/outline/ArrowSmallLeftIcon';
import classNames from '@/ultilities/common/classNames';
import React from 'react';

export type ModalProps = {
    titleIcon?: ReactNode;
    title: ReactNode;
    titleClass?: string;
    isAutoClose?: boolean;
    isOpen: boolean;
    closeModal: () => void;
    children?: ReactNode;
    onSuccess?: (data?: unknown) => void;
    widthMd?: string;
    classMore?: string;
    styleMore?: React.CSSProperties;
    mobileStyle?: string;
    buttonOnHeader?: ReactNode;
    buttonNextToTitle?: ReactNode;
    arrowBack?: boolean;
    arrowCallback?: () => void;
    isOverFlowY?: boolean;
    disabledAutoPadding?: boolean;
    disableCloseButton?: boolean;
    preventMainComponent?: boolean;
    modalContainerRef?: React.RefObject<HTMLDivElement>;
};

const Modal = ({
    closeModal,
    isOpen,
    title,
    titleClass,
    children,
    classMore,
    styleMore,
    buttonOnHeader,
    buttonNextToTitle,
    arrowCallback,
    isAutoClose = true,
    isOverFlowY = false,
    arrowBack = false,
    widthMd = 'max-w-screen-xl',
    titleIcon,
    disabledAutoPadding,
    disableCloseButton,
    preventMainComponent = true,
    modalContainerRef,
}: ModalProps) => {
    const autoPadding = !disabledAutoPadding;

    useEffect(() => {
        // Remove aria-hidden and inert attributes from the global provider element
        if (!preventMainComponent) {
            const rootElement = document.getElementById('global-providers');
            rootElement?.removeAttribute('aria-hidden');
            rootElement?.removeAttribute('inert');
        }
    }, [isOpen, preventMainComponent]);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className={`relative z-[10000]`}
                onClose={isAutoClose ? closeModal : () => {}}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    {preventMainComponent ? (
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    ) : (
                        <div></div>
                    )}
                </Transition.Child>

                <div
                    ref={modalContainerRef}
                    className={`fixed inset-0 overflow-y-auto ${
                        !preventMainComponent ? 'pointer-events-none' : 'pointer-events-auto'
                    }`}
                >
                    <div
                        className={`flex items-center justify-center p-4 text-center ${
                            !isOverFlowY ? 'min-h-full' : 'h-[90%]'
                        } ${!preventMainComponent ? 'pointer-events-none' : 'pointer-events-auto'}`}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                style={styleMore || {}}
                                className={`modal-common ${classMore} w-full max-w-screen-xl ${widthMd} transform overflow-hidden rounded-2xl bg-bglight dark:bg-bgdark dark:text-white  text-left z-[99999] align-middle shadow-xl transition-all flex flex-col items-start pointer-events-auto ${
                                    autoPadding ? 'p-4 md:p-5 gap-4' : ''
                                }`}
                            >
                                {title !== '' && (
                                    <Dialog.Title
                                        as="h3"
                                        className={classNames(
                                            'w-full text-lg font-medium leading-6 flex justify-between items-center',
                                            !autoPadding && 'px-5 py-4'
                                        )}
                                    >
                                        <div
                                            className={`flex flex-row gap-4  ${
                                                buttonOnHeader ? 'max-w-[70%]' : 'max-w-[90%]'
                                            } items-center`}
                                        >
                                            {arrowBack && (
                                                <ArrowSmallLeftIcon
                                                    onClick={arrowCallback && arrowCallback}
                                                    className="w-6 h-6 cursor-pointer min-w-[30px]"
                                                />
                                            )}
                                            {titleIcon && <>{titleIcon}</>}
                                            <div className={classNames('truncate', titleClass)}>
                                                {title}
                                            </div>
                                            {buttonNextToTitle && buttonNextToTitle}
                                        </div>
                                        <div className="flex flex-row gap-4 min-w-[24px]">
                                            {buttonOnHeader && buttonOnHeader}
                                            <button
                                                className={classNames(
                                                    'cursor-pointer',
                                                    disableCloseButton && 'hidden'
                                                )}
                                                onClick={closeModal}
                                            >
                                                <XMarkIcon className="h-6 w-6 hover:stroke-primary-500" />
                                            </button>
                                        </div>
                                    </Dialog.Title>
                                )}
                                <div
                                    className="w-full modal-common-content grow flex-1"
                                    style={{ wordBreak: 'break-word' }}
                                >
                                    {children}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
export default Modal;
