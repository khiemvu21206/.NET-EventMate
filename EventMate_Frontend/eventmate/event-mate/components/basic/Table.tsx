import React, { InputHTMLAttributes, JSX, ReactNode, useMemo, useState } from 'react';
import classNames from '@/ultilities/common/classNames';
import { get } from 'lodash';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { TClassName } from '@/types/common';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { SKELETON_COLOR, THEME_WS } from '@/constants/constant';
import { useTheme } from 'next-themes';
import { EmptyDataPlaceHolder } from './EmptyDataPlaceHolder';
import randomIdGenerator from './randomIdGenerator';
import 'react-loading-skeleton/dist/skeleton.css';

export type TableFieldData = string | number | boolean | undefined | JSX.Element;
export type SortDirection = 'asc' | 'desc';

interface TableDataBinding<TableData> {
    key: string;
    displayName: JSX.Element | string;
    customValue?: (data?: TableData) => TableFieldData;
    valueClassNames?: string;
    sorted?: boolean;
    width?: string;
    isHidden?: boolean;
}

interface TableRowSelection<TableData> {
    selectedRowKeys: string[];
    onChange?: (selectedRowKeys: string[]) => void;
    getCheckboxProps?: (record: TableData) => InputHTMLAttributes<HTMLInputElement>;
    columnTitle?: ReactNode;
    width?: string;
}

const SKELETON_ROWS_NUMBER = 5;

export interface TableDataProps<TableData> {
    data: TableData[];
    isLoading: boolean;
    bindings: TableDataBinding<TableData>[];
    totalCount: number;
    emptyTitle?: string;
    emptyMessage?: string;
    onClickRow?: (item: any) => void;
    onSortData?: (field: string | null, sort: SortDirection) => void;
    rowKey?: keyof TableData;
    rowSelection?: TableRowSelection<TableData>;
    rowClassName?: (record: TableData, index: number) => TClassName;
    sortingField?: string | null;
    setSortingField?: (field: string) => void;
    defaultSortDirection?: SortDirection;
    defaultSortField?: string;
    stickyHeader?: boolean;
}

