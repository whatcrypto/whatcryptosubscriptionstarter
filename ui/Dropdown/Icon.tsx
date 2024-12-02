import { cn } from '@/lib/utils'
import { memo } from 'react'

import {
  LucideIcon,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Code2,
  Highlighter,
  Palette,
  MoreVertical,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  GripVertical,
  Pilcrow,
  Link,
  ChevronDown,
  Undo,
  Plus,
  RemoveFormatting,
  Clipboard,
  Copy,
  Trash2,
  AlignHorizontalDistributeStart,
  AlignHorizontalDistributeCenter,
  AlignHorizontalDistributeEnd,
  PanelLeft,
  Columns,
  PanelRight,
  // Additional icons from GROUPS
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  ListPlus,
  Table,
  SquareCode,
  AlertCircle,
  Image,
  Minus,
  Youtube,
  ArrowUpToLine
} from 'lucide-react'

export type IconProps = {
  name: string
  className?: string
  strokeWidth?: number
}

const icons: Record<string, LucideIcon> = {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Code2,
  Highlighter,
  Palette,
  MoreVertical,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  GripVertical,
  Pilcrow,
  ChevronDown,
  Link,
  Undo,
  Plus,
  RemoveFormatting,
  Clipboard,
  Copy,
  Trash2,
  AlignHorizontalDistributeStart,
  AlignHorizontalDistributeCenter,
  AlignHorizontalDistributeEnd,
  PanelLeft,
  Columns,
  PanelRight,
  // Additional icons from GROUPS
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  ListPlus,
  Table,
  SquareCode,
  AlertCircle,
  Image,
  Minus,
  Youtube,ArrowUpToLine
}

export const Icon = memo(({ name, className, strokeWidth }: IconProps) => {
  const IconComponent = icons[name]

  if (!IconComponent) {
    return null
  }

  return (
    <IconComponent
      className={cn('w-4 h-4 !text-background-accent/60 dark:!text-foreground/80', className)}
      strokeWidth={strokeWidth || 2.5}
    />
  )
})

Icon.displayName = 'Icon'
