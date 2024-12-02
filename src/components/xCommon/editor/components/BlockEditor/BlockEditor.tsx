import { Editor, EditorContent, PureEditorContent } from '@tiptap/react'
import React, { useMemo, useRef } from 'react'

import { LinkMenu } from '@/components/editor/components/menus'
import { EditorContext } from '@/context/EditorContext'
import ImageBlockMenu from '@/components/editor/extensions/ImageBlock/components/ImageBlockMenu'
import { ColumnsMenu } from '@/components/editor/extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from '@/components/editor/extensions/Table/menus'
import { TextMenu } from '../menus/TextMenu'
import { ContentItemMenu } from '../menus/ContentItemMenu'
import EditorMenu from '@/components/EditorMenu'
import { uploadFn } from '../../image-upload'

export const BlockEditor = ({
  editor,
  compactMode,
  changelog,
}: {
  editor: Editor | null
  compactMode: boolean
  changelog: boolean
}) => {
  const menuContainerRef = useRef(null)
  const editorRef = useRef<PureEditorContent | null>(null)

  const providerValue = useMemo(() => {
    return {}
  }, [])

  if (!editor) {
    return null
  }

  return (
    <EditorContext.Provider value={providerValue}>
      <div className="flex h-full w-full" ref={menuContainerRef}>
        <div className="relative flex flex-col flex-1 h-full w-full">
          {/* <EditorHeader
            characters={characterCount.characters()}
            collabState={collabState}
            users={displayedUsers}
            words={characterCount.words()}
          /> */}

          <LinkMenu editor={editor} appendTo={menuContainerRef} />
          <TextMenu compactMode={compactMode} editor={editor} />
          {!compactMode && (
            <>
              <ContentItemMenu editor={editor} />
              <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
              <TableRowMenu editor={editor} appendTo={menuContainerRef} />
              <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
            </>
          )}
          {changelog && (
            <>
              <ContentItemMenu editor={editor} />
              <TableRowMenu editor={editor} appendTo={menuContainerRef} />
              <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
            </>
          )}

          <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
          <EditorContent
            editor={editor}
            // @ts-ignore
            ref={editorRef}
            className="flex-1 overflow-y-auto overflow-x-auto max-w-full w-full"
            autoFocus={false}
            tabIndex={-1}
          />
        </div>
      </div>
      {compactMode && !changelog && <EditorMenu uploadFn={uploadFn} editor={editor} />}
    </EditorContext.Provider>
  )
}

export default BlockEditor
