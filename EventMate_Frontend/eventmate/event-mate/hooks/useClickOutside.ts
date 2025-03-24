import { useEffect, RefObject } from 'react';

type ClickOutsideCallback = (event: MouseEvent | TouchEvent | FocusEvent) => void;

type EventType =
    | 'mousedown'
    | 'mouseup'
    | 'touchstart'
    | 'touchend'
    | 'focusin'
    | 'focusout'
    | 'click';

const useClickOutside = (
    enable: boolean,
    ref: RefObject<HTMLElement>,
    eventType: EventType = 'click',
    callback: ClickOutsideCallback
): void => {
    useEffect(() => {
        const handleClickOutside: ClickOutsideCallback = (event) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback(event);
            }
        };

        let timeOutEnable: NodeJS.Timeout | null = null;

        if (enable) {
            timeOutEnable = setTimeout(() => {
                document.addEventListener(eventType, handleClickOutside);
            }, 0);
        }

        return () => {
            if (timeOutEnable) {
                clearTimeout(timeOutEnable);
            }
            document.addEventListener(eventType, handleClickOutside);
        };
    }, [ref, callback, enable, eventType]);
};

export default useClickOutside;
