import { Node } from '@tiptap/core'

export interface IframeOptions {
  allowFullscreen: boolean
  HTMLAttributes: {
    [key: string]: any
  }
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      /**
       * Add an iframe
       */
      setIframe: (options: {
        src: string
        dataAttribute: { key: string; value: string }
      }) => ReturnType
    }
  }
}

export default Node.create<IframeOptions>({
  name: 'iframe',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      allowFullscreen: true,
      HTMLAttributes: {
        class: 'iframe-wrapper',
      },
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      frameborder: {
        default: 0,
      },
      allowfullscreen: {
        default: this.options.allowFullscreen,
        parseHTML: () => this.options.allowFullscreen,
      },
      class: {
        default: 'w-full shadow aspect-video rounded-xl',
      },
      // Dynamically handle custom data attributes
      'data-descript-video': {
        default: null,
      },
      'data-loom-video': {
        default: null,
      },
      'data-youtube-video': {
        default: null,
      },
      'data-iframe-embed': {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'iframe',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', this.options.HTMLAttributes, ['iframe', HTMLAttributes]]
  },

  addCommands() {
    return {
      setIframe:
        (options: { src: string; dataAttribute: { key: string; value: string } }) =>
        ({ tr, dispatch }) => {
          const { selection } = tr
          // Add the custom data attribute to the node options
          const attrs = {
            src: options.src,
            [options.dataAttribute.key]: options.dataAttribute.value,
          }
          const node = this.type.create(attrs)

          if (dispatch) {
            tr.replaceRangeWith(selection.from, selection.to, node)
          }

          return true
        },
    }
  },
})
