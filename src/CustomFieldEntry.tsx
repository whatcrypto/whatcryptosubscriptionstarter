import { CustomInputField } from '@/interfaces/IOrganization'
import React from 'react'
import { createPostType } from './CreatePost'
import { cn } from '@/lib/utils'
import { ISubmission } from '@/interfaces/ISubmission'
import { StandaloneCustomFieldProps } from './CustomPostFields'
import ModularComboBox from './radix/ModularComboBox'
import MultiselectButton from './MultiselectButton'
import { CommandGroup, CommandItem } from './radix/Command'
import { CheckIcon } from '@heroicons/react/solid'

const CustomFieldEntry: React.FC<{
  customField: CustomInputField
  selectedOptions: createPostType | { customInputValues: ISubmission['customInputValues'] }
  setSelectedOptions:
    | React.Dispatch<React.SetStateAction<createPostType>>
    | ((
        updateFunction: (oldResult: StandaloneCustomFieldProps) => StandaloneCustomFieldProps
      ) => void)
  customInputFieldErrors: {
    [key: string]: boolean
  }
  setCustomInputFieldErrors: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean
    }>
  >
}> = ({
  customField,
  selectedOptions,
  setSelectedOptions,
  customInputFieldErrors,
  setCustomInputFieldErrors,
}) => {
  if (!selectedOptions.customInputValues) return null

  const activeValue = selectedOptions.customInputValues[customField._id]

  const removeError = () => {
    setCustomInputFieldErrors((prev) => ({
      ...prev,
      [customField._id]: false,
    }))
  }

  if (activeValue === undefined) return null

  if (
    (customField.type === 'text' || customField.type === 'number') &&
    (typeof activeValue === 'string' || typeof activeValue === 'number' || activeValue === null)
  ) {
    return (
      <div className="relative z-[50]">
        <p className="pt-3.5 px-4 pointer-events-none absolute text-xs font-medium text-gray-400 dark:text-foreground">
          {customField.label}
        </p>
        <input
          // WHen enter is pressed, do the same behavior as pressing TAB
          //   onKeyDown={(e) => {
          //     if (e.key === 'Enter' && !(e.metaKey || e.ctrlKey)) {
          //       e.preventDefault()
          //       e.stopPropagation()

          //       if (editorRef.current) {
          //         editorRef.current.commands.focus()
          //       }
          //     }
          //   }}
          type={customField.type === 'number' ? 'number' : 'text'}
          id="create-post-title"
          pattern={customField.type === 'number' ? '[0-9]*' : undefined}
          value={activeValue || ''}
          className={cn(
            'sm:text-[15px]  pr-32 dark:bg-transparent border-transparent dark:border-transparent bg-transparent pt-[36px] pb-3 rounded-none pl-[16px] border-x-0 dark:text-white focus-within:outline-none focus-within:ring-0 dark:focus-within:outline-none '
          )}
          onChange={(event) => {
            event.preventDefault()
            removeError()
            setSelectedOptions((prev: any) => ({
              ...prev,
              customInputValues: {
                ...prev.customInputValues,
                [customField._id]: event.target.value,
              },
            }))
          }}
          // autoFocus={true}
          placeholder={customField.placeholder || 'Write here...'}
        />
        <div className="absolute top-2.5 pointer-events-none right-5">
          <span className="border py-0.5 px-1 rounded bg-white border-gray-100/80 text-background-accent/70 shadow-sm dark:bg-white/5 dark:border-white/5 dark:text-foreground/60 text-[11px] font-medium tracking-wide">
            {customField.type === 'number' ? 'Number' : 'Text'}{' '}
            <span className="opacity-80">{!customField.required ? '(Optional)' : ''}</span>
          </span>
        </div>
      </div>
    )
  } else if (
    (customField.type === 'select' || customField.type === 'multi-select') &&
    (Array.isArray(activeValue) || typeof activeValue === 'string' || activeValue === null)
  ) {
    return (
      <div className="relative z-[50] py-3.5 px-4">
        <p className=" pr-20 text-sm font-medium text-gray-400 dark:text-foreground">
          {customField.label}
        </p>
        {!customField.required ? (
          <div className="absolute top-2.5 pointer-events-none right-5">
            <span className="border py-0.5 px-1 rounded bg-white border-gray-100/80 text-background-accent/70 shadow-sm dark:bg-white/5 dark:border-white/5 dark:text-foreground/60 text-[11px] font-medium tracking-wide">
              (Optional)
            </span>
          </div>
        ) : null}
        {customField.options.length > 6 ? (
          <div className="mt-3 max-w-[240px]">
            <ModularComboBox
              TriggerButton={() => (
                <MultiselectButton
                  customBadge={
                    Array.isArray(activeValue) &&
                    activeValue?.length > 1 && (
                      <span className="text-xs dark:text-foreground text-background-accent/60">
                        (+ {activeValue.length - 1})
                      </span>
                    )
                  }
                >
                  {Array.isArray(activeValue) ? activeValue[0] : activeValue}
                </MultiselectButton>
              )}
              CommandItems={({ closeComboBox }) => {
                return (
                  <CommandGroup>
                    {customField.options.map((option, index) => (
                      <CommandItem
                        value={option.label}
                        key={option?.label + '-' + index}
                        onSelect={() => {
                          removeError()
                          setSelectedOptions((prev: any) => ({
                            ...prev,
                            customInputValues: {
                              ...prev.customInputValues,
                              [customField._id]:
                                Array.isArray(activeValue) && activeValue.includes(option.label)
                                  ? activeValue.filter((v) => v !== option.label)
                                  : customField.type === 'select'
                                  ? [option.label]
                                  : [...(activeValue || []), option.label],
                            },
                          }))
                          if (customField.type === 'select') closeComboBox()
                        }}
                      >
                        {activeValue?.includes(option.label) ? (
                          <CheckIcon className="secondary-svg mr-1.5" />
                        ) : null}
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )
              }}
              allowNewCreation={false}
              searchableDisplayName="options"
            />
          </div>
        ) : (
          <div className="flex flex-wrap mt-3 gap-2.5">
            {customField.options.map((option) => {
              const checked = activeValue?.includes(option.label)

              return (
                <button
                  onClick={() => {
                    removeError()

                    setSelectedOptions((prev: any) => ({
                      ...prev,
                      customInputValues: {
                        ...prev.customInputValues,
                        [customField._id]:
                          Array.isArray(activeValue) && activeValue.includes(option.label)
                            ? activeValue.filter((v) => v !== option.label)
                            : customField.type === 'select'
                            ? [option.label]
                            : [...(activeValue || []), option.label],
                      },
                    }))
                  }}
                  className={cn(
                    'text-[12px] font-medium py-1 px-2',
                    checked ? 'dashboard-primary' : 'create-post-btn'
                  )}
                  key={option.label}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  } else if (customField.type === 'checkbox') {
    const activeValue = selectedOptions.customInputValues[customField._id] ? true : false
    return (
      <div className="relative z-[50] py-4 px-4">
        {/* <p className=" leading-none text-sm font-medium text-gray-400 dark:text-foreground">
          {customField.label}
        </p> */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id={'create-post-checkbox-' + customField._id}
            checked={activeValue}
            className="h-4 w-4"
            onChange={(event) => {
              removeError()

              setSelectedOptions((prev: any) => ({
                ...prev,
                customInputValues: {
                  ...prev.customInputValues,
                  [customField._id]:
                    prev.customInputValues !== undefined
                      ? !prev.customInputValues[customField._id]
                      : true,
                },
              }))
            }}
          />
          <label
            htmlFor={'create-post-checkbox-' + customField._id}
            className="ml-2.5 pr-20 select-none text-sm font-medium text-gray-400 dark:text-foreground"
          >
            {customField.label}
          </label>
        </div>
        {!customField.required ? (
          <div className="absolute top-2.5 pointer-events-none right-5">
            <span className="border py-0.5 px-1 rounded bg-white border-gray-100/80 text-background-accent/70 shadow-sm dark:bg-white/5 dark:border-white/5 dark:text-foreground/60 text-[11px] font-medium tracking-wide">
              (Optional)
            </span>
          </div>
        ) : null}
      </div>
    )
  }
  return null
}

export default CustomFieldEntry
