'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash'; // Make sure to install lodash: npm install lodash  
import { useDebounceFn } from "@/lib/debounceFn"; // Assuming you have this  
import InfiniteScroll from "@/components/basic/InfiniteScroll"; // Assuming you have this  
import { TableSkeleton } from "@/components/basic/Table"; // Assuming you have this  
import { Button } from "@/components/common/button"; // Assuming you have this  
import Input from "@/components/common/Input"; // Assuming you have this  
import HeaderTableRender from "@/components/basic/HeaderTableRender"; // Assuming you have this  
// import { useLanguage } from "@/providers/LanguageProvider"; // Uncomment if you want i18n  
import { useMemo } from "react";
import { useUserContext } from '@/providers/UserProvider';
import { GroupRepository } from '@/repositories/GroupRepository';

interface Group {
    groupId: string;
    img: string | null;
    groupName: string;
    createdAt: string;
    totalMember: number;
}
type SortKey = 'groupName' | 'createdAt' | 'totalMember' | '';  
interface GroupListProps {  
    userId: string; // Receive the userId as a prop  
}  

const GroupList: React.FC<GroupListProps> = ({ userId })  => {
        const { id, email } = useUserContext();  
    
    const router = useRouter();
    // const { t } = useLanguage(); // Uncomment if you want i18n  
    const [groups, setGroups] = useState<Group[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<SortKey>('');  
    const [ascending, setAscending] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [pageSize] = useState(5); // Fixed page size  
    // const [filter, setFilter] = useState<RequestList>();
    const [retryCall, setRetryCall] = useState<number>(0);

    const fetchGroups = async () => {
        try {
            setIsLoading(true);
            const response = await GroupRepository.getAllGroupByUserId(  
                userId,  
                searchTerm,  
                sortBy as SortKey,  
                ascending,  
                currentPage,  
                pageSize  
            );  

            if (response.status==200) {
                const data = await response;
                if (currentPage === 1) {
                    setGroups(data.data.data); // Reset groups on first page  
                } else {
                    setGroups(prevGroups => [...prevGroups, ...data.data.data]); // Append data on subsequent pages  
                }
                setTotalCount(data.data.totalCount);
            } else {
                console.error('Failed to fetch groups');
            }
        } catch (error) {
            console.error('Error fetching groups:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, [searchTerm, sortBy, ascending, currentPage, retryCall]); // Added dependencies  


    const handlePageLoadMore = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    // const handleChangeSearch = (value: string) => {
    //     const filerTmp = { ...filter || {} };
    //     filerTmp.keySearch = value || '';
    //     setFilter(filerTmp as RequestList);
    //     setSearchTerm(value);
    //     debouncedSearch.cancel();
    //     debouncedSearch(value);
    // };
    const debouncedSearch = useCallback(
        debounce((key: string) => {

            handleSubmitFilter();
        }, 600),
        []
    );
    const { run: handleSubmitFilter } = useDebounceFn(() => {
        setCurrentPage(1);
        setRetryCall(new Date().getTime());

    });

    const handleSort = (key:string) => {  
        if (sortBy === key) {  
            // If sorting by the same key, toggle the sort order  
            setAscending(!ascending);  
        } else {  
            // If sorting by a different key, set the new key and default to ascending  
            setSortBy(key as SortKey);  
            setAscending(true);  
        }  
    };  
    const baseHeaders = useMemo(
        () => [
            {
                key: 'groupName',
                filterKey: 'groupName',
                displayName: 'Group Name', //t('group:group-name') if you uncomment i18n  
                width: '40%',
                sorted: true,
            },
            {
                key: 'image',
                filterKey: 'Image',
                displayName: 'Image', //t('group:group-name') if you uncomment i18n  
                width: '40%',
                sorted: true,
            },
            {
                key: 'createdAt',
                filterKey: 'createdAt',
                displayName: 'Created At', //t('group:created-at')  if you uncomment i18n  
                width: '30%',
                sorted: true,
            },
            {
                key: 'totalMember',
                filterKey: 'totalMember',
                displayName: 'Total Members', //t('group:total-members') if you uncomment i18n  
                width: '30%',
                sorted: false,

            },
        ],
        []
    );

    return (  
        <div className="w-full p-4 bg-white dark:bg-black text-black dark:text-white"> {/* Main container: Black/White background and text */}  
            <div className="flex items-center md:flex-row md:justify-between flex-col relative mb-8"> {/* Increased margin bottom */}  
                <div className="w-full items-center flex flex-wrap mb-5">  
                    <div className="text-2xl font-semibold leading-7 inline-flex text-gray-800 dark:text-gray-200"> {/* Larger title, adjusted color */}  
                        <span>Group List</span>  
                    </div>  
                </div>  
            </div>  

            <div className="mb-6"> {/* Increased margin bottom */}  
                <div className="flex flex-wrap items-center gap-3"> {/* Reduced gap slightly */}  
                    {/* Search Input (Optional) */}  
                    {/* <div className="w-[400px]">  
                        <Input  
                            className="w-full !h-11 pr-8 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white" // Added dark mode styling  
                            type="text"  
                            name="name"  
                            value={searchTerm}  
                            onChange={(e) => { handleChangeSearch(e.target.value) }}  
                            placeholder="Search by group name"  
                        />  
                    </div> */}  
                    <div className="">  
                        <Button  
                            className="max-h-11 bg-gray-800 hover:bg-gray-700 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-black"  // Styled button  
                            label="Search"  
                            disabled={isLoading}  
                            type="button"  
                            onClickButton={handleSubmitFilter}  
                        />  
                    </div>  
                </div>  
            </div>  

            <div className="mt-6 mb-4"> {/* Increased margin top */}  
                <div className="flex items-center bg-gray-100 dark:bg-gray-900 mt-[10px] border-b border-gray-200 dark:border-gray-800"> {/* Table Header styling */}  
                    <HeaderTableRender  
                        filterKey={''}  
                        filterDirection={''}  
                        bindingsHeaderTable={baseHeaders}  
                        toggleFilter={() => { }}  
                        className="flex items-center py-3 text-sm font-medium text-gray-700 dark:text-gray-300" // Adjusted text color  
                        filterPositionSuffix={false}  

                    />  
                </div>  

                <div className="mt-4 pl-0"> {/* Removed left padding */}  
                    <InfiniteScroll  
                        className={`w-full md:pb-[20px] max-h-[calc(100vh-300px)]`}  
                        fetchMore={handlePageLoadMore}  
                        hasMore={groups.length < totalCount}  
                        isEmpty={groups.length === 0 && !isLoading}  
                        isLoading={isLoading}  
                        retrySearchAgain={currentPage === 1 && isLoading}  
                        skeleton={<TableSkeleton bindings={baseHeaders} />}  
                        hasMaxHeight={false}  
                        forceScrollTop={false}  
                        emptyMessage={  
                            <div className="flex justify-center items-center h-[256px] text-gray-500 dark:text-gray-500"> {/* Adjusted text color */}  
                                <span>No groups found.</span>  
                            </div>  
                        }  
                    >  
                        {groups.map((group) => (  
                            <div  
                                key={group.groupId}  
                                className={`w-full overflow-hidden cursor-pointer min-h-[56px] hover:bg-gray-50 dark:hover:bg-gray-950 border-b-[1px] border-gray-200 dark:border-gray-800 group/kb-card py-3 flex items-center transition-colors`} // Hover effect and border  
                                onClick={() => router.push(`/group/group-detail/${group.groupId}`)}  
                            >  
                                {/* Group Image */}  
                                <div className="w-full flex justify-center mb-2"> {/* Centered image */}  
                                    <img  
                                        src={group.img||""} // Use actual image URL or placeholder  
                                        alt={group.groupName}  
                                        className="rounded-md object-cover h-24 w-24" // Adjust size as needed; object-cover maintains aspect ratio  
                                    />  
                                </div>  

                                <div className={`flex w-[40%] items-start text-gray-700 dark:text-gray-300 group`}> {/* Adjusted text color */}  
                                    <span className="text-lg font-medium leading-6 max-h-[72px] text-ellipsis line-clamp-3 max-w-[200px]">{group.groupName}</span> {/* Larger font size */}  
                                </div>  

                                <div className={`flex w-[30%] items-start text-gray-500 dark:text-gray-500 group`}> {/* Adjusted text color */}  
                                    <span className="text-sm font-normal leading-6 max-h-[72px] text-ellipsis line-clamp-3 max-w-[200px]">  
                                        {new Date(group.createdAt).toLocaleDateString()}  
                                    </span>  
                                </div>  

                                <div className={`flex w-[30%] items-start text-gray-500 dark:text-gray-500 group`}> {/* Adjusted text color */}  
                                    <span className="text-sm font-normal leading-6 max-h-[72px] text-ellipsis line-clamp-3 max-w-[200px]">  
                                        {group.totalMember}  
                                    </span>  
                                </div>  
                            </div>  
                        ))}  
                    </InfiniteScroll>  
                </div>  
            </div>  
        </div>  
    );  
};  

export default GroupList;  