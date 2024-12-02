import { ExclamationIcon, InformationCircleIcon } from '@heroicons/react/solid'
import React from 'react'
import PopupWrapper from './PopupWrapper'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const ConfirmationModal: React.FC<{
  open: boolean
  setOpen: Function
  title: string
  description: string
  callBack: Function
  buttonTxt?: string
  text?: string
  info?: boolean
  customComponent?: React.ReactNode
}> = ({ open, setOpen, title, description, callBack, buttonTxt, text, info, customComponent }) => {
  const [input, setInput] = React.useState('')
  return (
    <PopupWrapper removeOutsideCloseCheck={true} isOpen={open} setIsOpen={setOpen}>
      <div className="sm:flex sm:items-start">
        <div
          className={cn(
            'mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-rose-500/10 sm:mx-0 sm:h-10 sm:w-10',
            info && 'bg-accent/20'
          )}
        >
          {info ? (
            <InformationCircleIcon aria-hidden="true" className="w-6 h-6 text-accent" />
          ) : (
            <ExclamationIcon className={cn('h-6 w-6 text-rose-500')} aria-hidden="true" />
          )}
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 className="text-lg font-medium leading-6 text-gray-500 dark:text-white">{title}</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-400 dark:text-foreground">{description}</p>
          </div>

          {text && (
            <>
              <p className="mt-3 text-sm font-semibold text-gray-400 dark:text-foreground">
                Type in "{text}" and click {buttonTxt}
              </p>
              <input
                value={input}
                onChange={(e) => {
                  e.preventDefault()
                  setInput(e?.target?.value)
                }}
                className="mt-1"
                placeholder={text}
              ></input>
            </>
          )}
          {customComponent}
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className={cn(
            'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm  text-base font-medium focus:outline-none sm:ml-3 sm:w-auto sm:text-sm',
            info ? 'flex-shrink-0 dashboard-primary' : 'bg-rose-600 text-white hover:bg-rose-500'
          )}
          onClick={() => {
            if (text) {
              if (text === input) {
                callBack(input)
                setOpen(false)
              } else {
                toast.error('Please type in the correct text')
              }
            } else {
              callBack()
              setOpen(false)
            }
          }}
        >
          {buttonTxt || 'Deactivate'}
        </button>
        <button
          type="button"
          className="inline-flex justify-center w-full mt-3 text-base font-medium rounded-md shadow-sm white-btn sm:mt-0 sm:w-auto sm:text-sm"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
      </div>
    </PopupWrapper>
  )
}

export default ConfirmationModal
