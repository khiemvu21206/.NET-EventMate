"use client";
import HeaderTableRender from "@/components/basic/HeaderTableRender";
import InfiniteScroll from "@/components/basic/InfiniteScroll";
import { useLanguage } from "@/providers/LanguageProvider";
import { useMemo, useState } from "react";
const TableEmailServiceModal = () => {
    const { t } = useLanguage();
   const [data, setData] = useState<number>(10);    
    const [isLoading, setIsLoading] = useState(false);
    const fetchMore = async () => {
        setData(data + 10);
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };
    const bindingsHeaderTable = useMemo(() => {
        return [
            {
                key: '',
                filterKey: '',
                displayName: '',
                width: '5%',
                sorted: false,
            },
            {
                key: 'Type',
                filterKey: 'type',
                displayName: t('document:table-type'),
                width: '6%',
                sorted: false,
            },
            {
                key: 'sender',
                filterKey: 'sender',
                displayName: t('note:table-sender'),
                width: '18%',
                sorted: false,
            },
            {
                key: 'subject',
                filterKey: 'subject',
                displayName: t('note:table-subject'),
                width: '56%',
                sorted: false,
            },
            {
                key: 'createdAt',
                filterKey: 'createdAt',
                displayName: t('manage:table-created-at'),
                width: '15%',
                sorted: false,
            },
        ];
    }, [t]);
    return (
        <div className="table-docuent-wrap w-full">
            <div className="body-table w-full">

                <div className="flex items-center bg-secondary-50 dark:bg-secondary-800 mt-[10px] px-2">
                    <HeaderTableRender
                        filterKey={''}
                        filterDirection={''}
                        bindingsHeaderTable={bindingsHeaderTable}
                        toggleFilter={() => { }}
                        className="flex items-center bg-secondary-50 dark:bg-secondary-800 table-header sticky py-3 text-xs font-medium"
                        filterPositionSuffix={false}
                    />
                </div>

                <InfiniteScroll
                    fetchMore={() => fetchMore?.()}
                    hasMore={data < 12}
                    isEmpty={!(data && data > 0)}
                    isLoading={isLoading}
                    className={`md:h-[calc(100dvh_-_356px)] h-[256px]' w-full`}

                    emptyMessage={
                        <div className="flex justify-center items-center h-[256px]">
                            <p className="text-gray-500">{t('note:no-data')}</p>
                        </div>
                    }

                >
                    <div className="flex flex-col overflow-y-auto table-insight-wrap">
                        {Array(data).fill(null).map((_, index) => (
                            <div key={index} className="flex items-center bg-secondary-50 dark:bg-secondary-800 mt-[10px] px-2">
                                <div className="flex items-center w-full">
                                    <div className="flex items-center w-[40%]">Item {index + 1}</div>
                                    <div className="flex items-center w-[60%]">Item {index + 1}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                </InfiniteScroll>
            </div>

        </div>
    );
};

export default TableEmailServiceModal;
