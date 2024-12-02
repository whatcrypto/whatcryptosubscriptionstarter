import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './radix/Popover'
import { IconPicker } from './iconpicker/IconPicker'
import { IHelpCenterIcon } from '@/interfaces/IHelpCenter'

const IconPickerPopover: React.FC<{
  trigger: any
  // @ts-ignore
  onSelect: (icon: string, type: IHelpCenterIcon['type']) => void
}> = ({ trigger, onSelect }) => {
  const [open, setOpen] = useState(false)
  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
      }}
    >
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="start" className="w-72">
        <IconPicker
          onSelect={(icon, type) => {
            setOpen(false)
            // @ts-ignore
            onSelect(icon, type)
          }}
          library="outline"
        />
      </PopoverContent>
    </Popover>
  )
}

export default IconPickerPopover
