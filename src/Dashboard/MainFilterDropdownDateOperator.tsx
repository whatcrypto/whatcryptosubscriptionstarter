import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './radix/DropdownMenu'
import { SelectorIcon } from '@heroicons/react/solid'
import { getOperatorDisplayValue } from './FilterTabElement'
import { Calendar } from './radix/Calendar'
import { v4 as uuid } from 'uuid'
import { Trans, useTranslation } from 'next-i18next'

const MainFilterDropdownDateOperator: React.FC<{
  filterText: string
  filter: any
  addFilter: (
    type: string,
    multiSelectable: boolean | undefined,
    value: string,
    operator: string | undefined,
    uuid: string
  ) => void
  closeComboBox: () => void
}> = ({ filterText, addFilter, closeComboBox, filter }) => {
  const [operator, setOperator] = React.useState('lte')
  const { t } = useTranslation()
  const operatorDisplayValue = getOperatorDisplayValue(t, operator, 'date')
  const translatedFilterName = t(filter.key)
  const DropdownComponent = () => (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="inline-flex p-1 ml-1.5 dashboard-secondary">
        {getOperatorDisplayValue(t, operator, 'date')}
        <span className="ml-1">
          <SelectorIcon className="w-4 h-4 text-background-accent/60 dark:text-background-accent" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32" align="end">
        <DropdownMenuItem onSelect={() => setOperator('lte')}>{t('before')}</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setOperator('gte')}>{t('after')}</DropdownMenuItem>
        {filterText === 'ETA' && (
          <DropdownMenuItem
            onSelect={() => {
              setOperator('!exists')
              addFilter(filter.backendValue, filter?.multiSelectable, '', '!exists', uuid())
              closeComboBox()
            }}
          >
            {t('not-set')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div>
      <p className="pb-3 -mx-3 text-sm font-medium text-center border-b text-background-accent dark:border-border border-gray-100/60 dark:text-gray-100">
        <Trans
          i18nKey="filter-is-before-after-or-not-set"
          components={[<DropdownComponent key="0" />]}
          values={{ filterName: translatedFilterName }}
        />
      </p>

      <Calendar
        mode="single"
        onSelect={(date) => {
          if (date) {
            addFilter(
              filter.backendValue,
              filter?.multiSelectable,
              new Date(date).toISOString(),
              operator,
              uuid()
            )
          }
          closeComboBox()
        }}
        initialFocus
        showQuarterButtons={true}
      />
    </div>
  )
}

export default MainFilterDropdownDateOperator
