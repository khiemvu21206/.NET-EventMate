import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

const Input = ({
    ...props
}: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => {
    return (
        <input
            {...props}
            className={` ${props.className} bg-transparent px-4 py-2 h-12 focus:outline-none border rounded-lg border-slate-300 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 active:border-primary-500 flex items-center gap-3`}
        />
    );
};

export default Input;
