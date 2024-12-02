import React from 'react'
import { tagColorData } from './AddTagModal'

export const getColor = (theme: string) => {
  return tagColorData.filter((color) => color.name === theme)[0]?.hex || '#5D6890'
}

const TagBullet: React.FC<{ theme: string; asSpan?: boolean }> = ({ theme, asSpan }) => {
  const color = getColor(theme)
  if (asSpan) {
    return (
      <span
        style={{ backgroundColor: color === '#5D6890' ? undefined : color }}
        className={`h-1.5 w-1.5 bg-background-accent/60 block mb-0.5 dark:bg-gray-200/50 mr-2 rounded-full flex-shrink-0`}
      />
    )
  } else {
    return (
      <div
        style={{ backgroundColor: color === '#5D6890' ? undefined : color }}
        className={`h-1.5 w-1.5 bg-background-accent/60 dark:bg-gray-200/50 mr-2 rounded-full flex-shrink-0`}
      />
    )
  }
}

export default TagBullet
