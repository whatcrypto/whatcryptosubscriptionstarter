import { Editor } from '@tiptap/react'

import {
  Figcaption,
  HorizontalRule,
  ImageBlock,
  ImageUpload,
  Link,
  CodeBlock,
} from '@/components/editor/extensions/index'
import { TableOfContentsNode } from '@/components/editor/extensions/TableOfContentsNode'
import MulticodeExtension from '@/components/editor/extensions/MultipleCodeBlock/MulticodeExtension'

export const isTableGripSelected = (node: HTMLElement) => {
  let container = node

  while (container && !['TD', 'TH'].includes(container.tagName)) {
    container = container.parentElement!
  }

  const gripColumn =
    container && container.querySelector && container.querySelector('a.grip-column.selected')
  const gripRow =
    container && container.querySelector && container.querySelector('a.grip-row.selected')

  if (gripColumn || gripRow) {
    return true
  }

  return false
}

export const isCustomNodeSelected = (editor: Editor, node: HTMLElement) => {
  const customNodes = [
    HorizontalRule.name,
    ImageBlock.name,
    ImageUpload.name,
    CodeBlock.name,
    ImageBlock.name,
    Link.name,
    Figcaption.name,
    TableOfContentsNode.name,
    MulticodeExtension.name,
  ]

  return customNodes.some((type) => editor.isActive(type)) || isTableGripSelected(node)
}

export default isCustomNodeSelected
