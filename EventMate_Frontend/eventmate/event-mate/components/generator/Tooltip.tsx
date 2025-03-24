'use client';

import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Tooltip as ReactTooltip, ITooltip } from 'react-tooltip';

import 'react-tooltip/dist/react-tooltip.css';

export type PlacesType =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end';


    export interface ITooltipProps extends ITooltip {
        children?: React.ReactNode;
        alwaysEnabled?: boolean;
    }
    
    const Tooltip = ({ children, className, ...props }: ITooltipProps) => {
        const tooltipClassName = `custom-tooltip no-scrollbar ${className}`;
    const [isTooltipVisible, setIsTooltipVisible] = useState<boolean | undefined>(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleAfterHide = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsTooltipVisible(false);
    };


    return createPortal(
        <ReactTooltip
            className={tooltipClassName}
            delayHide={0}
            delayShow={500}
            opacity={1}
            openEvents={{
                mouseenter: true,
                focus: false,
                click: false,
                dblclick: false,
                mousedown: false,
            }}
            closeEvents={{
                click: true,
                mouseleave: true,
                mouseup: true,
                dblclick: true,
                blur: true,
            }}
            closeOnScroll={true}
            hidden={ isTooltipVisible}
            afterHide={handleAfterHide}
            {...props}
        >
            {children}
        </ReactTooltip>,
        document?.body
    );
};

export default Tooltip;
