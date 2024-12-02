import { Icon } from '@/components/editor/components/ui/Icon'
import type icons from 'lucide-react'
import { useMemo } from 'react'
import { DropdownButton } from '@/components/editor/components/ui/Dropdown'
import { PopoverContent, PopoverTrigger, Popover } from '@/components/radix/Popover'
import { Button } from '@/components/radix/Button'
import { CheckIcon } from '@heroicons/react/solid'

export type ContentTypePickerOption = {
  label: string
  id: string
  type: 'option'
  disabled: () => boolean
  isActive: () => boolean
  hideOnCompact?: boolean
  onClick: () => void
  icon: keyof typeof icons
}

export type ContentTypePickerCategory = {
  label: string
  id: string
  type: 'category'
}

export type ContentPickerOptions = Array<ContentTypePickerOption | ContentTypePickerCategory>

export type ContentTypePickerProps = {
  options: ContentPickerOptions
  compactMode?: boolean
}

const isOption = (
  option: ContentTypePickerOption | ContentTypePickerCategory
): option is ContentTypePickerOption => option.type === 'option'
const isCategory = (
  option: ContentTypePickerOption | ContentTypePickerCategory
): option is ContentTypePickerCategory => option.type === 'category'

export const ContentTypePicker = ({ options, compactMode }: ContentTypePickerProps) => {
  const activeItem = useMemo(
    () => options.find((option) => option.type === 'option' && option.isActive()),
    [options]
  )

  return (
    // <Dropdown.Root>
    //   <Dropdown.Trigger asChild>
    //     <Toolbar.Button active={activeItem?.id !== 'paragraph' && !!activeItem?.type}>
    // <Icon name={(activeItem?.type === 'option' && activeItem.icon) || 'Pilcrow'} />
    // <Icon name="ChevronDown" className="w-2 h-2" />
    //     </Toolbar.Button>
    //   </Dropdown.Trigger>
    //   <Dropdown.Portal>
    //     <Dropdown.Content asChild>
    //       <Surface className="flex flex-col gap-1 px-0 w-48 py-2.5">
    // {options.map((option) => {
    //   if (isOption(option)) {
    //     return (
    //       <DropdownButton
    //         key={option.id}
    //         onClick={option.onClick}
    //         isActive={option.isActive()}
    //       >
    //         <Icon name={option.icon} className="mr-1 secondary-svg" />
    //         {option.label}
    //       </DropdownButton>
    //     )
    //   } else if (isCategory(option)) {
    //     return (
    //       <div className="mt-2 first:mt-0" key={option.id}>
    //         <DropdownCategoryTitle key={option.id}>{option.label}</DropdownCategoryTitle>
    //       </div>
    //     )
    //   }
    // })}
    //       </Surface>
    //     </Dropdown.Content>
    //   </Dropdown.Portal>
    // </Dropdown.Root>
    (<Popover modal={false}>
      <PopoverTrigger
        asChild
        className="gap-2 text-gray-500 border-none rounded-none hover:bg-secondary-foreground/5 dark:text-secondary-foreground focus:ring-0"
      >
        <Button size="sm" variant="ghost" className="gap-2">
          {/* @ts-ignore */}
          <Icon name={(activeItem?.type === 'option' && activeItem.icon) || 'Pilcrow'} />
          <Icon name="ChevronDown" className="w-2 h-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-48 gap-0.5">
        {/* {items.map((item, index) => (
        <EditorBubbleItem
          key={index}
          onSelect={(editor) => {
            item.command(editor)
            onOpenChange(false)
          }}
          className="flex cursor-pointer items-center justify-between rounded-sm py-1.5 text-sm dropdown-item"
        >
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-sm bg-white/5">
              <item.icon className="w-3 h-3" />
            </div>
            <span>{item.name}</span>
          </div>
          {activeItem.name === item.name && <Check className="w-4 h-4" />}
        </EditorBubbleItem>
      ))} */}
        <div className="p-1 flex flex-col gap-0.5">
          {options.map((option, index) => {
            if (isOption(option)) {
              if (compactMode && option?.hideOnCompact) return null
              return (
                <DropdownButton
                  className="justify-between w-full mx-0 focus:ring-0"
                  key={option.id}
                  onClick={option.onClick}
                  isActive={option.isActive()}
                >
                  <div className="flex items-center space-x-2">
                    <div className="p-1 rounded-sm bg-white/5">
                      {/* @ts-ignore */}
                      <Icon name={option.icon} className="w-3 h-3 secondary-svg" />
                    </div>
                    <span> {option.label}</span>
                  </div>
                  {option.isActive() && <CheckIcon className="w-4 h-4" />}
                </DropdownButton>
              )
            }
            // else if (isCategory(option)) {
            //   return (
            //     <div className="mt-2 first:mt-0" key={option.id}>
            //       <DropdownCategoryTitle key={option.id}>{option.label}</DropdownCategoryTitle>
            //     </div>
            //   )
            // }
          })}
        </div>
      </PopoverContent>
    </Popover>)
  );
}