export default function Table<TableData>({
    data,
    bindings: _bindings,
    totalCount = 0,
    emptyTitle = '',
    emptyMessage = '',
    isLoading = false,
    onClickRow,
    onSortData,
    rowKey,
    rowSelection,
    rowClassName,
    sortingField,
    setSortingField,
    defaultSortDirection,
    defaultSortField,
    stickyHeader = true,
}: TableDataProps<TableData>) {
    const [sortKey, setSortKey] = useState<string | null>(defaultSortField || null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        defaultSortDirection || 'desc'
    );

    const bindings = useMemo(() => _bindings.filter((binding) => !binding.isHidden), [_bindings]);

    const showRowSelection = rowSelection && rowKey;

    const renderTemplate = (rowData: any, column: TableDataBinding<TableData>) => {
        if (column.customValue) {
            return column.customValue(rowData);
        }

        return <div>{rowData[column.key]}</div>;
    };

    const toggleFilter = (key: string) => {
        let directtion: SortDirection;
        let sortedBy: string | null = key;
        if (key === sortKey) {
            if (sortDirection === 'asc') {
                directtion = 'desc';
            } else {
                directtion = 'asc';
            }
        } else {
            setSortKey(key);
            directtion = 'desc';
        }
        setSortDirection(directtion);
        setSortingField?.(key);
        onSortData?.(sortedBy, directtion);
    };
    const renderHeaderColumn = () => {
        const bindingDataHeader = bindings.map((binding, idx) => {
            const filtered = sortingField ? sortingField === binding.key : sortKey === binding.key;
            const filterable = binding.sorted && totalCount > 1;
            const filterIcon =
                filtered &&
                (sortDirection === 'asc' ? (
                    <ChevronUpIcon className="w-4 h-4" />
                ) : (
                    <ChevronDownIcon className="w-4 h-4" />
                ));
            return (
                <th
                    key={binding.key}
                    className={classNames(
                        'table-header text-slate-500 dark:text-white bg-secondary-50 dark:bg-secondary-800 px-4 py-2 text-sm font-medium text-left w-max z-[1000]',
                        idx === 0 && !showRowSelection && 'rounded-l-lg',
                        idx === bindings.length - 1 && 'rounded-r-lg',
                        filterable && 'cursor-pointer',
                        stickyHeader && 'sticky top-0'
                    )}
                    style={{
                        width: binding.width,
                    }}
                    onClick={() => filterable && toggleFilter(binding.key)}
                >
                    <div className="whitespace-nowrap group/filter  ">
                        <div
                            className={classNames(
                                `${binding.sorted && 'pl-4 relative'} flex items-center`,
                                filterable && filterIcon && 'cursor-pointer'
                            )}
                        >
                            {filterable && <div className="absolute left-0">{filterIcon}</div>}
                            {binding.displayName}
                        </div>
                    </div>
                </th>
            );
        });

        if (showRowSelection) {
            bindingDataHeader.unshift(
                <th
                    key="selection"
                    className={classNames(
                        'rounded-l-lg table-header bg-secondary-50 dark:bg-secondary-800 px-4 py-2 text-sm font-medium text-left max-w-[50px]',
                        stickyHeader && 'sticky top-0'
                    )}
                    style={{
                        width: rowSelection?.width,
                    }}
                >
                    {rowSelection?.columnTitle}
                </th>
            );
        }

        return bindingDataHeader;
    };

    const renderRowSelection = (item: TableData) => {
        const rowKeyValue = get(item, rowKey as string) as string;
        const isSelected = rowSelection?.selectedRowKeys?.includes(rowKeyValue);

        return (
            <td key={`row-selection-${rowKeyValue}`} className="table-col px-4 py-2 max-w-[50px]">
                <input
                    type="checkbox"
                    className="cursor-pointer checked:bg-light checked:border-primary-1050"
                    checked={isSelected}
                    {...rowSelection?.getCheckboxProps?.(item)}
                    // onChange={() => {
                    //     if (isSelected) {
                    //         const selectedRowKeys =
                    //             rowSelection?.selectedRowKeys?.filter(
                    //                 (key) => key !== rowKeyValue
                    //             ) || [];
                    //         rowSelection?.onChange?.(selectedRowKeys);
                    //     } else {
                    //         const selectedRowKeys = [
                    //             ...(rowSelection?.selectedRowKeys || []),
                    //             rowKeyValue,
                    //         ];
                    //         rowSelection?.onChange?.(selectedRowKeys);
                    //     }
                    // }}
                />
            </td>
        );
    };


    return (
        <div className="table-container">
            {isLoading ? (
                <TableSkeleton bindings={bindings} />
            ) : (
                <table
                    className="table-main w-full table-auto border-collapse text-sm"
                    data-testid="table-id"
                >
                    <thead
                        className={classNames(
                            'table-main-thead z-[999]',
                            stickyHeader && 'sticky top-0'
                        )}
                    >
                        <tr>{renderHeaderColumn()}</tr>
                    </thead>
                    <tbody className="table-main-body overflow-y-auto">
                        {totalCount <= 0 && !isLoading ? (
                            <tr className="w-full">
                                <td
                                    colSpan={bindings.length + (showRowSelection ? 1 : 0)}
                                    className="w-full"
                                >
                                    <EmptyDataPlaceHolder
                                        emptyTitle={emptyTitle}
                                        emptyMessage={emptyMessage}
                                    />
                                </td>
                            </tr>
                        ) : (
                            <>
                                {data?.map((item, index) => {
                                    return (
                                        <tr
                                            key={
                                                (get(item, '_id') as string) || randomIdGenerator()
                                            }
                                            onClick={() => onClickRow && onClickRow(item)}
                                            className={classNames(
                                                'border-b border-default relative z-auto',
                                                typeof onClickRow === 'function'
                                                    ? 'cursor-pointer'
                                                    : '',
                                                rowClassName?.(item, index)
                                            )}
                                        >
                                            {showRowSelection && renderRowSelection(item)}
                                            {bindings?.map((dataBinding) => {
                                                return (
                                                    <td
                                                        key={dataBinding.key}
                                                        className="table-col px-4 py-2"
                                                    >
                                                        {renderTemplate(item, dataBinding)}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export function TableSkeleton<T>({ bindings }: { bindings: TableDataBinding<T>[] }) {
 

    return (
      
        <SkeletonTheme>
            
        <table className="table-main w-full table-auto border-collapse text-sm">
            <tbody className="table-main-body overflow-y-auto">
                {Array.from({ length: SKELETON_ROWS_NUMBER }).map((_, rowIndex) => (
                    <tr
                    key={`skeleton-table-row-${rowIndex}`}
                    className="border-b border-gray-200 relative z-auto w-full"
                >                
                        {bindings.map((binding, colIndex) => (
                            <td
                                key={`skeleton-table-cell-${rowIndex}-${colIndex}`}
                                className="px-4 py-2"
                                style={{
                                    width: binding.width || 'auto',
                                }}
                            >
                                <Skeleton
                                    height={20}
                                    baseColor="#ebebeb"  
                                    highlightColor="#f5f5f5"
                                />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>

    </SkeletonTheme>
    

    );
}
