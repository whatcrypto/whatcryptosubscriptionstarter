/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react'
import { CheckCircleIcon } from '@heroicons/react/outline'
import { InformationCircleIcon, XCircleIcon } from '@heroicons/react/solid'

const Notification: React.FC<{
  title?: string
  content: any
  isError: boolean
  isInfo?: boolean
  description?: string
  customButton?: JSX.Element
}> = ({
  title,
  content,
  isError,
  isInfo,
  description = 'This will close in a few seconds.',
  customButton,
}) => {
  const [show, setShow] = useState(true)

  return (
    <>
      <div aria-live="assertive" className="px-4 pointer-events-none sm:items-start relative">
        <div className="w-80  flex flex-col items-center space-y-4 sm:items-end">
          <div className="max-w-sm w-full transform-gpu dark:bg-secondary/80 bg-white/50 backdrop-blur-md up-element dark:shadow-lg shadow-md rounded-lg pointer-events-auto overflow-hidden">
            <div className="p-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {isError ? (
                    <XCircleIcon className="h-5 w-5 text-rose-500" aria-hidden="true" />
                  ) : isInfo ? (
                    <InformationCircleIcon className="h-5 w-5 text-accent" aria-hidden="true" />
                  ) : (
                    <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                  )}
                </div>
                <div className="ml-2 w-0 flex-1">
                  <p className="text-xs font-semibold text-gray-700 dark:text-white capitalize">
                    {content}
                  </p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-100">{description}</p>
                </div>
                {/* <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="bg-white dark:bg-border p-0 dark:text-background-accent shadow-none dark:hover:bg-dark-accent text-gray-200 hover:bg-gray-100/60"
                    onClick={() => {
                      setShow(false)
                    }}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div> */}
              </div>
              {customButton ? customButton : null}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Notification
