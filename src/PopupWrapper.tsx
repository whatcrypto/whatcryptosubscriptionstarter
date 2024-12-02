import React, { useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import ConfirmationModal from './ConfirmationModal'

const PopupWrapper: React.FC<{
  children: React.ReactNode
  setIsOpen: Function
  isOpen: boolean
  large?: boolean
  small?: boolean
  hasPadding?: boolean
  shiny?: boolean
  fullScreen?: boolean
  alwaysFull?: boolean
  white?: boolean
  xSmall?: boolean
  hideCloseButtonOnSmallScreen?: boolean
  hideBg?: boolean
  imageZoomed?: boolean
  fixToTop?: boolean
  removeOutsideCloseCheck?: boolean
  medium?: boolean
  lowerZIndex?: boolean
}> = ({
  children,
  setIsOpen,
  white,
  isOpen,
  large = false,
  small = false,
  hasPadding = true,
  shiny = false,
  fullScreen = false,
  alwaysFull = false,
  xSmall = false,
  hideCloseButtonOnSmallScreen = false,
  hideBg = false,
  imageZoomed = false,
  fixToTop,
  removeOutsideCloseCheck,
  medium,
  lowerZIndex,
}) => {
  const [disablePopupClosing, setDisablePopupClosing] = useState(false)
  const [isZooming, setIsZooming] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(false)

  const handleOverlayClick = () => {
    // setIsZooming(true)
    // setTimeout(() => {
    //   setIsZooming(false)
    // }, 300) // Duration of the zoom out effect
    if (!removeOutsideCloseCheck) {
      setConfirmationModal(true)
    } else {
      setIsOpen(false)
    }
  }

  const dialogZoomClass = cn({
    'transform transition-transform duration-300 ease-in-out': true,
    'scale-95': isZooming, // Zoom out effect
    'scale-100': !isZooming, // Normal scale
  })

  const overlayClass = cn(
    'absolute inset-0 backdrop-filter backdrop-blur-sm main-transition',
    fullScreen
      ? 'bg-white dark:bg-[#1E222E] sm:bg-opacity-40 dark:sm:bg-opacity-40 sm:bg-gray-900/20 dark:sm:bg-gray-950'
      : 'bg-opacity-40 dark:bg-opacity-40 bg-gray-900/20 dark:bg-gray-900'
  )

  const dialogClass = cn('relative z-50 w-full dark:shadow', {
    'max-w-7xl': large && alwaysFull,
    'max-w-5xl': large && !alwaysFull,
    'max-w-[22rem]': small && xSmall,
    'max-w-sm': small && !xSmall,
    'max-w-xl': !large && !small,
    'max-w-2xl': medium,
    'px-6 sm:px-8 py-4 sm:py-6': hasPadding && (large || alwaysFull),
    'px-5 py-5': hasPadding && ((!large && !alwaysFull) || small || xSmall),
    'bg-white darker-dropdown-background': large,
    'bg-white dropdown-background shadow-2xl dark:shadow-2xl': small || !hideBg,
    '2xl:mx-0 mx-0 sm:mx-8 sm:my-10 sm:rounded-lg': fullScreen,
    '2xl:mx-0 mx-4 sm:mx-8 my-10 rounded-lg': !fullScreen,
    'cursor-zoom-out border-none': imageZoomed,
  })

  return (
    <>
      <Transition appear show={isOpen} as={'div'}>
        <Dialog
          aria-roledescription="dialog"
          as="div"
          className={cn(
            `fixed inset-0 z-[100] custom-scrollbar-stronger overflow-y-auto overflow-x-hidden `,
            imageZoomed && 'cursor-zoom-out',
            lowerZIndex && 'z-[95]'
          )}
          open={isOpen}
          onClose={() => {
            if (disablePopupClosing) {
              handleOverlayClick()
              // toast.error('Unsaved changes will be lost once you close the popup')
            } else {
              setIsOpen(false)
              if (!removeOutsideCloseCheck) {
                setDisablePopupClosing(false)
              }
            }
          }}
        >
          <div className="relative min-h-screen overflow-hidden">
            <div
              className={`${
                fullScreen
                  ? alwaysFull
                    ? 'sm:flex sm:items-center sm:justify-center min-h-screen'
                    : 'sm:flex  sm:justify-center w-full sm:pt-12 '
                  : cn(
                      fixToTop
                        ? 'flex items-start min-h-screen sm:justify-center sm:pt-12 xl:pt-24'
                        : 'flex items-center justify-center min-h-screen'
                    )
              }`}
            >
              <Dialog.Overlay
                onClick={() => {
                  if (disablePopupClosing) {
                    handleOverlayClick()
                  } else {
                    setIsOpen(false)
                    if (!removeOutsideCloseCheck) {
                      setDisablePopupClosing(false)
                    }
                  }
                }}
                as="div"
                className={overlayClass}
              />
              {!imageZoomed && (
                <div className={` hidden sm:block`}>
                  <div
                    className={`p-1.5 border absolute shadow-none top-1 right-1 md:right-4 md:top-4 dropdown-background cursor-pointer rounded-lg bg-white/40 hover:bg-white dark:bg-border/30 dark:hover:bg-border/70 main-transition`}
                    onClick={() => {
                      setIsOpen(false)
                      if (!removeOutsideCloseCheck) {
                        setDisablePopupClosing(false)
                      }
                    }}
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <XIcon className="w-6 h-6 secondary-svg" />
                  </div>
                </div>
              )}
              <Transition.Child
                as="div"
                className={cn(`${dialogClass}`, dialogZoomClass)}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-300"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {fullScreen && !hideCloseButtonOnSmallScreen && (
                  <div className={`mb-10 sm:hidden`}>
                    <button
                      className={`p-1.5 fixed left-4 top-4 text-[11px] uppercase tracking-wide  dark:hover:bg-dark-accent bg-gray-50 dashboard-secondary dark:bg-border border-gray-50 ${
                        white && 'focus:ring-0'
                      }`}
                      onClick={() => {
                        setIsOpen(false)
                        if (!removeOutsideCloseCheck) {
                          setDisablePopupClosing(false)
                        }
                      }}
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="min-w-0 mx-auto max-w-7xl">
                  {React.Children.map(children, (child) => {
                    // Check if this child should receive the additional props
                    if (
                      React.isValidElement(child) &&
                      typeof child.type !== 'string' &&
                      child.type !== React.Fragment
                    ) {
                      // Ensuring it's not a DOM element
                      // Assuming child.type is a component that can accept ChildComponentProps
                      const ChildComponent = child.type as React.ComponentType<any>
                      // Clone the child element with the new props
                      return (
                        <ChildComponent
                          {...child.props}
                          setDisablePopupClosing={setDisablePopupClosing}
                          fromPopup={true}
                        />
                      )
                    }
                    return child
                  })}
                </div>
                <ConfirmationModal
                  callBack={() => {
                    setIsOpen(false)
                  }}
                  // info={true}
                  title="Are you sure you want to close the popup?"
                  description="Unsaved progress will be lost forever."
                  open={confirmationModal}
                  setOpen={setConfirmationModal}
                  buttonTxt="Close"
                />
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default PopupWrapper

// import React, { Fragment, useCallback, useEffect, useRef } from 'react'
// // import { Dialog, Transition } from '@headlessui/react'
// import { ChevronLeftIcon } from '@heroicons/react/solid'
// import { XIcon } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import { Transition } from '@headlessui/react'
// import * as Dialog from '@radix-ui/react-dialog'
{
  /* { {React.Children.map(children, (child) => {
                    // Check if this child should receive the additional props
                    if (
                      React.isValidElement(child) &&
                      typeof child.type !== 'string' &&
                      child.type !== React.Fragment
                    ) {
                      // Ensuring it's not a DOM element
                      // Assuming child.type is a component that can accept ChildComponentProps
                      const ChildComponent = child.type as React.ComponentType<any>
                      // Clone the child element with the new props
                      return <ChildComponent {...child.props} autoFocusRef={autoFocusRef} />
                    }
                    return child
                  })}} */
}
// const PopupWrapper: React.FC<{
//   children: React.ReactNode
//   setIsOpen: Function
//   isOpen: boolean
//   large?: boolean
//   small?: boolean
//   hasPadding?: boolean
//   shiny?: boolean
//   fullScreen?: boolean
//   alwaysFull?: boolean
//   white?: boolean
//   xSmall?: boolean
//   hideCloseButtonOnSmallScreen?: boolean
//   hideBg?: boolean
// }> = ({
//   children,
//   setIsOpen,
//   white,
//   isOpen,
//   large = false,
//   small = false,
//   hasPadding = true,
//   shiny = false,
//   fullScreen = false,
//   alwaysFull = false,
//   xSmall = false,
//   hideCloseButtonOnSmallScreen = false,
//   hideBg = false,
// }) => {
//   return (
//     <Dialog.Root open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
//       <Dialog.Portal className="overflow-auto" forceMount>
//         <Transition.Root show={isOpen}>
//           <Dialog.Overlay
//             className={cn(
//               'fixed inset-0 z-[200] overflow-y-auto place-items-center grid data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
//               fullScreen
//                 ? `bg-white dark:bg-[#1E222E]  sm:bg-opacity-40 dark:sm:bg-opacity-40 sm:bg-gray-900/20  dark:sm:bg-gray-950 backdrop-filter backdrop-blur-sm`
//                 : 'bg-opacity-40 dark:bg-opacity-40 bg-gray-900/20 dark:bg-gray-900 backdrop-filter backdrop-blur-sm'
//             )}
//           >
//             <div
//               className={`p-1.5 hidden sm:block border absolute shadow-none top-1 right-1 md:right-4 md:top-4 dropdown-background cursor-pointer rounded-lg bg-white/40 hover:bg-white dark:bg-border/30 dark:hover:bg-border/70 main-transition`}
//               onClick={() => setIsOpen(false)}
//               tabIndex={-1}
//             >
//               <XIcon className="w-6 h-6 secondary-svg" />
//             </div>
//             <Dialog.Content
//               // className="p-6 bg-white rounded-lg "
//               className={`relative z-50 w-full  ${
//                 large
//                   ? alwaysFull
//                     ? `max-w-7xl ${
//                         hasPadding && ' px-6 sm:px-8 py-4 sm:py-6'
//                       } bg-white darker-dropdown-background`
//                     : `max-w-5xl ${
//                         hasPadding && 'px-6 sm:px-8 py-4 sm:py-6'
//                       } bg-white darker-dropdown-background`
//                   : `${
//                       small
//                         ? xSmall
//                           ? `max-w-[22rem] ${
//                               hasPadding && 'px-5 py-5'
//                             } bg-white dropdown-background`
//                           : `max-w-sm ${hasPadding && 'px-5 py-5'} bg-white dropdown-background`
//                         : `max-w-xl ${hasPadding && 'px-5 py-5'} ${
//                             !hideBg && 'bg-white dropdown-background'
//                           }`
//                     }`
//               } dark:shadow ${white && 'bg-[#F6F5EF]'} ${
//                 fullScreen
//                   ? alwaysFull
//                     ? '2xl:mx-0 mx-0 -mt-px sm:mx-8 sm:my-10 sm:rounded-lg'
//                     : '2xl:mx-0 mx-0 -mt-px sm:mx-8 sm:my-10 sm:rounded-lg'
//                   : '2xl:mx-0 mx-4 sm:mx-8 my-10 rounded-lg'
//               }

//               duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
//               `}
//             >
//               {children}
//               {fullScreen && !hideCloseButtonOnSmallScreen && (
//                 <div className={`mb-10 block sm:hidden`}>
//                   <Dialog.Close
//                     className={`p-1.5 absolute right-4 top-4 text-[11px] uppercase tracking-wide  dark:hover:bg-dark-accent bg-gray-50 dashboard-secondary dark:bg-border border-gray-50 ${
//                       white && 'focus:ring-0'
//                     }`}
//                     onClick={() => setIsOpen(false)}
//                   >
//                     <XIcon className="w-4 h-4" />
//                   </Dialog.Close>
//                 </div>
//               )}
//             </Dialog.Content>
//           </Dialog.Overlay>
//         </Transition.Root>
//       </Dialog.Portal>
//     </Dialog.Root>
//   )
// }

// export default PopupWrapper
