"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { debounce, uniqBy } from "lodash";
import { useRouter } from "next/navigation";
import { FaPause, FaTrash, FaBullhorn, FaEdit, FaCheck } from "react-icons/fa";

import LeftNavbar from "@/components/event/createEvent/LeftNavbarComponent";
import TopNavbar from "@/components/event/createEvent/TopNavbarComponent";
import HeaderTableRender from "@/components/basic/HeaderTableRender";
import InfiniteScroll from "@/components/basic/InfiniteScroll";
import { TableSkeleton } from "@/components/basic/Table";
import { Button } from "@/components/common/button";
import Input from "@/components/common/Input";
import { useDebounceFn } from "@/lib/debounceFn";
import { RequestList } from "@/model/common";
import { EventRepository } from "@/repositories/EventRepository";
import { useLanguage } from "@/providers/LanguageProvider";
import { useUserContext } from "@/providers/UserProvider";
import UpdateEventModal from "@/components/event/updateEvent/UpdateEventModal";
import Tooltip from "@/components/common/Tooltip";

export type SortDirection = 'asc' | 'desc';

interface Event {
  eventId: string;
  name: string;
  description: string;
  timeStart: string;
  timeEnd: string;
  place: string;
  maxParticipants: number;
  currentParticipants: number;
  status: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  img: string;
  bannerStatus?: number;
}

