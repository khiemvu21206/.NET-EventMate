'@typescript-eslint/no-empty-object-type'
import ToastMessage from '@/components/generator/ToastMessage';
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from '@/public';
import {  TypeOptions, ToastOptions } from "react-toastify";
import { toast } from "react-toastify";

/** Functions for configurations */
const DEFAULT_AUTO_CLOSE_SHORT_TEXT = 3000;
const DEFAULT_AUTO_CLOSE_LONG_TEXT = 5000;

const countWords = (str: string) => {
    // Use a regular expression to match words
    const words = str.match(/\b\w+\b/g);
    return words ? words.length : 0;
};

const getAutoCloseTime = (msg: string) => {
    const numOfWords = countWords(msg);

    return numOfWords <= 5 ? DEFAULT_AUTO_CLOSE_SHORT_TEXT : DEFAULT_AUTO_CLOSE_LONG_TEXT;
};

const mappingTypeToIcon: { [key in TypeOptions]: React.ReactElement } = {
    warning: <WarningIcon />,
    success: <SuccessIcon />,
    info: <InfoIcon />,
    error: <ErrorIcon />,
    default: <InfoIcon />,
};

const getIconByType = (type: TypeOptions): React.ReactElement => {
    return mappingTypeToIcon[type];
};

/** Global variables */
let currentToastId: number | string = '';
const setCurrentToastId = (id: number | string) => {
    currentToastId = id;
};

let currentMessage: string = '';
const setCurrentMessage = (msg: string) => {
    currentMessage = msg;
};

let numOfSameMessage: number = 0;
const setNumOfSameMessage = (num: number) => {
    numOfSameMessage = num;
};

/** Functions for showing the toast */
const getHandledMessage = (newMsg: string) => {
    // If the same message is repeated, whe should show the number of repeat
    if (newMsg === currentMessage) {
        setNumOfSameMessage(numOfSameMessage + 1);

        return `${newMsg} (${numOfSameMessage} times)`;
    }

    setCurrentMessage(newMsg);
    setNumOfSameMessage(1);

    return newMsg;
};

const handleCloseToast = () => {
    setCurrentToastId('');
    setCurrentMessage('');
    setNumOfSameMessage(0);
  
};


const openToastMessage = (
    message: string,
    type: TypeOptions,
    options?: ToastOptions<object>
) => {
    const autoClose = options?.autoClose || getAutoCloseTime(message);
    const handledMessage = getHandledMessage(message);
   
    // Hiển thị toast mới
    const id = toast(<ToastMessage message={handledMessage} />, {
        ...options,
        type,
        autoClose,
        onClose: (handleCloseToast),
    });

    setCurrentToastId(id);
};

const showToast = (message: string, type: TypeOptions, options?: ToastOptions) => {
    toast.clearWaitingQueue();
   
    const autoClose = options?.autoClose || getAutoCloseTime(message);
   
    if (currentToastId) {
        const handledMessage = getHandledMessage(message);
        toast.update(currentToastId, {
          
            render: <ToastMessage message={handledMessage} />,
            autoClose,
            onClose: handleCloseToast,
            type,
            icon: getIconByType(type),
        });
    } else {
        openToastMessage(message, type, options);
    }
};

/** Helper functions for user */
const error = (msg: string, options?: ToastOptions<object> | undefined) => {
    showToast(msg, 'error', { ...options, icon: getIconByType('error') });
   
};

const info = (msg: string, options?: ToastOptions<object> | undefined) => {
    showToast(msg, 'info', {
        ...options,
        icon: getIconByType('info'),
    });
};

const success = (msg: string, options?: ToastOptions<object> | undefined) => {
    showToast(msg, 'success', { ...options, icon: getIconByType('success') });
};

const warning = (msg: string, options?: ToastOptions<object> | undefined) => {
    showToast(msg, 'warning', {
        ...options,
        icon: getIconByType('warning'),
    });
};

export const toastHelper = {
    error,
    info,
    warning,
    success,
    default: info,
};
