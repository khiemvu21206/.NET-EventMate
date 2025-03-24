"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { debounce, uniqBy } from "lodash";
import { useRouter } from "next/navigation";

import LeftNavbar from "@/components/event/createEvent/LeftNavbarComponent";
import TopNavbar from "@/components/event/createEvent/TopNavbarComponent";
import HeaderTableRender from "@/components/basic/HeaderTableRender";
import InfiniteScroll from "@/components/basic/InfiniteScroll";
import { TableSkeleton } from "@/components/basic/Table";
import { Button } from "@/components/common/button";
import Input from "@/components/common/Input";
import { useDebounceFn } from "@/lib/debounceFn";
import { RequestList } from "@/model/common";
import { EventRepository, BannerStatus } from "@/repositories/EventRepository";
import { useLanguage } from "@/providers/LanguageProvider";
import { useUserContext } from "@/providers/UserProvider";

export type SortDirection = 'asc' | 'desc';

interface Banner {
  eventId: string;
  name: string;
  banner?: string;
  bannerStatus: BannerStatus;
}

export default function BannerRequestPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { id: userId, status: authStatus } = useUserContext();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCall, setRetryCall] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState<RequestList>();
  const [keySearch, setKeySearch] = useState<string>('');
  const [listBanners, setListBanners] = useState<Banner[]>([]);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [sortKey, setSortKey] = useState<string | null>('eventId');
  const pageSize = 8;

  const handlePageLoadMore = () => {
    setCurrentPage(currentPage + 1);
    setRetryCall(new Date().getTime());
  };

  const getRequestQueries = () => {
    const request: RequestList = {
      currentPage,
      pageSize,
      keySearch,
      sortBy: sortKey || '',
      ascending: sortDirection === 'asc',
    };
    return request;
  };

  const getListBanners = async () => {
    try {
      if (authStatus === "unauthenticated") {
        setError("Vui lòng đăng nhập để xem danh sách banner");
        router.push("/auth/login");
        return;
      }

      if (!userId) {
        setError("Không tìm thấy thông tin người dùng");
        return;
      }

      setIsLoading(true);
      setError(null);
      const params = getRequestQueries();
      const res = await EventRepository.getBannerList(params);
      
      if (res.status === 200) {
        if(currentPage > 1){
          setListBanners((current) => {
            return uniqBy([...current, ...res.data.data], 'eventId');
          });
        } else {
          setListBanners(res.data.data);
        }
        setTotalCount(res.data.totalCount);
      }
    } catch (e) {
      console.log(e);
      setError("Có lỗi xảy ra khi tải danh sách banner");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authStatus !== "loading") {
      getListBanners();
    }
  }, [retryCall, currentPage, authStatus]);

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
        key: 'banner',
        filterKey: 'banner',
        displayName: t('banner:image'),
        width: '20%',
        sorted: false,
        textAlign: 'center',
      },
      {
        key: 'name',
        filterKey: 'name',
        displayName: t('banner:name'),
        width: '30%',
        sorted: true,
      },
      {
        key: 'bannerStatus',
        filterKey: 'bannerStatus',
        displayName: t('banner:status'),
        width: '20%',
        sorted: true,
      },
      {
        key: 'action',
        filterKey: 'action',
        displayName: t('banner:action'),
        width: '30%',
        sorted: false,
        textAlign: 'center',
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

  const handleChangeBannerStatus = async (eventId: string, currentStatus: BannerStatus) => {
    try {
      const newStatus = currentStatus === BannerStatus.Active ? 3 : 1;
      const res = await EventRepository.changeBannerStatus(eventId, newStatus);
      if (res.status === 200) {
        setRetryCall(new Date().getTime());
      } else {
        alert('Có lỗi xảy ra khi thay đổi trạng thái banner');
      }
    } catch (error) {
      console.error('Error changing banner status:', error);
      alert('Có lỗi xảy ra khi thay đổi trạng thái banner');
    }
  };

  return (
    <div className="flex">
      {/* Thanh navbar bên trái */}
      <div className="fixed left-0 top-0 h-screen w-64 z-50">
        <LeftNavbar />
      </div>

      {/* Phần nội dung chính */}
      <div className="flex flex-col flex-1 ml-64 bg-gray-100 min-h-screen">
        {/* Navbar trên cùng */}
        <div className="fixed top-0 left-64 right-0 h-16 bg-gray-900 z-50">
          <TopNavbar currentTitle="Yêu cầu banner" />
        </div>

          {/* Nội dung chính */}
          <div className="mt p-8">
          <div className="w-full">
            <div className="flex items-center md:flex-row md:justify-between flex-col relative">
              <div className="w-full items-center flex flex-wrap mb-5">
                <div className="text-xl font-semibold leading-7 inline-flex">
        
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="w-[400px]">
                  <Input
                    className="w-full !h-11 pr-8 border"
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
                <div className="">
                  <Button
                    className="max-h-11"
                    label={t('commons:search')}
                    disabled={isLoading}
                    type="button"
                    onClickButton={handleSubmitFilter}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 mb-4">
              <div className="flex items-center bg-secondary-50 dark:bg-secondary-800 mt-[10px]">
                <HeaderTableRender
                  filterKey={sortKey || ''}
                  filterDirection={sortDirection}
                  bindingsHeaderTable={baseHeaders}
                  toggleFilter={toggleFilter}
                  className="flex items-center bg-secondary-50 dark:bg-secondary-800 table-header sticky py-3 text-xs font-medium"
                  filterPositionSuffix={false}
                />
              </div>
              <div className="mt-4">
                {error ? (
                  <div className="flex justify-center items-center h-[256px] text-red-500">
                    <span>{error}</span>
                  </div>
                ) : (
                  <InfiniteScroll
                    className={`w-full md:pb-[20px] max-h-[calc(100vh-300px)]`}
                    fetchMore={handlePageLoadMore}
                    hasMore={listBanners.length < totalCount}
                    isEmpty={!(listBanners && listBanners.length > 0)}
                    isLoading={isLoading}
                    retrySearchAgain={currentPage === 1 && isLoading}
                    skeleton={<TableSkeleton bindings={baseHeaders} />}
                    hasMaxHeight={false}
                    forceScrollTop={false}
                    emptyMessage={
                      <div className="flex justify-center items-center h-[256px]">
                        <span>{t('manage:no-data')}</span>
                      </div>
                    }
                  >
                    <div className="w-full">
                      {listBanners.map((banner) => (
                        <div 
                          key={banner.eventId} 
                          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center p-4">
                            {/* Banner Image - 20% */}
                            <div className="w-[20%]">
                              <img
                                src={banner.banner || "/images/default-banner.jpg"}
                                alt={banner.name}
                                className="w-32 h-16 object-cover rounded-lg"
                              />
                            </div>

                            {/* Name - 30% */}
                            <div className="w-[30%] px-4">
                              <h3 className="font-medium text-sm line-clamp-2">
                                {banner.name}
                              </h3>
                            </div>

                            {/* Status - 20% */}
                            <div className="w-[20%] px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  banner.bannerStatus === BannerStatus.Active
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                }`}
                              >
                                {banner.bannerStatus === BannerStatus.Actived ? "Chờ xử lí" : "Đã xử lí"}
                              </span>
                            </div>

                            {/* Action - 30% */}
                            <div className="w-[30%] px-4 flex justify-center gap-2">
                              <button
                                onClick={() => handleChangeBannerStatus(banner.eventId, banner.bannerStatus)}
                                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                  banner.bannerStatus === BannerStatus.Active
                                    ? "bg-red-500 hover:bg-red-600 text-white"
                                    : "bg-green-500 hover:bg-green-600 text-white"
                                }`}
                              >
                                {banner.bannerStatus === BannerStatus.Active ? "Kích hoạt" : "Tạm dừng"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </InfiniteScroll>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 