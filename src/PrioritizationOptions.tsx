import { IOrganization } from '@/interfaces/IOrganization'
import { CheckIcon } from '@heroicons/react/solid'
import React from 'react'

type Props = {
  WrapperItem: any
  org: IOrganization
  activeValue: number
  decimalsEnabled?: boolean
  SubMenuWrapper?: any
  SubMenuTrigger?: any
  SubMenuContent?: any
}

export function getPatternNumbers(pattern: string) {
  // Note the corrected order here
  pattern = pattern || 'exponential'

  switch (pattern) {
    case 'exponential':
      return [0, 1, 2, 4, 8, 16]
    case 'ten':
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    case 'fibonacci':
      return [0, 1, 2, 3, 5, 8]
    case 'linear':
      return [0, 1, 2, 3, 4, 5]
    default:
      throw new Error('Invalid pattern')
  }
}

export const prioritizationOptionBadgeColor = {
  0: 'hidden',
  2: 'bg-rose-500/30 text-rose-800 dark:bg-rose-600/20 dark:text-rose-300',
  3: 'bg-pink-500/30 text-pink-800 dark:bg-pink-600/20 dark:text-pink-400',
  4: 'bg-lime-500/30 text-lime-800 dark:bg-lime-600/20 dark:text-lime-400',
  5: 'bg-teal-500/30 text-teal-800 dark:bg-teal-600/20 dark:text-teal-400',
  6: 'bg-sky-500/30 text-sky-800 dark:bg-sky-600/20 dark:text-sky-400',
}
// export const dashboardPrioritizationIcon = {
//   1: 'hidden',
//   2: 'text-rose-500 dark:text-opacity-80',
//   3: 'text-pink-500 dark:text-opacity-80',
//   4: 'text-lime-500 dark:text-opacity-80',
//   5: 'text-teal-500 dark:text-opacity-80',
//   6: 'text-sky-500 dark:text-opacity-80',
// }

export const determineOptionColorByNumberAndPattern = (
  number: number,
  type: string // This will accept either 'effort' or 'value'
): string | undefined => {
  let colors = Object.values(prioritizationOptionBadgeColor)
  if (type === 'effort') {
    colors = colors.reverse() // Reverse the colors for 'effort' type
    colors.pop()
    colors = ['hidden', ...colors]
  }

  return colors[number]
}

const PrioritizationOptions: React.FC<Props> = ({
  WrapperItem,
  org,
  activeValue,
  SubMenuContent,
  SubMenuTrigger,
  SubMenuWrapper,
}) => {
  if (org.settings.valueEffortScale === 'ten') {
    return (
      <>
        {/* <WrapperItem key={0} index={0}>
          <div className="flex-shrink-0 w-6"></div>
          Unset
        </WrapperItem> */}
        {getPatternNumbers(org.settings?.valueEffortScale)
          // .slice(1)
          ?.map((number: number, index) => {
            // index += 1
            return (
              <SubMenuWrapper key={number}>
                <SubMenuTrigger>
                  <div className="flex-shrink-0 w-6">
                    {index === Math.floor(activeValue) && (
                      <CheckIcon className="relative z-10 w-4 h-4 secondary-svg" />
                    )}
                  </div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="secondary-svg h-4 w-4 mr-1.5"
                    fill="none"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M12 2.005c-.777 0 -1.508 .367 -1.971 .99l-5.362 6.895c-.89 1.136 -.89 3.083 0 4.227l5.375 6.911a2.457 2.457 0 0 0 3.93 -.017l5.361 -6.894c.89 -1.136 .89 -3.083 0 -4.227l-5.375 -6.911a2.446 2.446 0 0 0 -1.958 -.974z"
                      strokeWidth="0"
                      fill="currentColor"
                    />
                  </svg>
                  {number}
                </SubMenuTrigger>
                <SubMenuContent>
                  {[...Array(10).keys()].map((subNumber) => (
                    <WrapperItem key={index + '-' + subNumber} index={index} subNumber={subNumber}>
                      <div className="flex-shrink-0 w-6">
                        {parseFloat(`${index}.${subNumber}`) === activeValue && (
                          <CheckIcon className="relative z-10 w-4 h-4 secondary-svg" />
                        )}
                      </div>
                      {!(number === 0 && subNumber === 0) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="secondary-svg h-4 w-4 mr-1.5"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M10.831 20.413l-5.375 -6.91c-.608 -.783 -.608 -2.223 0 -3l5.375 -6.911a1.457 1.457 0 0 1 2.338 0l5.375 6.91c.608 .783 .608 2.223 0 3l-5.375 6.911a1.457 1.457 0 0 1 -2.338 0z" />
                        </svg>
                      )}
                      {number === 0 && subNumber === 0 ? 'Unset' : `${index}.${subNumber}`}
                    </WrapperItem>
                  ))}
                </SubMenuContent>
              </SubMenuWrapper>
            )
          })}
      </>
    )
  } else {
    return (
      <>
        {getPatternNumbers(org.settings?.valueEffortScale)?.map((number: number, index) => (
          <WrapperItem key={number} index={index}>
            <div className="flex-shrink-0 w-6">
              {index === activeValue && (
                <CheckIcon className="relative z-10 w-4 h-4 secondary-svg" />
              )}
            </div>

            {number !== 0 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="secondary-svg h-4 w-4 mr-1.5"
                fill="none"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M12 2.005c-.777 0 -1.508 .367 -1.971 .99l-5.362 6.895c-.89 1.136 -.89 3.083 0 4.227l5.375 6.911a2.457 2.457 0 0 0 3.93 -.017l5.361 -6.894c.89 -1.136 .89 -3.083 0 -4.227l-5.375 -6.911a2.446 2.446 0 0 0 -1.958 -.974z"
                  strokeWidth="0"
                  fill="currentColor"
                />
              </svg>
            ) : null}
            {number === 0 ? 'Unset' : number}
          </WrapperItem>
        ))}
      </>
    )
  }
}

export default PrioritizationOptions
