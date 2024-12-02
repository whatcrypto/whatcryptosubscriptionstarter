import { Editor, useEditor } from '@tiptap/react'
import { ExtensionKit } from '@/components/editor/extensions/extension-kit'
import { useDebouncedCallback } from 'use-debounce'
import {
  handleImageDrop,
  handleImagePaste,
} from '@/components/editor/extensions/HandleNonCommandImage/regular-upload-images'
import { onUpload, uploadFn } from '@/components/editor/image-upload'

declare global {
  interface Window {
    editor: Editor | null
  }
}

export const useBlockEditor = (
  instanceId: string,
  content: string,
  setNewContent: (content: string) => any,
  compactMode: boolean,
  staticPlaceholderRefWrapper?: any,
  height?: number,
  editorRef?: any,
  dontAutoFocus?: boolean,
  changelog?: boolean
) => {
  const debouncedUpdates = useDebouncedCallback(async (editor: any) => {
    setNewContent(editor.getHTML())
  }, 100)

  const editor = useEditor({
    autofocus: false,
    onUpdate: ({ editor }) => {
      debouncedUpdates(editor)
    },
    extensions: [...ExtensionKit(instanceId, compactMode, staticPlaceholderRefWrapper, changelog)],
    editorProps: {
      transformPastedHTML(html) {
        try {
          // Remove all inline color styles using regex
          let transformed = html.replace(/(?:color|--tw-text-opacity):\s*[^;"'}]*/g, '')

          // Remove empty style attributes
          transformed = transformed.replace(/\s*style="\s*"\s*/g, '')

          // Remove any remaining color-related Tailwind classes
          transformed = transformed.replace(
            /\s*text-(?:gray|white|black|rose|indigo|sky|blue)-[0-9]{2,3}(?:\/\[?[0-9.%]+\]?)?\s*/g,
            ''
          )

          // Remove non-breaking spaces
          transformed = transformed.replace(/\xA0/g, ' ')

          // Clean up any double spaces that might have been created
          transformed = transformed.replace(/\s+/g, ' ')

          // Clean up empty style tags
          transformed = transformed.replace(/style="\s*"/g, '')

          return transformed
        } catch (error) {
          console.error('Error transforming pasted HTML:', error)
          return html
        }
      },
      // handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
      attributes: {
        class: !compactMode || changelog ? 'installation-content' : '',
        spellcheck: 'true',
        tabindex: dontAutoFocus ? '-1' : '0',
        style: `min-height: ${height ? height : 100}px;  padding-bottom: ${12}px;`,
      },
    },
    onCreate: ({ editor }) => {
      if (editorRef) {
        editorRef.current = editor
      }
    },
    onBeforeCreate({ editor }) {
      if (editorRef) {
        editorRef.current = editor
      }
    },
    content: content,
  })

  const characterCount = editor?.storage.characterCount || { characters: () => 0, words: () => 0 }

  return { editor, characterCount }
}
