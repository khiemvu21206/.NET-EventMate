/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { THEME_WS } from '@/constants/constant';
import classNames from '@/ultilities/common/classNames';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import Image from 'next/image';
interface HeaderTableRenderProps {
    isShowCheckbox?: boolean;
    filterKey?: string | null;
    filterDirection?: string;
    bindingsHeaderTable: any[];
    toggleFilter?: Function;
    className?: string;
    totalCount?: number;
    selectAllDocumentCheckBox?: boolean;
    disableLoading?: boolean;
    setSelectAllDocumentCheckBox?: Function;
    filterPositionSuffix?: boolean;
    shouldDisableSort?: boolean;
}

const HeaderTableRender = ({
    isShowCheckbox,
    filterKey,
    filterDirection,
    bindingsHeaderTable,
    className = 'flex items-center bg-secondary-50 dark:bg-secondary-800 table-header sticky py-3 text-sm font-medium',
    toggleFilter,
    totalCount,
    selectAllDocumentCheckBox,
    disableLoading,
    setSelectAllDocumentCheckBox,
    filterPositionSuffix = false,
    shouldDisableSort,
}: HeaderTableRenderProps) => {
    const { theme } = useTheme();

    return (
        <>
            {bindingsHeaderTable.map((binding, idx) => {
                const filtered = filterKey === binding.filterKey;
                const filterable =
                    typeof binding.displayName === 'string' &&
                    binding.displayName.length > 0 &&
                    !shouldDisableSort &&
                    binding.sorted;
                const filterIcon =
                    filtered &&
                    (filterDirection === 'asc' ? (
                        <ChevronUpIcon className="w-4 h-4" />
                    ) : (
                        <ChevronDownIcon className="w-4 h-4" />
                    ));
                const showCheckBox = isShowCheckbox && totalCount && totalCount > 0 && idx == 0;
                return (
                    <div
                        key={binding.key}
                        className={classNames(className, binding?.className || '', 'min-w-max')}
                        style={{
                            display: binding.width ? 'block' : 'none',
                            width: binding.width ? binding.width : 0,
                        }}
                        onClick={() =>
                            filterable &&
                            binding.filterKey &&
                            toggleFilter &&
                            toggleFilter(binding.filterKey)
                        }
                    >
                        <div
                            className={classNames(
                                `flex items-center group/filter`,
                                binding?.isCenter && 'flex justify-center items-center',
                                binding?.customClass && binding.customClass
                            )}
                        >
                            {showCheckBox ? (
                                <div
                                    className={`cursor-pointer custom-checkbox mr-1 w-[20px] h-[20px] ${
                                        disableLoading && 'opacity-60 pointer-events-none'
                                    } ${showCheckBox && 'ml-2'}`}
                                    onClick={(event: any) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        setSelectAllDocumentCheckBox?.();
                                    }}
                                >
                                    {!selectAllDocumentCheckBox ? (
                                        <Image
                                            src={
                                                theme == THEME_WS.LIGHT
                                                    ? '/bot/conversation/radio-button-light.svg'
                                                    : '/bot/conversation/radio-button-dark.svg'
                                            }
                                            alt="checkbox"
                                            className="w-[20px]"
                                            width={20}
                                            height={20}
                                        />
                                    ) : (
                                        <Image
                                            src={
                                                theme == THEME_WS.LIGHT
                                                    ? '/bot/conversation/radio-button-selected-light.svg'
                                                    : '/bot/conversation/radio-button-selected-dark.svg'
                                            }
                                            alt="checkbox"
                                            width={20}
                                            className="w-[20px]"
                                            height={20}
                                        />
                                    )}
                                </div>
                            ) : (
                                ''
                            )}
                            <div
                                className={classNames(
                                    `${binding.sorted && !filterPositionSuffix && 'pl-4'} relative flex items-center`,
                                    filterable && 'cursor-pointer'
                                )}
                            >
                                {/* sort icon if !filterPositionSuffix */}
                                {!filterPositionSuffix && filterable && (
                                    <div className="absolute left-0">{filterIcon}</div>
                                )}
                                {/* {!filterPositionSuffix && binding.sorted && !filtered && (
                                    <div className="hidden group-hover/filter:block absolute left-0">
                                        <ChevronUpDownIcon className="w-4 h-4" />
                                    </div>
                                )} */}

                                {binding.displayName}

                                {/* sort icon if filterPositionSuffix */}
                                {filterPositionSuffix && filterable && (
                                    <div className="">{filterIcon}</div>
                                )}
                                {/* {filterPositionSuffix && binding.sorted && !filtered && (
                                    <div className="hidden group-hover/filter:block">
                                        <ChevronUpDownIcon className="w-4 h-4" />
                                    </div>
                                )} */}
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default HeaderTableRender;
