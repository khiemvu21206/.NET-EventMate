/**
 * Store for handling toast message from API response
 * Used to handle cases where multiple API calls are made
 */
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import i18n from '@/translation/i18n';
import { toastHelper } from '@/ultilities/toastMessageHelper';
import { IGNORES_MESSAGE_KEY } from '@/constants/constant';

type queuedApiCall = {
    responseKey: string;
    numApiCall: number;
    hasToastedError: boolean;
    remainingApiCallResponseWaiting: number;
    isBypassIgnoreMessage?: boolean;
};

type ApiResponseToastStoreStates = {
    apiBatch: queuedApiCall[];
    useApiBatchToastHandler: boolean;
    currentTimeoutForBatchApiHandler: NodeJS.Timeout | null;
    toastLocked: boolean;
};

type ApiResponseToastStoreActions = {
    handleBatchApiCall: (apiBatch: queuedApiCall[]) => void;
    toastSuccess: (messageKey: string) => void;
    toastSuccessNormal: (messageKey: string, isByPassIgnoreMessage?: boolean) => void;
    toastSuccessFromBatch: (messageKey: string) => void;
    toastError: (messageKey: string) => void;
    toastErrorNormal: (messageKey: string) => void;
    toastErrorFromBatch: (messageKey: string) => void;
    hasReceivedAllApiCallFromBatch: () => boolean;
    clearCurrentBatch: () => void;
};

type ApiResponseToastStore = ApiResponseToastStoreStates & {
    actions: ApiResponseToastStoreActions;
};

const initialState: ApiResponseToastStoreStates = {
    apiBatch: [],
    useApiBatchToastHandler: false,
    currentTimeoutForBatchApiHandler: null,
    toastLocked: false,
};

