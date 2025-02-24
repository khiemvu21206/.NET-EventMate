import React, { useEffect, useRef } from 'react';

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
    isFull?: boolean;
    type?: string;
}

export const InputText: React.FC<InputTextProps> = ({
    isFull = false,
    type = 'text',
    ...inputProps
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (inputProps.autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [inputProps.autoFocus]);
    return (
        <div className={`flex flex-col gap-2 ${isFull && 'w-full'}`}>
            <div className={`flex items-center ${isFull && 'w-full'}`}>
                <input
                    type={type}
                    ref={inputRef}
                    {...inputProps}
                    className={`truncate ${
                        inputProps.className || 'm-1 p-1 border rounded-lg border-primary-500'
                    } ${'disabled:bg-gray-100'}`}
                />
            </div>
        </div>
    );
};
