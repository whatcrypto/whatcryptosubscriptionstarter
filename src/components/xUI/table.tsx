'use client';

import { cn } from '@/lib/utils';
import clsx from 'clsx';
import * as React from 'react';

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & { containerClassName?: string }
>(({ className, containerClassName, children, ...props }, ref) => (
  <div className={clsx('relative w-full', containerClassName)}>
    <table
      ref={ref}
      className={cn('w-full caption-bottom overflow-auto text-sm', className)}
      {...props}
    >
      {children}
    </table>
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & {
    sticky?: { offset: number; anchorId?: string };
  }
>(({ className, sticky, ...props }, ref) => {
  const { offset: stickyOffsetProp, anchorId } = sticky ?? {};

  const internalRef = React.useRef<HTMLTableSectionElement>(null);
  const stickyHeaderRef = React.useRef<HTMLTableSectionElement>(null);

  const [stickyHeaderOffset, setStickyHeaderOffset] = React.useState<number>(0);

  const stickyOffset = stickyOffsetProp || stickyHeaderOffset;

  const doSetStickyHeaderOffset = React.useCallback(() => {
    const stickyHeaderAnchor = document.getElementById(
      anchorId || 'table-header-sticky-anchor',
    ) as HTMLDivElement;

    if (!stickyHeaderAnchor) return;

    const stickyHeaderAnchorRect = stickyHeaderAnchor?.getBoundingClientRect();

    const stickyHeaderOffset =
      (stickyHeaderAnchorRect?.height || 0) +
      (stickyHeaderAnchorRect?.top || 0);

    setStickyHeaderOffset(stickyHeaderOffset);
  }, [anchorId]);

  React.useLayoutEffect(() => {
    doSetStickyHeaderOffset();

    globalThis.addEventListener('scroll', doSetStickyHeaderOffset);

    return () => {
      globalThis.removeEventListener('scroll', doSetStickyHeaderOffset);
    };
  }, [doSetStickyHeaderOffset]);

  const [shouldShowStickyHeader, setShouldShowStickyHeader] =
    React.useState(false);
  const [scrollContainer, setScrollContainer] =
    React.useState<HTMLElement | null>(null);

  React.useImperativeHandle(ref, () => internalRef.current as any);

  const syncHeaderWidth = React.useCallback(() => {
    if (!sticky) return;

    const headerThs = internalRef.current?.querySelectorAll('th');
    const stickyHeaderThs = stickyHeaderRef.current?.querySelectorAll('th');

    if (!headerThs?.length || !stickyHeaderThs?.length) return;

    stickyHeaderRef.current!.style.width = `${scrollContainer?.clientWidth}px`;

    headerThs.forEach((th, i) => {
      const stickyHeaderTh = stickyHeaderThs[i];
      stickyHeaderTh.style.minWidth = `${th.clientWidth}px`;
      stickyHeaderTh.style.width = `${th.clientWidth}px`;
    });
  }, [scrollContainer?.clientWidth, sticky]);

  React.useLayoutEffect(() => {
    return syncHeaderWidth();
  }, [syncHeaderWidth]);

  React.useLayoutEffect(() => {
    if (!sticky) return;

    const scrollContainer = internalRef.current?.closest('.overflow-x-scroll');

    setScrollContainer(scrollContainer as HTMLElement);
  }, [sticky]);

  const syncScrollPosition = React.useCallback(() => {
    if (!sticky || !scrollContainer || !stickyHeaderRef.current) return;

    const handleScrollContainerScroll = () => {
      stickyHeaderRef.current!.scrollLeft = scrollContainer.scrollLeft;
    };
    const handleStickyHeaderScroll = () => {
      scrollContainer.scrollLeft = stickyHeaderRef.current!.scrollLeft;
    };

    scrollContainer.addEventListener('scroll', handleScrollContainerScroll);
    stickyHeaderRef.current.addEventListener(
      'scroll',
      handleStickyHeaderScroll,
    );

    return () => {
      window.removeEventListener('scroll', handleScrollContainerScroll);
      stickyHeaderRef.current!.removeEventListener(
        'scroll',
        handleStickyHeaderScroll,
      );
    };
  }, [sticky, scrollContainer]);

  React.useLayoutEffect(() => {
    return syncScrollPosition();
  }, [syncScrollPosition]);

  React.useLayoutEffect(() => {
    const handleResize = () => {
      syncHeaderWidth();
      syncScrollPosition();
    };

    globalThis.addEventListener('resize', handleResize);

    return () => globalThis.removeEventListener('resize', handleResize);
  }, [syncHeaderWidth, syncScrollPosition]);

  const checkShouldShowStickyHeader = React.useCallback(() => {
    if (!sticky || !stickyHeaderRef.current) return;

    const table = internalRef.current?.closest('table');

    const handleScroll = () => {
      if (!table) return;

      const { top, height } = table.getBoundingClientRect();

      const shouldShowStickyHeader =
        top < (stickyOffset || 0) &&
        stickyHeaderRef.current!.clientHeight + (stickyOffset || 0) <
          height + top;

      setShouldShowStickyHeader(shouldShowStickyHeader);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sticky, stickyOffset]);

  React.useLayoutEffect(() => {
    return checkShouldShowStickyHeader();
  }, [checkShouldShowStickyHeader]);

  if (!sticky)
    return (
      <thead
        ref={internalRef}
        className={cn('[&_tr]:border-b', className)}
        {...props}
      />
    );

  return (
    <>
      <thead
        ref={stickyHeaderRef}
        style={{ top: stickyOffset, width: scrollContainer?.clientWidth }}
        className={cn(
          'hide-scrollbar z-[18] overflow-x-auto',
          shouldShowStickyHeader ? 'fixed' : 'absolute !left-0 !top-0',
          '[&_tr]:border-b',
          className,
        )}
        {...props}
        data-testid="table-header"
      />
      <thead ref={internalRef} className={cn('!invisible !-z-10')} {...props} />
    </>
  );
});
TableHeader.displayName = 'TableHeader';

const TableHeaderStickyAnchor = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    id="table-header-sticky-anchor"
    className={cn('absolute h-0 w-0', className)}
    {...props}
  />
));
TableHeaderStickyAnchor.displayName = 'TableHeaderStickyAnchor';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn('group hover:text-accent-foreground', className)}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 bg-[#F2F4FA] px-4 py-4 text-left align-middle font-medium text-muted-foreground dark:bg-[#111116] [&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'p-4 align-middle transition-colors group-hover:bg-secondary-background [&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableHeaderStickyAnchor,
  TableRow,
};
