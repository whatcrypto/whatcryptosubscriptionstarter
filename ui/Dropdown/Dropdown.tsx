import { cn } from '@/lib/utils'

export const DropdownCategoryTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-[10px] tracking-wide font-semibold mb-1 uppercase px-2">{children}</div>
  )
}

export const DropdownButton = ({
  children,
  isActive,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode
  isActive?: boolean
  onClick?: () => void
  disabled?: boolean
  className?: string
}) => {
  const buttonClass = cn(
    'flex items-center gap-2 p-1.5 text-sm font-medium dropdown-item',
    // !isActive && !disabled,
    // 'hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-neutral-200',
    isActive && !disabled && 'active-dropdown-item',
    // disabled && 'text-neutral-400 cursor-not-allowed dark:text-neutral-600',
    className
  )

  return (
    <button className={buttonClass} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}
