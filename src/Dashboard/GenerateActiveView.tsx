import { cn } from '@/lib/utils'
import { PlusCircleIcon, XIcon } from '@heroicons/react/solid'
import { useState } from 'react'
import { CommandItem } from './radix/Command'
import { useTranslation } from 'next-i18next'

interface GenerateActiveViewProps {
  item: {
    name: string
    type: string
    icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
    options: any[]
    backendValue?: string
    decorator?: (value: any) => JSX.Element
    /** optionally takes in t for translating */
    getItemName?: (value: any, t?: any) => any
    filterFunction?: (value: string, search: string) => 0 | 1
    optionIdKey: string
  }
  setOpen: any
  addFilter: (value: string) => void
  option: any
  index: number
  initialChecked?: boolean
  oneSelectable?: boolean
  currentViewSelectedItems?: string[]
  setCurrentViewSelectedItems?: React.Dispatch<React.SetStateAction<string[]>>
  setCreateNewSegmentOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const ActiveViewItem: React.FC<GenerateActiveViewProps> = ({
  item,
  setOpen,
  addFilter,
  option,
  index,
  initialChecked,
  oneSelectable,
  setCreateNewSegmentOpen,
}) => {
  const [isSelected, setIsSelected] = useState(initialChecked || false)
  const { t } = useTranslation()
  return (
    <CommandItem
      className="relative py-0 pl-0 aria-selected:py-0 aria-selected:pl-0"
      value={item?.getItemName ? item?.getItemName(option) : index}
      onSelect={() => {
        if (option._id === 'createNewSegment' && setCreateNewSegmentOpen) {
          setCreateNewSegmentOpen(true)
        } else {
          addFilter(option[item.optionIdKey])
          setIsSelected((p) => !p)
        }
      }}
      onMouseDown={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        onClick={() => {
          // if (oneSelectable) {
          setOpen(false)
          // }
        }}
      ></div>
      {option._id === 'createNewSegment' ? (
        <div className="pl-[11px] py-[8px] mr-[15px]">
          <PlusCircleIcon className="w-4 h-4 secondary-svg" />
        </div>
      ) : (item.optionIdKey ? option[item.optionIdKey] : index) === 'none' ? (
        <div className="pl-[11px] py-[8px] mr-3.5">
          <XIcon className="w-4 h-4 secondary-svg" />
        </div>
      ) : (
        <>
          <div
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            className={cn('pl-[18px] py-[6px] -ml-2 pr-1', 'z-10')}
          >
            <input
              className="mr-2.5 p-2"
              id="combobox"
              aria-describedby="combobox-description"
              name="combobox"
              type="checkbox"
              checked={isSelected}
            />
          </div>
          {item?.decorator && (
            <div className="mr-0.5 flex-shrink-0 z-10 relative">{item?.decorator(option)}</div>
          )}
        </>
      )}
      {item?.getItemName && item?.getItemName(option, t)}
    </CommandItem>
  )
}

export default ActiveViewItem
