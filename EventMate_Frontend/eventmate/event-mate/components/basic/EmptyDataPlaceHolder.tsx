import  EmptyIcon  from '@/public/empty-icon.svg';

export const EmptyDataPlaceHolder = ({
    emptyTitle,
    emptyMessage,
}: {
    emptyTitle?: string;
    emptyMessage?: string;
}) => {
    return (
        <div className="table-empty-container mt-[100px] w-full flex flex-col gap-4 justify-center items-center">
            <div className="w-[320px] flex-col justify-start items-center gap-1 flex">
                
                <div className="text-center dark:text-white text-xl font-semibold  leading-7">
                    {emptyTitle}
                </div>
                <div className="self-stretch text-center text-base font-normal leading-normal">
                    {emptyMessage}
                </div>
            </div>
        </div>
    );
};
