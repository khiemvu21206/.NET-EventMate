/* eslint-disable @typescript-eslint/no-explicit-any */
import { useApiResponseToastStore } from '@/store/apiResponseToastStore';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Agent } from 'https';
import { mapValues } from 'lodash';
import { getAuthInfo } from './auth';

export type RequestResponse<ResponseData> = AxiosResponse<ResponseData> & {
    error?: any;
};

type InputFunction<P extends any[], D> = (fetch: typeof fetcher, ...args: P) => Promise<D>;

type CreateRepositoryInput = {
    [key: string]: InputFunction<any, any>;
};

type CreateRepositoryOutput<
    Input extends CreateRepositoryInput,
    Keys extends keyof Input = keyof Input,
> = {
    [P in Keys]: Input[P] extends InputFunction<infer P, infer D>
        ? (...args: P) => Promise<D>
        : never;
};

export default function createRepository<Input extends CreateRepositoryInput>(
    input: Input
): CreateRepositoryOutput<Input> {
    return mapValues(input, (resourceCreator: InputFunction<any, any>) => {
        return (...args: any[]) => {
            return resourceCreator(fetcher, ...args);
        };
    }) as CreateRepositoryOutput<Input>;
}

const axiosInstance = axios.create({
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
});

const responseHandler = (response: any) => {
    // format response: {key: string, body: any}
    const { toastSuccess } = useApiResponseToastStore.getState().actions;
    const messageKey = response.data?.key;
    toastSuccess(messageKey);
    return {
        ...response,
        data: response.data?.data,
    };
};


// config reasponse handler
axiosInstance.interceptors.response.use(responseHandler, null);

export const fetcher = <ResponseData = any>(
    url: string,
    config?: AxiosRequestConfig
): Promise<RequestResponse<ResponseData>> => {
    const { toastError } = useApiResponseToastStore.getState().actions;
    const session = getAuthInfo();
    return axiosInstance
        .request<ResponseData>({
            ...config,
            url,
            httpsAgent: new Agent({ rejectUnauthorized: false }),
            params: {
                ...config?.params,
            },
            headers: {
                ...config?.headers,
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user.token}` || '',
            },

        })
        .catch((error: any) => {
            const showMessage = true;
            const responseKey = error?.response?.data?.key;
            if (showMessage && responseKey) {
                toastError(responseKey);
            }
            return {
                ...error.response,
                error,
            } as RequestResponse<ResponseData>;
        });
};
