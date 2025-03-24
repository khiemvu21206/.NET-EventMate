import { DetailedHTMLProps, InputHTMLAttributes, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const InputSecret = ({
    ...props
}: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => {
    const [isRevealPassword, setIsRevealPassword] = useState<boolean>(false);
    const togglePassword = () => {
        setIsRevealPassword((prevState) => !prevState);
    };
    return (
        <div className="relative">
            <input
                {...props}
                type={isRevealPassword ? "text" : "password"}
                className={`w-full bg-white px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary-500 ${props.className}`}
            />
            <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer" onClick={togglePassword}>
                {isRevealPassword ? (
                    <EyeSlashIcon className='w-5 h-5 text-gray-600' />
                ) : (
                    <EyeIcon className='w-5 h-5 text-gray-600' />
                )}
            </div>
        </div>
    );
};

export default InputSecret;
