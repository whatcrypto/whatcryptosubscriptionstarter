import { CheckCircleIcon } from '@heroicons/react/solid'
import React from 'react'
import { tagColorData } from './AddTagModal'
import { cn } from '@/lib'

const CustomColorSwatch: React.FC<{ active: string; setActive: Function; small?: boolean }> = ({
  active,
  setActive,
  small,
}) => {
  return (
    <div>
      {!small && <p className="text-sm text-gray-500 dark:text-gray-100 mt-3 mb-2">Choose color</p>}
      <div className="flex gap-3 flex-wrap ">
        {tagColorData.map((color) => (
          <div
            className={cn(
              'relative h-9 w-9 overflow-hidden rounded-md cursor-pointer',
              small ? 'h-7 w-7' : ''
            )}
            key={color.name}
            onClick={() => (active === color.color ? setActive('') : setActive(color.name))}
            aria-hidden="true"
          >
            {active === color.name && (
              <CheckCircleIcon
                className={cn(
                  'h-4 w-4 absolute right-0 text-white m-0.5 top-0',
                  small ? 'h-3 w-3' : ''
                )}
              />
            )}

            <div className="absolute inset-0 z-10 hover:bg-white/40 bg-white/0 main-transition highlight-white-strong"></div>
            <div className={`h-full w-full ${color.color} `}></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomColorSwatch
