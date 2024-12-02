import { sanitizeHTML } from '@/lib/contentSanitizer'
import { cn } from '@/lib/utils'
import { ClipboardIcon } from '@heroicons/react/solid'
import { toHtml } from 'hast-util-to-html'
import React from 'react'
import { toast } from 'sonner'

interface ICodeExample {
  name: string
  value: string
  id: string
  language?: string
}

const CodeArea = ({
  examples,
  activeItem,
  menu,
  editorElement,
  lowlight,
  updateAttributes,
  languagePicker,
  activeValue,
}: {
  examples: ICodeExample[]
  activeItem?: string
  menu?: React.ReactNode
  editorElement?: React.ReactNode
  lowlight?: any
  updateAttributes?: (attributes: any) => void
  languagePicker?: React.ReactNode
  activeValue?: any
}) => {
  const [activeExample, setActiveExample] = React.useState<string>(examples[0]?.id)

  const activeItemCode = editorElement
    ? activeValue?.value
    : examples.find((item) => item.id === activeExample)?.value

  let tree: any

  try {
    tree = lowlight
      ? lowlight?.highlight(
          (editorElement
            ? activeValue?.language
            : examples.find((item) => item.id === activeExample)?.language) || 'javascript',
          activeItemCode
        )
      : undefined
  } catch (e) {
    console.error(e)
  }

  const actualActiveItem = activeItem ? activeItem : activeExample

  return (
    <pre contentEditable={false} className="relative p-0 overflow-hidden border rounded-lg">
      <div className="flex items-center justify-between px-4 border-b">
        <div className="py-3 ">
          <span className="font-medium text-gray-500 dark:text-foreground">Example</span>
        </div>
        <div className="flex items-center gap-2 -mb-px">
          {examples.map((item) => (
            <button
              key={item?.id}
              className={cn(
                'flex rounded-none focus:ring-0 items-center  py-4 px-1 justify-between cursor-pointer text-gray-400 hover:text-gray-700 dark:hover:text-gray-100 main-transition dark:text-foreground',
                item?.id === actualActiveItem &&
                  'border-accent/60 text-accent dark:text-accent-foreground border-b'
              )}
              onClick={() => {
                updateAttributes &&
                  updateAttributes({
                    activeCode: item.id,
                  })
                setActiveExample(item.id)
              }}
            >
              <div className="flex items-center space-x-2 font-medium">
                <span className="text-sm">{item.name}</span>
              </div>
            </button>
          ))}

          {menu && menu}
        </div>
      </div>
      <div className="relative px-4 py-3 overflow-hidden group">
        <div
          className={cn(
            'absolute opacity-0 top-1.5 right-1.5 group-hover:opacity-100 main-transition z-20 flex items-center gap-2 focus-within:opacity-100',
            languagePicker ? 'opacity-100 z-50' : ''
          )}
        >
          {languagePicker && languagePicker}
          {!languagePicker && (
            <button
              className="dashboard-secondary text-xs font-normal p-1.5 px-2"
              onClick={() => {
                if (navigator.clipboard) {
                  try {
                    navigator.clipboard.writeText(activeItemCode || '')
                    toast.success('Copied to clipboard')
                  } catch (err) {
                    console.error('Failed to copy: ', err)
                    toast.error('Failed to copy to clipboard')
                  }
                }
              }}
            >
              <ClipboardIcon className="mr-1.5" />
              Copy
            </button>
          )}
        </div>
        <div className="relative">
          {tree ? (
            <code
              className={editorElement ? 'absolute inset-0' : ''}
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(
                  tree && tree.children && tree.children.length === 0
                    ? activeItemCode || ''
                    : tree
                    ? toHtml(tree)
                    : ''
                ),
              }}
            />
          ) : (
            !editorElement && <code>{activeItemCode || ''}</code>
          )}
          {editorElement && <code>{editorElement}</code>}
        </div>
      </div>
    </pre>
  )
}

export default CodeArea
