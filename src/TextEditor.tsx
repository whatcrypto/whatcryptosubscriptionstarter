import React, { useEffect, useRef } from 'react'
import { IPostCategory } from '../interfaces/ISubmission'
import { Editor } from '@tiptap/react'
import { BlockEditor } from './editor/components/BlockEditor'
import { useBlockEditor } from '@/hooks/useBlockEditor'
import { v4 as uuid } from 'uuid'
import { cn } from '@/lib'
import { useAtom } from 'jotai'
import { activeAuthorAtom } from '@/atoms/editorAtom'

const TextEditor: React.FC<{
  height: number
  formData: { content: string }
  setFormData: React.Dispatch<React.SetStateAction<any>>
  widget?: boolean
  typography?: boolean
  forCategory?: boolean
  activeCategory?: IPostCategory
  placeholder?: string
  changelog?: boolean
  insideContent?: any
  feedbackWidget?: boolean
  noShadow?: boolean
  hideBg?: boolean
  author?: string
  className?: string
  customStyle?: string
  editorRef?: React.MutableRefObject<Editor | null>
  compactMode?: boolean
  dontAutoFocus?: boolean
}> = ({
  height,
  formData,
  setFormData,
  widget = false,
  typography,
  forCategory,
  activeCategory,
  placeholder,
  changelog,
  insideContent,
  feedbackWidget,
  noShadow,
  hideBg,
  author,
  className,
  editorRef,
  customStyle,
  compactMode = true,
  dontAutoFocus,
}) => {
  const [instanceId, setInstanceId] = React.useState(uuid())
  const placeholderRefWrapper = useRef(placeholder)
  const staticPlaceholderRefWrapper = useRef((ref: any) => {
    return placeholderRefWrapper.current
  })

  const { editor } = useBlockEditor(
    instanceId,
    formData.content,
    setFormData,
    compactMode,
    compactMode && !changelog ? staticPlaceholderRefWrapper : placeholder,
    height,
    editorRef,
    dontAutoFocus,
    changelog
  )

  const [activeAuthors, setActiveAuthor] = useAtom(activeAuthorAtom)

  useEffect(() => {
    const acitveAuthor = activeAuthors[instanceId]
    if (author !== acitveAuthor) {
      setActiveAuthor((prev) => {
        prev[instanceId] = author || ''
        return prev
      })
    }
  }, [author, activeAuthors, setActiveAuthor, instanceId])

  useEffect(() => {
    placeholderRefWrapper.current = placeholder
    if (editorRef?.current) {
      try {
        editorRef?.current?.commands?.updateAttributes('placeholder', {
          placeholder: placeholder,
        })
      } catch {
        console.log('error')
      }
    }
  }, [placeholder, editorRef?.current])

  return (
    <div
      tabIndex={-1}
      className={
        compactMode && !changelog
          ? cn('text-[15px] min-h-[110px]', className)
          : 'full-functionality-editor -ml-8'
      }
    >
      <BlockEditor changelog={changelog ? true : false} compactMode={compactMode} editor={editor} />
      {insideContent ? (
        <div
          className={`absolute bottom-0.5 ml-0.5 right-0.5  ${
            hideBg && 'backdrop-blur-lg transform-gpu dark:bg-transparent bg-[#FBFCFD]'
          }`}
        >
          {insideContent}
        </div>
      ) : null}
    </div>
  )
}

export default TextEditor
