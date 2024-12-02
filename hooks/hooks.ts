import { useState, useEffect } from 'react'

const useStickyObserver = (
  stickyRef: React.RefObject<HTMLElement>,
  sentinelRef: React.RefObject<HTMLElement>
) => {
  const [isSticky, setIsSticky] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsSticky(!entry.isIntersecting), {
      threshold: [1],
    })

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current)
      }
    }
  }, [stickyRef, sentinelRef])

  return isSticky
}

export default useStickyObserver

// export const CreateEditorInstance = (
//   uploadImage?: (file: any) => Promise<unknown>,
//   staticPlaceholderRefWrapper?: React.MutableRefObject<(ref: any) => string | undefined>,
//   author?: string,
//   height?: number,
//   formData?: any,
//   changelog?: boolean
// ) =>
//   useEditor({
//     extensions: [
//       Placeholder.configure({
//         // emptyEditorClass:
//         //   ' text-[13px] w-full before:content-[attr(data-placeholder)] before:text-background-accent/90 before:dark:text-foreground/80 before:pointer-events-none',
//         // Use a placeholder:
//         //@ts-ignore
//         placeholder: staticPlaceholderRefWrapper?.current,
//         includeChildren: true,
//         emptyNodeClass: 'h-full after:text-background-accent/60 after:dark:text-foreground/60',
//         // Use different placeholders depending on the node type:
//       }),
//       Mention.configure({
//         HTMLAttributes: {
//           class: 'dark:bg-border bg-[#E9ECF1] px-1 py-0.5 text-sm shadow-none rounded-md',
//         },
//         renderLabel({ options, node }) {
//           return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
//         },

//         suggestion: {
//           allowSpaces: true,
//           decorationClass:
//             'dark:bg-border bg-[#E9ECF1] px-1 py-0.5 text-sm shadow-none rounded-md',
//           render: () => {
//             let reactRenderer: ReactRenderer

//             return {
//               onStart: (props) => {
//                 reactRenderer = new ReactRenderer(MentionList, {
//                   props: {
//                     ...props,
//                     author: author,
//                   },
//                   editor: props.editor,
//                 })
//               },

//               onUpdate(props) {
//                 // if ends with 3 spaces we exit the editor
//                 reactRenderer?.updateProps(props)
//               },

//               onKeyDown(props) {
//                 if (props.event.key === 'Escape') {
//                   reactRenderer?.destroy()
//                   return true
//                 }

//                 return (reactRenderer?.ref as any)?.onKeyDown(props)
//               },

//               onExit() {
//                 reactRenderer.destroy()
//               },
//             }
//           },
//         },
//       }),
//       StarterKit,
//       Youtube.configure({
//         inline: false,
//       }),
//       // @ts-ignore
//       TipTapCustomImage(uploadImage),
//       Link.configure({
//         HTMLAttributes: {
//           class: 'text-indigo-500 dark:text-indigo-300 cursor-pointer',
//         },
//         openOnClick: false,
//       }),
//     ],
//     autofocus: false,
//     editorProps: {
//       attributes: {
//         style: `min-height: ${height}px; padding-bottom: ${changelog ? 32 : 12}px;`,
//         class: `focus:outline-none outline-none`,
//       },
//     },

//     content: formData.content,
//   })
