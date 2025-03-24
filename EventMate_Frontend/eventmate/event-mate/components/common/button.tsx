import { BUTTON_COMMON_TYPE } from '@/constants/constant';
import React, {
    ButtonHTMLAttributes,
    DetailedHTMLProps,
    MouseEventHandler,
    ReactNode,
} from 'react';
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon';
import { FcGoogle } from 'react-icons/fc';
import classNames from '@/ultilities/common/classNames';

type Props = {
    label?: React.ReactNode;
    className?: string;
    color?: string;
    type?: 'submit' | 'button' | 'reset';
    disabled?: boolean;
    isLoading?: boolean;
    onClickButton?: MouseEventHandler<HTMLButtonElement>;
    variant?: BUTTON_COMMON_TYPE;
    children?: ReactNode | ReactNode[];
};

const mapButtonVariantToClassName = (variant: BUTTON_COMMON_TYPE) => {
    switch (variant) {
        case BUTTON_COMMON_TYPE.ICON_NO_BORDER: {
            return 'border-none !bg-transparent rounded disabled:opacity-30 disabled:cursor-default';
        }
        case BUTTON_COMMON_TYPE.GOOGLE: {
            return 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300';
        }
        case BUTTON_COMMON_TYPE.CANCEL: {
            return `transparent border 
            border-slate-300 
            hover:border-primary-500 
            hover:border-black`;
        }

        case BUTTON_COMMON_TYPE.CANCEL_WITH_CHILDREN: {
            return 'transparent border border-slate-300 dark:border-slate-700 hover:border-primary-500 hover:border-black active:bg-slate-200 ';
        }
        case BUTTON_COMMON_TYPE.DELETE_WITH_CHILDREN: {
            return 'transparent border border-error-500 text-error-500 hover:border-error-700 hover:text-error-700';
        }
        case BUTTON_COMMON_TYPE.DELETE: {
            return 'bg-error-500 text-white hover:bg-error-700';
        }

        case BUTTON_COMMON_TYPE.CANCEL_BLACK: {
            return 'button-cancel-with-children bg-[var(--color-black-white)] text-[var(--text-white-black)] ';
        }

        case BUTTON_COMMON_TYPE.PRIMARY_OUTLINE_WITH_CHILDREN: {
            return `
                bg-transparent 
                border border-[var(--primary-color)] 
                hover:border-primary-500 
                hover:text-primary-300 
                hover:border-[var(--primary-color-hover)] 
                hover:text-[var(--primary-color-hover)] 
                
            `;
        }
        case BUTTON_COMMON_TYPE.PRIMARY_OUTLINE: {
            return `bg-transparent 
            border border-[var(--primary-color)] 
            text-[var(--primary-color)] 
            hover:border-primary-500 
            hover:border-[var(--primary-color-hover)] 
            hover:text-[var(--primary-color-hover)]`;
        }
        case BUTTON_COMMON_TYPE.SECONDARY: {
            return 'bg-transparent border-primary-300  hover:border-primary-500 hover:text-primary-300 hover:bg-primary-50';
        }

        case BUTTON_COMMON_TYPE.SECONDARY_OUTLINE: {
            return `
                bg-transparent 
                border border-secondary-300 
                text-secondary-300 
                hover:border-secondary-500 
                hover:text-secondary-500
               
            `;
        }

        default:
            return '';
    }
};

export const Button = ({
    label,
    className = '',
    color = 'bg-primary-500 hover:bg-primary-700 active:bg-primary-900 text-white',
    type = 'button',
    disabled = false,
    onClickButton,
    variant = BUTTON_COMMON_TYPE.PRIMARY,
    children,
    isLoading,
    ...props
}: Omit<
    DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & Props,
    'onClick'
>) => {
    const defaultClassName =
        'flex relative items-center justify-center text-base cursor-pointer font-outfit px-3 sm:px-4 py-3 rounded-lg disabled:cursor-default';
    const colorCumz = mapButtonVariantToClassName(variant) || color;

    const classNameCumz = classNames(
        defaultClassName,
        className,
        [BUTTON_COMMON_TYPE.GOOGLE, BUTTON_COMMON_TYPE.ICON_NO_BORDER].includes(variant)
            ? ' text-black dark:text-white flex items-center gap-3 border border-primary-100'
            : ' cursor-pointer',
        disabled ? '[&>svg]:!animate-none [&>svg]:!text-primary-100 ' : 'button-click-effect',
        disabled && variant !== BUTTON_COMMON_TYPE.ICON_NO_BORDER
            ? 'bg-secondary-100 text-bgdark dark:text-bglight !cursor-not-allowed text-[var(--text-color-disabled)] bg-[var(--background-color-disabled)]'
            : colorCumz
    );

    const buttonPresent = () => {
        switch (variant) {
            case BUTTON_COMMON_TYPE.GOOGLE:
                return (
                    <button
                      {...props}
                      className={classNameCumz}
                      type={type}
                      onClick={onClickButton}
                      disabled={disabled}
                    >
                      {isLoading ? (
                        <div className="loading-btn">
                          <ArrowPathIcon className="w-6 h-6 ml-2 animate-spin" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {/* Sử dụng icon Google từ react-icons */}
                          <FcGoogle className="w-6 h-6" />
                          <span>{label}</span>
                        </div>
                      )}
                    </button>
                  );
            case BUTTON_COMMON_TYPE.ICON_NO_BORDER:
                return (
                    <button
                        {...props}
                        className={classNameCumz}
                        onClick={onClickButton}
                        disabled={disabled}
                    >
                        {children}
                    </button>
                );

            // primary button has content: icon, text
            case BUTTON_COMMON_TYPE.PRIMARY_WITH_CHILDREN:
            case BUTTON_COMMON_TYPE.PRIMARY_OUTLINE_WITH_CHILDREN:
            case BUTTON_COMMON_TYPE.CANCEL_WITH_CHILDREN:
            case BUTTON_COMMON_TYPE.DELETE_WITH_CHILDREN:
                return (
                    <button
                        {...props}
                        className={`${classNameCumz} h-[36px]`}
                        type={type}
                        onClick={onClickButton}
                        disabled={disabled}
                    >
                        {isLoading && (
                            <div className="loading-btn">
                                <ArrowPathIcon className="w-6 h-6 ml-2 animate-spin" />
                            </div>
                        )}
                        <div
                            className={`${
                                isLoading ? 'opacity-0' : ''
                            } flex items-center justify-center btn-content-wrapper`}
                        >
                            {children}
                        </div>
                    </button>
                );

            default:
                return (
                    <button
                        {...props}
                        className={classNameCumz}
                        type={type}
                        onClick={onClickButton}
                        disabled={disabled}
                    >
                    
                        {isLoading ? (
                            <div className="loading-btn">
                                <ArrowPathIcon className="w-6 h-6 ml-2 animate-spin" />
                            </div>
                        ) :    <span className={`${isLoading ? 'opacity-0' : ''}`}>{label}</span> }
                    </button>
                );
        }
    };

    return buttonPresent();
};
