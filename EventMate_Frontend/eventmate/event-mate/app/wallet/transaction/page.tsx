/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import HeaderTableRender from "@/components/basic/HeaderTableRender";
import InfiniteScroll from "@/components/basic/InfiniteScroll";
import { TableSkeleton } from "@/components/basic/Table";
import { Button } from "@/components/common/button";
import Input from "@/components/common/Input";
import useComponentVisibleClickOutside from "@/hooks/useComponentVisibleClickOutside";
import { useDebounceFn } from "@/lib/debounceFn";
import { ensureTimezone, formatDateToYYYYMMDD, formatDateToYYYYMMDDAndIncreaseDate, formatLocalTime, generateStartDateOfMonth, timeConverter } from "@/lib/helpers";
import { RequestList } from "@/model/common";
import { TransactionHistory } from "@/model/wallet";
import { useLanguage } from "@/providers/LanguageProvider";
import { WalletRepository } from "@/repositories/WalletRepository";
import { debounce, isEqual, uniqBy } from "lodash";
import {
    CalendarDaysIcon,
    ChevronDownIcon,
    ChevronUpIcon,

} from '@heroicons/react/24/outline';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DateRangePicker } from 'react-date-range';

export type SortDirection = 'asc' | 'desc';
const TransactionPage = () => {
    const currentDate = new Date();
    const { t } = useLanguage();
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [retryCall, setRetryCall] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(8);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filter, setFilter] = useState<RequestList>();
    const [keySearch, setKeySearch] = useState<string>('');
    const [listTransaction, setListTransaction] = useState<TransactionHistory[]>([]);

    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [sortKey, setSortKey] = useState<string | null>('createdAt');
    const [isSearchDateRange, setIsSearchDateRange] = useState<boolean>(false);
    const handlePageLoadMore = () => {
        setCurrentPage(currentPage + 1);
        setRetryCall(new Date().getTime());
    };
    const getRequestQueries = () => {

        const request: RequestList = {
            currentPage,
            pageSize,
            keySearch,
            ascending: sortDirection === 'asc',
            sortBy: sortKey || 'createdAt',
        };
        if (dateRange[0].startDate && isSearchDateRange) {
            const formatstartDate = formatDateToYYYYMMDD(dateRange[0].startDate.toISOString());
            request.startDate = formatstartDate;
        }
        if (dateRange[0].startDate && isSearchDateRange) {
            const formatendDate = formatDateToYYYYMMDDAndIncreaseDate(dateRange[0].endDate.toISOString());
            request.endDate = formatendDate;
        }

        return request;
    };

    const getListComponents = async () => {

        try {
            setIsLoading(true);
            const params = getRequestQueries();
            const res = await WalletRepository.getListTransaction(params);

            if (!res.error) {
                if (currentPage > 1) {
                    setListTransaction((current) => {
                        return uniqBy([...current, ...res.data.data], 'transactionId');
                    });

                } else {
                    setListTransaction(res.data.data);
                }
                setTotalCount(res.data.totalCount);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        getListComponents();
    }, [retryCall, currentPage]);

    const handleChangeFilter = (filter: RequestList) => {
        setFilter(filter);
        setCurrentPage(1);
        setRetryCall(new Date().getTime());
    };
    const handleChangeSearch = (value: string) => {
        const filerTmp = { ...filter || {} };
        filerTmp.keySearch = value || '';
        setFilter(filerTmp as RequestList);
        setKeySearch(value);
        debouncedSearch.cancel();
        debouncedSearch();
    };
    const debouncedSearch = useCallback(
        debounce(() => {
            handleSubmitFilter();
        }, 600),
        []
    );

    const { run: handleSubmitFilter } = useDebounceFn(() => {
        if (filter) {
            handleChangeFilter(filter);
        }
    });
    const baseHeaders = useMemo(
        () => [
            {
                key: 'type',
                filterKey: 'type',
                displayName: t('wallet:transaction-type'),
                width: '20%',
                sorted: true,
            },
            {
                key: 'method',
                filterKey: 'method',
                displayName: t('wallet:transaction-method'),
                width: '25%',
                sorted: true,
            },
            {
                key: 'amount',
                filterKey: 'amount',
                displayName: t('wallet:transaction-amount'),
                width: '20%',
                sorted: true,
            },
            {
                key: 'createdAt',
                filterKey: 'createdAt',
                displayName: t('wallet:transaction-createAt'),
                width: '25%',
                sorted: true,

            },
            {
                key: 'status',
                filterKey: 'status',
                displayName: t('wallet:transaction-status'),
                width: '10%',
                sorted: false,

            },
        ],
        [t]
    );
    const toggleFilter = (key: string) => {
        let direction: SortDirection;
        const sortedBy: string | null = key;
        if (key === sortKey) {
            if (sortDirection === 'asc') {
                direction = 'desc';
            } else {
                direction = 'asc';
            }
        } else {
            setSortKey(key);
            direction = 'desc';
        }
        setSortDirection(direction);
        setCurrentPage(1);
        handleSortData?.(sortedBy, direction);
    };
    const handleSortData = (field: string | null, sort: SortDirection) => {
        setSortKey(field);
        setSortDirection(sort);
        setRetryCall(new Date().getTime());
    };


    // select date range
    const [dateRange, setDateRange] = useState<any>([
        {
            startDate: generateStartDateOfMonth(currentDate).value.startDate,
            endDate: generateStartDateOfMonth(currentDate).value.endDate,
            key: 'selection',
        },
    ]);
    const selectDateRangeFocusRef = useRef<any>(null);
    const [showSelectDateRangePopup, setShowSelectDateRangePopup] = useState<boolean>(false);
    const [isSelectDateRangeVisible, setIsSelectDateRangeVisible] = useState<boolean>(false);
    const selectDateRangeVisible = useComponentVisibleClickOutside(
        selectDateRangeFocusRef,
        isSelectDateRangeVisible,
        setIsSelectDateRangeVisible
    );

    const showDateRange = useMemo(() => {
        const startDate = dateRange[0].startDate;
        const endDate = dateRange[0].endDate;
        if (isEqual(startDate, endDate)) {
            return timeConverter(new Date(formatLocalTime(endDate, true)), false);
        }
        const startDateFormat = timeConverter(
            new Date(formatLocalTime(startDate, true)),
            false,
            true
        );
        const endDateFormat = timeConverter(new Date(formatLocalTime(endDate, true)), false, true);
        return `${startDateFormat} - ${endDateFormat}`;
    }, [dateRange]);

    const handleApplyDateRange = () => {
        recallList();
        setIsSearchDateRange(true);
        setShowSelectDateRangePopup(false);
    };

    const clearDateRange = () => {
        setDateRange([
            {
                startDate: currentDate,
                endDate: currentDate,
                key: 'selection',
            },
        ]);
        setIsSearchDateRange(false);
        setShowSelectDateRangePopup(false);
        recallList();
    };
    const recallList = () => {
        setCurrentPage(1);
        setRetryCall(new Date().getTime());
    }

    const handleSelectDateRange = () => {
        if (!showSelectDateRangePopup) setIsSelectDateRangeVisible(true); // update state blur hook
        setShowSelectDateRangePopup(!showSelectDateRangePopup);
    };

    useEffect(() => {
        if (showSelectDateRangePopup && !selectDateRangeVisible) {
            setShowSelectDateRangePopup(false);
        }
    }, [selectDateRangeVisible]);

    return (
        <div className="w-full p-4 px-[100px]">
            <div className="flex items-center md:flex-row md:justify-between flex-col relative">
                <div className="w-full items-center flex flex-wrap mb-5">
                    <div className="text-xl font-semibold leading-7 inline-flex">
                        <span>{t('wallet:transaction-title')}</span>
                    </div>

                </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="w-full md:w-auto flex-1">
                    <Input
                        className="w-full !h-11 pr-8 border"
                        type="text"
                        name="name"
                        value={keySearch}
                        onChange={(e) => { handleChangeSearch(e.target.value) }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {

                            }
                        }}
                        placeholder={"Search here"}
                    />
                </div>
                <div className="relative w-full md:w-[200px]">
                    <select
                        className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg"
                        onChange={(e) => {
                            // Xử lý khi thay đổi method
                        }}
                    >
                        <option value="">Tất cả phương thức</option>
                        <option value="cash">Tiền mặt</option>
                        <option value="bank">Chuyển khoản</option>
                        <option value="momo">Ví điện tử</option>
                    </select>
                </div>
                <div className="relative date-input w-full md:w-auto flex-1">
                    <Input
                        className="pl-9 pr-10 !h-11 w-full md:w-[268px] !cursor-pointer border"
                        type="text"
                        readOnly
                        value={showDateRange}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleSelectDateRange();
                            }
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSelectDateRange();
                        }}
                    />
                    {/* Icon Calendar */}
                    <span className="absolute left-2 top-1/2 -translate-y-1/2">
                        <CalendarDaysIcon className="w-5 h-5" />
                    </span>
                    {/* Button Chevron */}
                    <button
                        className="absolute top-1/2 -translate-y-1/2 bg-white -translate-x-7"
                        onClick={handleSelectDateRange}
                    >
                        {showSelectDateRangePopup ? (
                            <ChevronUpIcon className="w-5 h-5" />
                        ) : (
                            <ChevronDownIcon className="w-5 h-5" />
                        )}
                    </button>

                    {/* Modal range date */}
                    <div
                        ref={selectDateRangeFocusRef}
                        className={`absolute top-[56px] left-0 z-50 bg-gray-100 shadow-md border rounded-lg p-2 max-w-[500px]
        ${showSelectDateRangePopup ? '' : 'hidden-modal'}`}                    >
                        <DateRangePicker
                            onChange={(item: any) => {
                                setDateRange([item.selection]);
                                setIsSearchDateRange(false);
                            }}
                            moveRangeOnFirstSelection={false}
                            months={2}
                            ranges={dateRange}
                            direction="horizontal"
                        />
                        <div className="flex md:justify-end justify-start gap-2 items-center">
                            <button
                                className="text-[12px] cursor-pointer bg-secondary-100 dark:bg-secondary-800 rounded-lg w-[100px] flex justify-center items-center px-3 py-2"
                                onClick={clearDateRange}
                            >
                                {t('commons:clear')}
                            </button>
                            <button
                                className="text-[12px] cursor-pointer bg-primary-500 dark:bg-primary-600 text-white rounded-lg flex justify-center items-center w-[100px] px-3 py-2"
                                onClick={handleApplyDateRange}
                            >
                                {t('commons:apply')}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-auto">
                    <Button
                        className="w-full md:w-auto max-h-11"
                        label={t('commons:search')}
                        disabled={isLoading}
                        type="button"
                        onClickButton={handleSubmitFilter}
                    />
                </div>
            </div>
            <div className="mt-4 mb-4">
                <div className="flex items-center bg-secondary-50 dark:bg-secondary-800 mt-[10px]">
                    <HeaderTableRender
                        filterKey={sortKey}
                        filterDirection={sortDirection}
                        bindingsHeaderTable={baseHeaders}
                        toggleFilter={toggleFilter}
                        className="flex items-center bg-secondary-50 dark:bg-secondary-800 table-header sticky py-3 text-xs font-medium"
                        filterPositionSuffix={false}
                    />
                </div>
                <div className="mt-4 pl-4">
                    <InfiniteScroll
                        className={`w-full md:pb-[20px] max-h-[calc(100vh-300px)]`}
                        fetchMore={handlePageLoadMore}
                        hasMore={listTransaction.length < totalCount}
                        isEmpty={!(listTransaction && listTransaction.length > 0)}
                        isLoading={isLoading}
                        retrySearchAgain={currentPage == 1 && isLoading}
                        skeleton={<TableSkeleton bindings={baseHeaders} />}
                        hasMaxHeight={false}
                        forceScrollTop={false}
                        emptyMessage={
                            <div className="flex justify-center items-center h-[256px]">
                                <span>{t('manage:no-data')}</span>
                            </div>
                        }
                    >
                        {listTransaction && listTransaction.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`w-full overflow-hidden cursor-pointer min-h-[56px] hover:bg-primary-150 hover:dark:bg-primary-1000 border-b-[1px] border-slate-200 dark:border-slate-700 group/kb-card py-2 flex items-center transition-shadow`}

                                >

                                    <div
                                        className={`flex w-[20%] items-end text-subtle hover:text-primary-500 group item-center`}
                                    >
                                        <span className="text-strong text-sm font-medium leading-6 max-h-[72px] text-ellipsis line-clamp-3 max-w-[200px]">
                                            {item.type}
                                        </span>
                                    </div>
                                    <div
                                        className={`flex w-[25%] items-end text-subtle hover:text-primary-500 group`}
                                    >
                                        <span className="text-strong text-sm font-medium leading-6 max-h-[72px] text-ellipsis line-clamp-3 max-w-[200px]">
                                            {item.method}
                                        </span>
                                    </div>
                                    <div
                                        className={`flex w-[20%] items-end text-subtle hover:text-primary-500 group`}
                                    >
                                        <span className="text-strong text-sm font-medium leading-6 max-h-[72px] text-ellipsis line-clamp-3 max-w-[200px]">
                                            {item.amount}
                                        </span>
                                    </div>
                                    <div
                                        className={`flex w-[25%] items-end text-subtle hover:text-primary-500 group`}
                                    >
                                        <span className="text-strong text-sm font-medium leading-6 max-h-[72px] text-ellipsis line-clamp-3 max-w-[200px]">
                                            {timeConverter(
                                                new Date(ensureTimezone(item.createdAt)),
                                                false
                                            )}
                                        </span>
                                    </div>
                                    <div
                                        className={`flex w-[10%] items-end text-subtle hover:text-primary-500 group`}
                                    >
                                        <span className="text-strong text-sm font-medium leading-6 max-h-[72px] text-ellipsis line-clamp-3 max-w-[200px]">
                                            {item.status}
                                        </span>
                                    </div>

                                </div>
                            );
                        })}
                    </InfiniteScroll>
                </div>
            </div>
        </div >

    );
};
export default TransactionPage;
