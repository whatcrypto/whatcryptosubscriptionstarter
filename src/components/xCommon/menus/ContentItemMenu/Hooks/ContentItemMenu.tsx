import DragHandle from '@tiptap-pro/extension-drag-handle-react'
import { Editor } from '@tiptap/react'

import * as Popover from '@radix-ui/react-popover'
import useContentItemActions from './hooks/useContentItemActions'
import { useData } from './hooks/useData'
import { useEffect, useState } from 'react'
import { ClipboardCopyIcon, LinkIcon, PlusSmIcon, XIcon } from '@heroicons/react/solid'
import { Icon } from '../../ui/Icon'
import { Button } from '@/components/radix/Button'
import { cn, getHelpCenterPrefix } from '@/lib/utils'
import { useCurrentOrganization } from '@/data/organization'
import { activeArticleIdsAtom } from '@/atoms/docsAtom'
import { useAtom } from 'jotai'
import { toast } from 'sonner'

export type ContentItemMenuProps = {
  editor: Editor
}

export const ContentItemMenu = ({ editor }: ContentItemMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const data = useData()
  const actions = useContentItemActions(editor, data.currentNode, data.currentNodePos)
  const [activeArticleIds, setActiveArticleIds] = useAtom(activeArticleIdsAtom)

  const { org } = useCurrentOrganization()

  useEffect(() => {
    if (menuOpen) {
      editor.commands.setMeta('lockDragHandle', true)
    } else {
      editor.commands.setMeta('lockDragHandle', false)
    }
  }, [editor, menuOpen])

  return (
    <DragHandle
      pluginKey="ContentItemMenu"
      editor={editor}
      onNodeChange={data.handleNodeChange}
      tippyOptions={{
        offset: [-2, 16],
        zIndex: 99,
      }}
    >
      <div className="flex items-center gap-0.5 -mt-0.5">
        <Button
          className="h-9 w-9 hover:bg-gray-100/40 dark:hover:bg-secondary"
          size="icon"
          variant={'ghost'}
          onClick={actions.handleAdd}
        >
          <PlusSmIcon className="secondary-svg !h-5 !w-5" />
        </Button>
        <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Popover.Trigger asChild>
            <Button
              className={cn(
                'h-9 w-9 hover:bg-gray-100/40 dark:hover:bg-secondary',
                menuOpen ? 'bg-gray-100/40 dark:bg-secondary' : ''
              )}
              size="icon"
              variant={'ghost'}
            >
              <Icon name="GripVertical" className="secondary-svg !h-5 !w-5" />
            </Button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className={cn(
                'rounded-md py-1 w-48 overflow-hidden px-1 focus:outline-none focus:outline-0 dropdown-background text-base sm:text-sm  text-gray-400 dark:text-foreground',
                ' animate-in fade-in-0 duration-150 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
              )}
              side="bottom"
              align="start"
              sideOffset={8}
            >
              {/* <Popover.Close asChild>
                <button
                  tabIndex={-1}
                  className="w-full m-0 dropdown-item focus:outline-none"
                  onClick={actions.copyNodeToClipboard}
                >
                  <ClipboardIcon className="secondary-svg mr-1.5" /> Copy to clipboard
                </button>
              </Popover.Close> */}
              {data?.currentNode?.attrs?.id && (
                <Popover.Close asChild>
                  <button
                    tabIndex={-1}
                    className="w-full m-0 dropdown-item focus:outline-none"
                    onClick={() => {
                      if (activeArticleIds?.length > 0) {
                        const prefix = getHelpCenterPrefix(org)
                        const nodeId = actions.copyLinkToCurrentNode()

                        const link = `${prefix}/articles/${activeArticleIds[0]}#${nodeId}`

                        try {
                          navigator.clipboard.writeText(link)
                          toast.success('Link copied to clipboard')
                        } catch (error) {
                          toast.error('Failed to copy link to clipboard')
                        }
                      }
                    }}
                  >
                    <LinkIcon className="secondary-svg mr-1.5" /> Copy link to element
                  </button>
                </Popover.Close>
              )}
              <Popover.Close asChild>
                <button
                  tabIndex={-1}
                  className="w-full m-0 dropdown-item focus:outline-none"
                  onClick={actions.duplicateNode}
                >
                  <ClipboardCopyIcon className="secondary-svg mr-1.5" /> Duplicate
                </button>
              </Popover.Close>
              {/* <Popover.Close asChild>
                <button
                  tabIndex={-1}
                  className="w-full m-0 dropdown-item focus:outline-none"
                  onClick={actions.resetTextFormatting}
                >
                  <MinusIcon className="secondary-svg mr-1.5" /> Clear formatting
                </button>
              </Popover.Close> */}
              <Popover.Close asChild>
                <button
                  tabIndex={-1}
                  className="w-full m-0 dropdown-item focus:outline-none"
                  onClick={actions.deleteNode}
                >
                  <XIcon className="secondary-svg mr-1.5" /> Delete
                </button>
              </Popover.Close>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </DragHandle>
  )
}
