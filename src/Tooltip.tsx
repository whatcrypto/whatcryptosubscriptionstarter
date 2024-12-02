import { Transition } from '@headlessui/react'
import React from 'react'
import { createPortal } from 'react-dom'
import { usePopperTooltip } from 'react-popper-tooltip'
import 'react-popper-tooltip/dist/styles.css'

const Tooltip: React.FC<{
  child: React.ReactNode
  dropDown: React.ReactNode
  canBeRelative?: boolean
  notCentered?: boolean
  noAlignment?: boolean
  dontTruncate?: boolean
  onlyChild?: boolean
  notInteractivce?: boolean
  customDelay?: number
  inlineChild?: boolean
}> = ({
  child,
  dropDown,
  canBeRelative,
  notCentered = false,
  noAlignment = false,
  dontTruncate,
  onlyChild,
  notInteractivce,
  customDelay,
  inlineChild,
}) => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip(
      {
        placement: 'bottom',
        // trigger: 'hover',
        interactive: onlyChild ? (notInteractivce ? false : true) : false,
        delayShow: customDelay ? customDelay : 300,
      },
      {
        modifiers: [
          {
            name: 'preventOverflow',
            options: {
              padding: 26,
            },
          },
        ],
      }
    )

  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {onlyChild ? (
        inlineChild ? (
          <span className={inlineChild ? 'inline-block' : ''} ref={setTriggerRef}>
            {child}
          </span>
        ) : (
          <div className={inlineChild ? 'inline-block' : ''} ref={setTriggerRef}>
            {child}
          </div>
        )
      ) : (
        <div
          className={`${
            !noAlignment &&
            (!notCentered
              ? 'flex items-center justify-center'
              : 'text-right inline-flex justify-end truncate w-full max-w-full')
          } ${noAlignment && 'w-full inline-flex'} cursor-default`}
        >
          <span
            className={!dontTruncate ? 'truncate' : 'h-full inline-flex items-center'}
            ref={setTriggerRef}
          >
            {child}
          </span>
        </div>
      )}

      {mounted ? (
        createPortal(
          <Transition
            show={visible}
            as="div"
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            ref={setTooltipRef}
            {...getTooltipProps({
              className: `z-[10000] max-w-xs mx-3 font-normal dropdown-background sm:mx-0 rounded-md  ${
                !onlyChild ? 'p-2' : ' overflow-hidden'
              }`,
            })}
          >
            <div {...getArrowProps({ className: 'tooltip-arrow z-50' })} />
            {dropDown}
          </Transition>,
          document?.body
        )
      ) : (
        <></>
      )}
    </>
  )
}

export default Tooltip
