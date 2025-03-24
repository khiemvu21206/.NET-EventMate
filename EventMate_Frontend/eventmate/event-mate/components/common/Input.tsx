import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

const Input = ({ className, ...props }: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => {
    return (
      <input
        {...props}
        className={`w-full bg-white px-4 py-2 rounded-lg focus:outline-none ${className}`}
      />
    );
  };
  
  export default Input;
  
