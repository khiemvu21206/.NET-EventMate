"use client";

import HeaderTableRender from "@/components/basic/HeaderTableRender";
import InfiniteScroll from "@/components/basic/InfiniteScroll";
import { TableSkeleton } from "@/components/basic/Table";
import { Button } from "@/components/common/button";
import Input from "@/components/common/Input";
import { useDebounceFn } from "@/lib/debounceFn";
import { RequestList } from "@/model/common";
import { Event } from "@/repositories/EventRepository";
import { useLanguage } from "@/providers/LanguageProvider";
import { EventRepository } from "@/repositories/EventRepository";
import { debounce, uniqBy } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import EventComponent from "@/components/event/eventList/EventComponent";
import { useRouter } from 'next/navigation';

export type SortDirection = 'asc' | 'desc';

const EventListPage = () => {
    const { t } = useLanguage();
    const router = useRouter();
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isLoadMore, setIsLoadMore] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [retryCall, setRetryCall] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(8);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filter, setFilter] = useState<RequestList>();
    const [keySearch, setKeySearch] = useState<string>('');
    const [listEvents, setListEvents] = useState<Event[]>([]);
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [sortKey, setSortKey] = useState<string | null>('createdAt');

    const handlePageLoadMore = () => {
        setIsLoadMore(true);
        setCurrentPage(currentPage + 1);
        setRetryCall(new Date().getTime());
    };

    const getRequestQueries = () => {
        const request: RequestList = {
            currentPage: currentPage || 1,
            pageSize,
            keySearch,
            sortBy: sortKey || '',
            ascending: sortDirection === 'asc',
        };
        return request;
    };

    const getListEvents = async () => {
        try {
            setIsLoading(true);
            const params = getRequestQueries();
            const res = await EventRepository.getListEvents(params);
          
            if (res.status === 200) {
                if(currentPage > 1){
                    setListEvents((current) => {
                        return uniqBy([...current, ...res.data.data], 'eventId');
                    });
                } else {
                    setListEvents(res.data.data);
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
        getListEvents();
    }, [retryCall, currentPage]);

    const handleChangeFilter = (filter: RequestList) => {
        setFilter(filter);
        setCurrentPage(1);
        setRetryCall(new Date().getTime());
    };

    const handleChangeSearch = (value: string) => {
        const filterTmp = { ...filter || {} };
        filterTmp.keySearch = value || '';
        setFilter(filterTmp as RequestList);
        setKeySearch(value);
        debouncedSearch.cancel();
        debouncedSearch(value);
    };

    const debouncedSearch = useCallback(
        debounce((key: string) => {
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
                key: 'banner',
                filterKey: 'banner',
                displayName: t('event:banner'),
                width: '10%',
                sorted: false,
            },
            {
                key: 'name',
                filterKey: 'name',
                displayName: t('event:name'),
                width: '20%',
                sorted: true,
            },
            {
                key: 'place',
                filterKey: 'place',
                displayName: t('event:place'),
                width: '15%',
                sorted: true,
            },
            {
                key: 'timeStart',
                filterKey: 'timeStart',
                displayName: t('event:time-start'),
                width: '15%',
                sorted: true,
            },
            {
                key: 'timeEnd',
                filterKey: 'timeEnd',
                displayName: t('event:time-end'),
                width: '15%',
                sorted: true,
            },
            {
                key: 'type',
                filterKey: 'type',
                displayName: t('event:type'),
                width: '15%',
                sorted: true,
            },
            {
                key: 'status',
                filterKey: 'status',
                displayName: t('event:status'),
                width: '10%',
                sorted: true,
            },
        ],
        [t]
    );

    const toggleFilter = (key: string) => {
        let direction: SortDirection;
        if (key === sortKey) {
            direction = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            setSortKey(key);
            direction = 'desc';
        }
        setSortDirection(direction);
        handleSortData(key, direction);
    };

    const handleSortData = (field: string, direction: SortDirection) => {
        setSortKey(field);
        setSortDirection(direction);
        setRetryCall(new Date().getTime());
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Search Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 max-w-xl">
                            <Input
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gray-900 focus:ring-0 transition-colors"
                                type="text"
                                name="name"
                                value={keySearch}
                                onChange={(e) => handleChangeSearch(e.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        handleSubmitFilter();
                                    }
                                }}
                                placeholder={t('commons:search')}
                            />
                        </div>
                        <Button
                            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            label={t('commons:search')}
                            disabled={isLoading}
                            type="button"
                            onClickButton={handleSubmitFilter}
                        />
                    </div>
                </div>

                {/* Events Grid */}
                <div className="space-y-6">
                    <InfiniteScroll
                        className="w-full"
                        fetchMore={handlePageLoadMore}
                        hasMore={listEvents.length < totalCount}
                        isEmpty={!(listEvents && listEvents.length > 0)}
                        isLoading={isLoading}
                        retrySearchAgain={currentPage === 1 && isLoading}
                        skeleton={<TableSkeleton bindings={baseHeaders} />}
                        hasMaxHeight={false}
                        forceScrollTop={false}
                        emptyMessage={
                            <div className="flex justify-center items-center h-64 text-gray-500">
                                <span>{t('manage:no-data')}</span>
                            </div>
                        }
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {listEvents.map((evt) => (
                                <div key={evt.eventId} onClick={() => router.push(`/event/eventDetail/${evt.eventId}`)}>
                                    <EventComponent event={evt} />
                                </div>
                            ))}
                        </div>
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    );
};

export default EventListPage;