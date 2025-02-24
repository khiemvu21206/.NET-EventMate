import { DetailedHTMLProps, InputHTMLAttributes, useState } from 'react';
import { EyeIcon } from "@heroicons/react/24/outline";
import { EyeSlashIcon } from "@heroicons/react/24/outline";

const InputSecret = ({
    ...props
}: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => {
       const [isRevealPassword, setIsRevealPassword] = useState<boolean>(false);
       const togglePassword = () => {
        setIsRevealPassword((prevState) => !prevState);
    };
    return (
        <div className="h-12 flex items-center focus:outline-none border rounded-lg border-slate-300 hover:border-primary-500 active:border-primary-500">
            <input
                {...props}
                className={` ${props.className} bg-transparent px-4 py-2 h-10  flex items-center gap-3`}
            />
            {isRevealPassword ? (
                <EyeIcon className='w-5 h-5' onClick={togglePassword}/>
            ) : (

                <EyeSlashIcon className='w-5 h-5'  onClick={togglePassword}/>
            )}

        </div>


    );
};

export default InputSecret;
