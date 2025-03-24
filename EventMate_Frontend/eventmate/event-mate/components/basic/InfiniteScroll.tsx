/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import classNames from '@/ultilities/common/classNames';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import AnimationPing from './AnimationPing';
import { TClassName } from '@/types/common';

export interface IInfiniteScrollProps {
    children?: React.ReactNode;
    skeleton?: React.ReactNode;
    hasMore: boolean;
    fetchMore: () => Promise<void> | void;
    className?: TClassName;
    endMessage?: React.ReactNode;
    emptyMessage?: React.ReactNode;
    isEmpty?: boolean;
    retrySearchAgain?: boolean;
    hiddenScroll?: boolean;
    isLoading: boolean;
    style?: React.CSSProperties;
    forceScrollTop?: boolean;
    hasMaxHeight?: boolean;
    refreshScroll?: number;
    scrollEffect?: boolean;
    preventScrollItemBottom?: boolean; // prevent handleScroll function. dont need to scroll bottom in before end item
    onScrollEventHandler?: Function;
}

const InfiniteScroll = forwardRef<HTMLDivElement | null, IInfiniteScrollProps>(
    (
        {
            children,
            skeleton,
            hasMore,
            fetchMore,
            className,
            endMessage = '',
            emptyMessage = '',
            isEmpty = false,
            retrySearchAgain = false,
            hiddenScroll = false,
            isLoading = false,
            hasMaxHeight = true,
            style,
            forceScrollTop,
            refreshScroll,
            scrollEffect = false,
            preventScrollItemBottom = false,
            onScrollEventHandler,
        },
        ref
    ) => {
        const pageEndRef = useRef(null);
        const container = useRef<HTMLDivElement>(null);
        const preventFixBottomScrollRef = useRef<HTMLDivElement>(null);
        const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

        const isInitialLoad = isLoading && isEmpty;
        const loadingSpiner = !isFirstLoad;
        const loadingSkeleton = !!skeleton;
        const isHaveNoData = isEmpty && !isLoading;

        const [borderTopClass, setBorderTopClass] = useState<string>('');
        const [borderBottomClass, setBorderBottomClass] = useState<string>('');

        useEffect(() => {
            const scrollContainer = container.current;
            if (
                !scrollContainer ||
                !preventFixBottomScrollRef.current ||
                !hasMore ||
                preventScrollItemBottom
            )
                return;
            scrollContainer.addEventListener('scroll', handleScroll);

            return () => {
                scrollContainer?.removeEventListener('scroll', handleScroll);
            };
        }, [container, preventFixBottomScrollRef, hasMore]);

        useEffect(() => {
            const scrollContainer = container.current;
            if (!scrollContainer || !scrollEffect || hasMore) return;
            if (scrollContainer && scrollContainer.scrollHeight > scrollContainer.clientHeight) {
                setBorderBottomClass(
                    'border-b border-secondary-800/60 dark:border-secondary-200/60'
                );
            }
            scrollContainer.addEventListener('scroll', handleScrollEffect);

            return () => {
                scrollContainer?.removeEventListener('scroll', handleScrollEffect);
            };
        }, [container, hasMore, scrollEffect]);

        const handleScroll = (event: any) => {
            const { scrollHeight, scrollTop, clientHeight } = event.target;
            // Scroll up a bit when user scroll to bottom to avoid infinite loading
            if (Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
                const previousElement: any = preventFixBottomScrollRef.current?.previousSibling;
                previousElement?.scrollIntoView({
                    block: 'end',
                });
            }
        };

        const handleScrollEffect = (event: any) => {
            const { scrollHeight, scrollTop, clientHeight } = event.target;
            if (scrollHeight - scrollTop - clientHeight < 10) {
                setBorderBottomClass('border-b-none');
            } else {
                setBorderBottomClass(
                    'border-b border-secondary-800/60 dark:border-secondary-200/60'
                );
            }
            if (scrollTop < 10 && scrollTop >= 0) {
                setBorderTopClass('border-t-none');
            } else if (scrollTop > 10) {
                setBorderTopClass('border-t border-secondary-800/60 dark:border-secondary-200/60');
            }
        };

        const renderSkeleton = () => {
            return (
                <div className={`${loadingSpiner && 'flex justify-center'}`}>
                    {(loadingSpiner || loadingSkeleton) && skeleton ? skeleton : <AnimationPing />}
                </div>
            );
        };

        useImperativeHandle(ref, () => {
            return container.current as HTMLDivElement;
        });

        useEffect(() => {
            if (forceScrollTop) {
                container.current?.scrollTo({
                    top: 0,
                });
            }
        }, [forceScrollTop, refreshScroll]);

        useEffect(() => {
            const pageEnd = pageEndRef.current;
            if (hasMore ) {
                // it only run when hasMore or isLoading update
                const optionsObserver: { root: HTMLDivElement | null; rootMargin: string } = {
                    root: null,
                    rootMargin: '0px', //observer triggers when target is 50px from the bottom
                };
              
                const observer = new IntersectionObserver(
                    (entries) => {
                        if (entries[0].isIntersecting) {
                            // Check if pageEnd element is in viewport,
                            fetchMore();
                            setIsFirstLoad(false);
                        }
                    },
                    {
                        ...optionsObserver,
                    }
                );

                if (pageEnd) {
                    observer.observe(pageEnd);
                }

                return () => {
                    if (pageEnd) {
                        observer.unobserve(pageEnd);
                    }
                };
            }
        }, [hasMore, isLoading, hasMaxHeight]);

        const infiniteScrollClass = classNames(
            'overflow-y-auto overflow-x-hidden min-h-[50px] scrollbar-gutter-stable',
            className,
            scrollEffect && borderTopClass,
            scrollEffect && borderBottomClass,
            hiddenScroll && 'scrollbar-hide'
        );
        const shouldRenderChildren = !isHaveNoData && !retrySearchAgain;

        return (
            <>
                {/* Conditional render by hidden to avoid rerender children when refetch */}
                <div
                    className={classNames(infiniteScrollClass, shouldRenderChildren && 'hidden')}
                    style={style}
                    onScroll={(event: any) => onScrollEventHandler?.(event)}
                >
                    {isHaveNoData ? emptyMessage : retrySearchAgain && renderSkeleton()}
                </div>

                <div
                    className={classNames(infiniteScrollClass, !shouldRenderChildren && 'hidden')}
                    style={style}
                    ref={container}
                    onScroll={(event: any) => onScrollEventHandler?.(event)}
                >
                    {children}
                    <div ref={preventFixBottomScrollRef} className="min-h-[5px]">
                        {isLoading && (hasMore || isInitialLoad) && renderSkeleton()}
                    </div>
                    {endMessage && <div className={classNames('py-4')}>{endMessage}</div>}

                    <div
                        ref={pageEndRef}
                        className={classNames('opacity-0', !hasMore && 'h-0 hidden')}
                    >
                        load more element hidden
                    </div>
                </div>
            </>
        );
    }
);

InfiniteScroll.displayName = 'InfiniteScroll';

export default InfiniteScroll;
