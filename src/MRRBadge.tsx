import React from 'react'
import Tooltip from './Tooltip'

const MRRBadge: React.FC<{ mrr: string; small?: boolean; customRevenueText?: string }> = ({
  mrr,
  small,
  customRevenueText,
}) => {
  return (
    <Tooltip
      noAlignment={true}
      notCentered={true}
      child={
        <div
          className={
            small
              ? 'text-xs inline-flex space-x-1  cursor-help items-center font-semibold text-gray-400 dark:text-foreground'
              : 'px-2 py-1 public-category flex  cursor-help items-center text-gray-400 dark:text-foreground undefined text-xs truncate font-medium  border-gray-100/50 bg-gray-50/50  dark:bg-secondary dark:border-border/70 dark:shadow-sm  false rounded-md border '
          }
        >
          <span className="dark:text-indigo-300 text-indigo-500 mr-1.5">$</span> {mrr}
        </div>
      }
      dropDown={
        <p className="text-[11px] text-gray-500 dark:text-foreground font-medium">
          {customRevenueText ? customRevenueText : 'Combined upvoter MRR is '}{' '}
          <span className="font-semibold dark:text-gray-100">${mrr}</span>
        </p>
      }
    />
  )
}

export default MRRBadge