export const useApiResponseToastStore = create<ApiResponseToastStore>()(
    immer((set, get) => {
        const apiQueue = { current: [] as queuedApiCall[] };

        return {
            ...initialState,
            actions: {
                handleBatchApiCall: (apiBatch: queuedApiCall[]) => {
                    set((state) => {
                        state.useApiBatchToastHandler = true;
                        state.apiBatch = apiBatch;
                    });

                    // set a timeout to reset the useApiBatchToastHandler to false
                    // if not receive all the responses from batch within 10s
                    const currentTimeout = setTimeout(() => {
                        const { hasReceivedAllApiCallFromBatch, clearCurrentBatch } = get().actions;
                        if (!hasReceivedAllApiCallFromBatch()) {
                            clearCurrentBatch();
                        }
                    }, 10000);

                    set((state) => {
                        state.currentTimeoutForBatchApiHandler = currentTimeout;
                    });
                },
                toastSuccess: (messageKey: string) => {
                    const { useApiBatchToastHandler } = get();
                    const { toastSuccessNormal, toastSuccessFromBatch } = get().actions;

                    if (useApiBatchToastHandler) {
                        toastSuccessFromBatch(messageKey);
                    } else {
                        toastSuccessNormal(messageKey);
                    }
                },
                toastSuccessNormal: (
                    messageKey: string,
                    isBypassIgnoreMessage: boolean = false
                ) => {
                    if (
                        messageKey &&
                        (!IGNORES_MESSAGE_KEY.includes(messageKey) || isBypassIgnoreMessage)
                    ) {
                        const messageFormat = i18n.t(`success:${messageKey}`);
                        toastHelper.success(messageFormat);
                    }
                },
                toastSuccessFromBatch: (messageKey: string) => {
                    const { apiBatch, toastLocked } = get();
                    const {
                        toastSuccessNormal,
                        hasReceivedAllApiCallFromBatch,
                        clearCurrentBatch,
                        toastSuccessFromBatch,
                    } = get().actions;

                    const apiCall = apiBatch.find((api) => api.responseKey === messageKey);
                    if (apiCall) {
                        if (toastLocked) {
                            apiQueue.current.push(apiCall);
                        } else {
                            const delayBetweenToasts = 3000;
                            toastSuccessNormal(messageKey, apiCall.isBypassIgnoreMessage);
                            set((state) => {
                                state.toastLocked = true;
                            });
                            setTimeout(() => {
                                set((state) => {
                                    state.toastLocked = false;
                                });
                                if (apiQueue.current.length > 0) {
                                    const nextApiCall = apiQueue.current.shift();
                                    if (nextApiCall) {
                                        toastSuccessFromBatch(nextApiCall.responseKey);
                                    }
                                }
                            }, delayBetweenToasts);

                            set((state) => {
                                state.apiBatch = state.apiBatch.map((api: queuedApiCall) =>
                                    api.responseKey === messageKey
                                        ? {
                                              ...api,
                                              remainingApiCallResponseWaiting:
                                                  api.remainingApiCallResponseWaiting - 1,
                                          }
                                        : api
                                );
                            });

                            if (hasReceivedAllApiCallFromBatch()) {
                                clearCurrentBatch();
                            }
                        }
                    } else {
                        toastSuccessNormal(messageKey);
                    }
                },
                toastError: (messageKey: string) => {
                    const { useApiBatchToastHandler } = get();
                    const { toastErrorNormal, toastErrorFromBatch } = get().actions;

                    if (useApiBatchToastHandler) {
                        toastErrorFromBatch(messageKey);
                    } else {
                        toastErrorNormal(messageKey);
                    }
                },
                toastErrorNormal: (messageKey: string) => {
                    const messageFormat = i18n.t(`errors:${messageKey}`);
                    toastHelper.error(messageFormat);
                },
                toastErrorFromBatch: (messageKey: string) => {
                    const { apiBatch } = get();
                    const { toastErrorNormal, hasReceivedAllApiCallFromBatch, clearCurrentBatch } =
                        get().actions;

                    // search current api batch and find the api call with the same message key
                    // if found and that api call has not toasted error yet, toast the error
                    const apiCall = apiBatch.find((api) => api.responseKey === messageKey);
                    if (apiCall) {
                        if (!apiCall.hasToastedError) {
                            set((state) => {
                                state.apiBatch = state.apiBatch.map((api: queuedApiCall) =>
                                    api.responseKey === messageKey
                                        ? { ...api, hasToastedError: true }
                                        : api
                                );
                            });
                            toastErrorNormal(messageKey);
                        }
                        // even if the error has been toasted, we still need to decrease the remaining response
                        set((state) => {
                            state.apiBatch = state.apiBatch.map((api: queuedApiCall) =>
                                api.responseKey === messageKey
                                    ? {
                                          ...api,
                                          remainingApiCallResponseWaiting:
                                              api.remainingApiCallResponseWaiting - 1,
                                      }
                                    : api
                            );
                        });

                        if (hasReceivedAllApiCallFromBatch()) {
                            clearCurrentBatch();
                        }
                    }
                    // if not found, toast the error normally
                    else {
                        toastErrorNormal(messageKey);
                    }
                },
                hasReceivedAllApiCallFromBatch: () => {
                    const { apiBatch } = get();
                    // check <= 0 instead of === 0 in case the numnber of responses is more than expected due to reasons
                    return apiBatch.every((api) => api.remainingApiCallResponseWaiting <= 0);
                },
                clearCurrentBatch: () => {
                    set((state) => {
                        state.apiBatch = [];
                        state.useApiBatchToastHandler = false;
                    });

                    const { currentTimeoutForBatchApiHandler } = get();
                    if (currentTimeoutForBatchApiHandler) {
                        clearTimeout(currentTimeoutForBatchApiHandler);
                    }
                },
            },
        };
    })
);

export const useApiResponseToastStates = () => useApiResponseToastStore((state) => state);
export const useApiResponseToastActions = () => useApiResponseToastStore((state) => state.actions);
