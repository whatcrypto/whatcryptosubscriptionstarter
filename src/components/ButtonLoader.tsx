import { cn } from '@/lib/utils'
import React from 'react'
import Loader from './Loader'

const ButtonLoader: React.FC<{ loading: boolean; primary?: boolean }> = ({
  loading,
  primary = false,
}) => {
  if (loading) {
    return (
      <span className={cn(primary ? 'text-indigo-200' : 'secondary-svg', 'h-4 w-4  mr-1.5')}>
        <Loader />
      </span>
    )
  }
  return <></>
}

export default ButtonLoader
