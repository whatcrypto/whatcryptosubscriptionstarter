'use client';

import { cn } from '@/lib/utils';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  message: ReactNode;
  children: ReactNode;
  className?: string;
  tooltipClassName?: string;
  align?: 'start' | 'center' | 'end';
  triggerContainerClassName?: string;
}

type ReadonlyTooltipProps = Readonly<TooltipProps>;

/**
 *
 * @deprecated Use CustomTooltip instead
 */
export function CustomTooltipV1({
  message,
  children,
  className,
  tooltipClassName: containerClassName,
  align = 'center', // Default alignment is 'center'
}: ReadonlyTooltipProps) {
  // Determine the alignment class based on the align prop
  const alignmentClass =
    align === 'start'
      ? 'left-0 translate-x-0'
      : align === 'end'
        ? 'right-0 translate-x-0'
        : 'left-1/2 translate-x-[-50%]'; // Center as default

  const tooltipClassName = cn(
    `absolute top-5 scale-0 transition-all px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 group-hover/popup:scale-100 cursor-pointer overflow-hidden rounded-[4px] border border-[#E7E9EC] dark:border-[#2F3037] bg-[#fff] dark:bg-[#1a1a20] ${alignmentClass}`,
    containerClassName,
  );

  return (
    <div className="group/popup relative flex before:absolute before:top-0 before:block before:h-[100%] before:w-full before:translate-y-[-50%] after:absolute after:bottom-0 after:block after:h-[100%] after:w-full after:translate-y-[50%]">
      <span className="cursor-pointer">{children}</span>
      <span className={`${tooltipClassName} ${className ?? ''}`}>
        {message}
      </span>
    </div>
  );
}

type TTooltipPosition = {
  top: number;
  left: number;
};

const CustomTooltip = ({
  message,
  children,
  className = '',
  tooltipClassName = '',
  align = 'center', // Default alignment is 'center'
  triggerContainerClassName = '',
}: ReadonlyTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<TTooltipPosition>({
    left: 0,
    top: 0,
  });
  const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined);

  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const setVisibleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to calculate and set tooltip position
  const calculatePosition = useCallback(
    ({ dryRun = false } = {}) => {
      if (triggerRef.current && tooltipRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate tooltip top and left position based on the alignment
        let tooltipTop = triggerRect.bottom + window.scrollY + 15; // below trigger
        let tooltipLeft;

        if (align === 'start') {
          tooltipLeft = triggerRect.left + window.scrollX;
        } else if (align === 'end') {
          tooltipLeft = triggerRect.right + window.scrollX - tooltipRect.width;
        } else {
          // Center alignment
          tooltipLeft =
            triggerRect.left +
            window.scrollX +
            triggerRect.width / 2 -
            tooltipRect.width / 2;
        }

        // Ensure the tooltip doesn't overflow the viewport
        // Adjust left if it's going out of the viewport
        if (tooltipLeft + tooltipRect.width > viewportWidth) {
          tooltipLeft = viewportWidth - tooltipRect.width - 10; // padding from edge
        }

        if (tooltipLeft < 0) {
          tooltipLeft = 10; // padding from edge
        }

        // Adjust top if tooltip would be cut off by the bottom edge of the viewport
        if (tooltipTop + tooltipRect.height > viewportHeight) {
          tooltipTop =
            triggerRect.top + window.scrollY - tooltipRect.height - 15; // Position above trigger
        }

        // Set maximum width for the tooltip to avoid horizontal overflow
        const calculatedMaxWidth = viewportWidth - 20; // padding total (half on each side)
        setMaxWidth(calculatedMaxWidth);

        setTooltipPosition({ top: tooltipTop, left: tooltipLeft });

        if (!dryRun) {
          // Set timeout to show tooltip after 250ms
          // This is necessary to avoid flicker
          setVisibleTimeoutRef.current = setTimeout(
            () => setIsVisible(true),
            250,
          );
        }
      }
    },
    [align],
  );

  // Handle click outside to close tooltip
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      !tooltipRef.current ||
      tooltipRef.current.contains(event.target as Node)
    ) {
      return;
    }

    if (
      !triggerRef.current ||
      triggerRef.current.contains(event.target as Node)
    ) {
      return;
    }

    handleClose();
  }, []);

  const handleOpen = () => {
    setIsRendered(true);
  };

  const handleClose = () => {
    if (setVisibleTimeoutRef.current) {
      clearTimeout(setVisibleTimeoutRef.current);
    }

    setIsRendered(false);
    setIsVisible(false);
  };

  useEffect(() => {
    // This will be useful when the tooltip element is NOT rendered conditionally.
    // Use this to get the initial position of the tooltip element
    calculatePosition({ dryRun: true });

    return () => {
      if (setVisibleTimeoutRef.current) {
        clearTimeout(setVisibleTimeoutRef.current);
      }
    };
  }, [calculatePosition]);

  useEffect(() => {
    if (isRendered) {
      calculatePosition();
    }
  }, [calculatePosition, isRendered]);

  // Effect to add/remove event listener for clicks outside.
  useEffect(() => {
    if (isRendered) {
      document.addEventListener('pointerdown', handleClickOutside);
    } else {
      document.removeEventListener('pointerdown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [handleClickOutside, isRendered]);

  // Tooltip component rendered through portal
  const tooltipElement = isRendered ? (
    <div
      ref={tooltipRef}
      className={cn(
        'absolute z-50 rounded-[4px] border bg-[#fff] px-3 py-1.5 text-sm text-popover-foreground shadow-md transition-all dark:border-[#2F3037] dark:bg-[#1a1a20]',
        tooltipClassName,
        className,
      )}
      style={{
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
        visibility: isVisible ? 'visible' : 'hidden',
        opacity: isVisible ? 1 : 0,
        maxWidth: `${maxWidth}px`,
      }}
    >
      {message}
    </div>
  ) : null;

  return (
    <>
      <div
        className={cn(
          'relative flex cursor-pointer',
          triggerContainerClassName,
        )}
        ref={triggerRef}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        onClick={() => {
          if (isRendered) {
            handleClose();
          } else {
            handleOpen();
          }
        }}
      >
        <span>{children}</span>
      </div>
      {createPortal(tooltipElement, document.body)}
    </>
  );
};

export default CustomTooltip;
