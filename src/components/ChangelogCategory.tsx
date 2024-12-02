import React from 'react'
import { cn } from '@/lib/utils'
import { IOrganization } from '@/interfaces/IOrganization'
import { statusColorData } from './Status'

export const changelogStyles: { [key: string]: string } = {
  New: 'bg-green-500 bg-opacity-10 text-green-600 dark:bg-green-500 dark:bg-opacity-10 dark:text-green-400 dark:border-green-500/10 border-green-600/10',
  Improved:
    'bg-sky-500 bg-opacity-10 dark:bg-blue-500 dark:bg-opacity-10 dark:text-sky-400 dark:border-sky-500/10 text-sky-600 border-sky-600/10',
  Fixed:
    'bg-purple-500 bg-opacity-10 text-purple-600 dark:bg-purple-500 dark:bg-opacity-10 dark:text-purple-400 dark:border-purple-500/10 border-purple-600/10',
}

export const otherStyles: { [key: string]: string } = {
  0: 'bg-yellow-500 bg-opacity-10 text-yellow-600 dark:bg-yellow-500 dark:bg-opacity-10 dark:text-yellow-400',
  1: 'bg-red-500 bg-opacity-10 text-red-600 dark:bg-red-500 dark:bg-opacity-10 dark:text-red-400',
  2: 'bg-rose-500 bg-opacity-10 text-rose-600 dark:bg-rose-500 dark:bg-opacity-10 dark:text-rose-400',
  3: 'bg-lime-500 bg-opacity-10 text-lime-600 dark:bg-lime-500 dark:bg-opacity-10 dark:text-lime-400',
  4: 'bg-orange-500 bg-opacity-10 text-orange-600 dark:bg-orange-500 dark:bg-opacity-10 dark:text-orange-400',
  5: 'bg-blue-500 bg-opacity-10 text-blue-600 dark:bg-blue-500 dark:bg-opacity-10 dark:text-blue-400',
  6: 'bg-indigo-500 bg-opacity-10 text-indigo-600 dark:bg-indigo-500 dark:bg-opacity-10 dark:text-indigo-400',
  7: 'bg-gray-500 bg-opacity-10 text-gray-600 dark:bg-background-accent dark:bg-opacity-10 dark:text-foreground',
  8: 'bg-cyan-500 bg-opacity-10 text-cyan-600 dark:bg-cyan-500 dark:bg-opacity-10 dark:text-cyan-400',
  9: 'bg-pink-500 bg-opacity-10 text-pink-600 dark:bg-pink-500 dark:bg-opacity-10 dark:text-pink-400',
}

const ChangelogCategory: React.FC<{
  category: IOrganization['changelogCategories'][0]
  small?: boolean
}> = ({ category, small = false }) => {
  const getStyles = (inputColor: string) => {
    return statusColorData.find((color) =>
      inputColor ? color?.name === inputColor : color?.name === 'Gray'
    )?.color
  }

  return (
    <p
      className={cn(
        ` ${
          small ? 'text-xs px-1.5' : 'text-xs'
        } px-1.5 pointer-events-none py-0.5 flex font-medium items-center text-xs rounded `,
        getStyles(category?.color || 'Gray')
      )}
    >
      {category.name}
    </p>
  )
}

export default ChangelogCategory
