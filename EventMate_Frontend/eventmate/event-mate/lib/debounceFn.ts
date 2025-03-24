/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import { debounce, DebounceSettings } from 'lodash';
import { useEffect, useRef } from 'react';

type Fn = (...args: any) => any;

export function useDebounceFn<T extends Fn>(fn: T, options?: DebounceSettings & { wait: number }) {
    const fnRef = useRef<T>(fn);
    fnRef.current = fn;

    const wait = options?.wait ?? 600;

    const debounced = useRef(
        debounce<T>(
            ((...args: any[]) => {
                return fnRef.current(...args);
            }) as T,
            wait,
            options
        )
    ).current;

    useUnMount(() => {
        debounced.cancel();
    });

    return {
        run: debounced as unknown as T,
        cancel: debounced.cancel,
        flush: debounced.flush,
    };
}

export const useUnMount = (callback: Function): void => {
    useEffect(
        () => () => {
            callback();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
};