export default function ManageEventPage() {
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
  const [listEvents, setListEvents] = useState<Event[]>([]);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [sortKey, setSortKey] = useState<string | null>('createdAt');
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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

  const getListEvents = async () => {
    try {
      if (authStatus === "unauthenticated") {
        setError("Vui lòng đăng nhập để xem danh sách sự kiện");
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
      const res = await EventRepository.getEventsByUser(userId, params);
      
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
      setError("Có lỗi xảy ra khi tải danh sách sự kiện");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authStatus !== "loading") {
      getListEvents();
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
        key: 'img',
        filterKey: 'img',
        displayName: t('event:image'),
        width: '10%',
        sorted: false,
        textAlign: 'center',
      },
      {
        key: 'name',
        filterKey: 'name',
        displayName: t('event:name'),
        width: '22%',
        sorted: true,
      },
      {
        key: 'place',
        filterKey: 'place',
        displayName: t('event:place'),
        width: '12%',
        sorted: true,
      },
      {
        key: 'timeStart',
        filterKey: 'timeStart',
        displayName: t('event:time-start'),
        width: '11%',
        sorted: true,
      },
      {
        key: 'timeEnd',
        filterKey: 'timeEnd',
        displayName: t('event:time-end'),
        width: '11%',
        sorted: true,
      },
      {
        key: 'status',
        filterKey: 'status',
        displayName: t('event:status'),
        width: '15%',
        sorted: true,
      },
      {
        key: 'action',
        filterKey: 'action',
        displayName: t('event:action'),
        width: '15%',
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

  const handlePauseEvent = async (eventId: string) => {
    try {
      const res = await EventRepository.changeEventStatus(eventId, 4);
      if (res.status === 200) {
        setRetryCall(new Date().getTime());
        setShowConfirmModal(false);
        setSelectedEventId(null);
      } else {
        alert('Có lỗi xảy ra khi tạm dừng sự kiện');
      }
    } catch (error) {
      console.error('Error pausing event:', error);
      alert('Có lỗi xảy ra khi tạm dừng sự kiện');
    }
  };

  const handleUpdateEvent = async (eventData: { TimeStart: string; TimeEnd: string; banner?: File }) => {
    try {
      if (!selectedEvent) return;
      
      const res = await EventRepository.updateEvent(selectedEvent.eventId, eventData);
      if (res.status === 200) {
        setRetryCall(new Date().getTime());
        setShowUpdateModal(false);
        setSelectedEvent(null);
      } else {
        alert('Có lỗi xảy ra khi cập nhật sự kiện');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Có lỗi xảy ra khi cập nhật sự kiện');
    }
  };

  const handlePublishEvent = async (eventId: string) => {
    try {
      const res = await EventRepository.changeEventStatus(eventId, 1);
      if (res.status === 200) {
        setRetryCall(new Date().getTime());
        setShowConfirmModal(false);
        setSelectedEventId(null);
      } else {
        alert('Có lỗi xảy ra khi công khai sự kiện');
      }
    } catch (error) {
      console.error('Error publishing event:', error);
      alert('Có lỗi xảy ra khi công khai sự kiện');
    }
  };

  const handlePromoteBanner = async (eventId: string) => {
    try {
      const res = await EventRepository.changeBannerStatus(eventId, 1);
      if (res.status === 200) {
        setRetryCall(new Date().getTime());
      } else {
        alert('Có lỗi xảy ra khi quảng bá banner');
      }
    } catch (error) {
      console.error('Error promoting banner:', error);
      alert('Có lỗi xảy ra khi quảng bá banner');
    }
  };

  const handleCancelEvent = async (eventId: string) => {
    try {
      const res = await EventRepository.changeEventStatus(eventId, 5);
      if (res.status === 200) {
        setRetryCall(new Date().getTime());
      } else {
        alert('Có lỗi xảy ra khi hủy sự kiện');
      }
    } catch (error) {
      console.error('Error canceling event:', error);
      alert('Có lỗi xảy ra khi hủy sự kiện');
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
          <TopNavbar currentTitle="Quản lý sự kiện" />
        </div>

        {/* Modal xác nhận */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-2xl">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Xác nhận duyệt sự kiện</h3>
              <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn duyệt sự kiện này?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors rounded border border-gray-300 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={() => selectedEventId && handlePauseEvent(selectedEventId)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal cập nhật sự kiện */}
        {showUpdateModal && selectedEvent && (
          <UpdateEventModal
            isOpen={showUpdateModal}
            onClose={() => {
              setShowUpdateModal(false);
              setSelectedEvent(null);
            }}
            onSubmit={handleUpdateEvent}
            event={selectedEvent}
          />
        )}

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
                    hasMore={listEvents.length < totalCount}
                    isEmpty={!(listEvents && listEvents.length > 0)}
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
                      {listEvents.map((event) => (
                        <div 
                          key={event.eventId} 
                          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => {
                            if (event.status === 1) {
                              router.push(`/event/eventDetail/${event.eventId}`);
                            }
                          }}
                        >
                          <div className="flex items-center p-4">
                            {/* Image - 10% */}
                            <div className="w-[10%]">
                              <img
                                src={event.img || "/images/default-event.jpg"}
                                alt={event.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            </div>

                            {/* Name - 22% */}
                            <div className="w-[22%] px-4">
                              <h3 className="font-medium text-sm line-clamp-2">
                                {event.name}
                              </h3>
                            </div>

                            {/* Place - 12% */}
                            <div className="w-[12%] px-4">
                              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                                {event.place}
                              </p>
                            </div>

                            {/* Time Start - 11% */}
                            <div className="w-[11%] px-4">
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {new Date(event.timeStart).toLocaleDateString("vi-VN")}
                              </p>
                            </div>

                            {/* Time End - 11% */}
                            <div className="w-[11%] px-4">
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {new Date(event.timeEnd).toLocaleDateString("vi-VN")}
                              </p>
                            </div>

                            {/* Status - 10% */}
                            <div className="w-[15%] px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  event.status === 1
                                    ? "bg-green-500/20 text-green-400"
                                    : event.status === 5
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                }`}
                              >
                                {event.status === 1 ? "Đã công khai" 
                                  : event.status === 2 ? "Chờ công khai" 
                                  : event.status === 4 ? "Đang tạm dừng" 
                                  : event.status === 5 ? "Đã hủy"
                                  : "Chờ xử lý"}
                              </span>
                            </div>

                            {/* Action - 24% */}
                            <div className="w-[15%] px-4 flex justify-center gap-2">
                              {/* Hiển thị nút "Cập nhật" nếu status là 2 hoặc 4 */}
                              {(event.status === 2 || event.status === 4) && (
                                <Tooltip title="Cập nhật">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedEvent(event);
                                      setShowUpdateModal(true);
                                    }}
                                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition-colors"
                                  >
                                    <FaEdit />
                                  </button>
                                </Tooltip>
                              )}

                              {/* Hiển thị nút "Tạm dừng" nếu status là 1 */}
                              {event.status === 1 && (
                                <>
                                  <Tooltip title="Tạm dừng">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePauseEvent(event.eventId);
                                      }}
                                      className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm transition-colors"
                                    >
                                      <FaPause />
                                    </button>
                                  </Tooltip>
                                  <Tooltip title="Hủy sự kiện">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancelEvent(event.eventId);
                                      }}
                                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition-colors"
                                    >
                                      <FaTrash />
                                    </button>
                                  </Tooltip>
                                </>
                              )}

                              {/* Hiển thị nút "Công khai" nếu status là 2 hoặc 4 */}
                              {(event.status === 2 || event.status === 4) && (
                                <>
                                  <Tooltip title="Công khai">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePublishEvent(event.eventId);
                                      }}
                                      className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm transition-colors"
                                    >
                                      <FaCheck />
                                    </button>
                                  </Tooltip>
                                  <Tooltip title="Hủy sự kiện">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancelEvent(event.eventId);
                                      }}
                                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition-colors"
                                    >
                                      <FaTrash />
                                    </button>
                                  </Tooltip>
                                </>
                              )}

                              {/* Hiển thị nút "Quảng bá banner" nếu status là 1 và bannerStatus là 0 hoặc null */}
                              {event.status === 1 && (event.bannerStatus === 0 || event.bannerStatus === null) && (
                                <Tooltip title="Quảng bá banner">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePromoteBanner(event.eventId);
                                    }}
                                    className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md text-sm transition-colors"
                                  >
                                    <FaBullhorn />
                                  </button>
                                </Tooltip>
                              )}

                              {/* Hiển thị trạng thái "Chờ xử lý banner" nếu status là 1 và bannerStatus là 1 */}
                              {event.status === 1 && event.bannerStatus === 1 && (
                                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-md text-sm">
                                  Chờ xử lý banner
                                </span>
                              )}
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