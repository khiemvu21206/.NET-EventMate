/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { useEffect } from 'react';

export default function useComponentVisibleClickOutside(
    elementFocusRef: any,
    isComponentVisible: boolean,
    setIsComponentVisible: Function
) {
    const handleClickOutside = (event: any) => {
        if (elementFocusRef.current && !elementFocusRef.current?.contains(event.target)) {
            setIsComponentVisible(false);
        } else {
            setIsComponentVisible(true);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return isComponentVisible;
}
