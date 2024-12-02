import { Icon } from '@/components/editor/components/ui/Icon'
import { Toolbar } from '@/components/editor/components/ui/Toolbar'
import { useTextmenuCommands } from './hooks/useTextmenuCommands'
import { useTextmenuStates } from './hooks/useTextmenuStates'
import { BubbleMenu, Editor } from '@tiptap/react'
import { memo } from 'react'
// import * as Popover from '@radix-ui/react-popover'
import { ColorPicker } from '@/components/editor/components/panels'
import { FontFamilyPicker } from './components/FontFamilyPicker'
import { FontSizePicker } from './components/FontSizePicker'
import { useTextmenuContentTypes } from './hooks/useTextmenuContentTypes'
import { ContentTypePicker } from './components/ContentTypePicker'
import { EditLinkPopover } from './components/EditLinkPopover'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/radix/Popover'

// We memorize the button so each button is not rerendered
// on every editor state change
const MemoButton = memo(Toolbar.Button)
const MemoColorPicker = memo(ColorPicker)
const MemoFontFamilyPicker = memo(FontFamilyPicker)
const MemoFontSizePicker = memo(FontSizePicker)
const MemoContentTypePicker = memo(ContentTypePicker)

export type TextMenuProps = {
  editor: Editor
  compactMode: boolean
}

export const TextMenu = ({ editor, compactMode }: TextMenuProps) => {
  const commands = useTextmenuCommands(editor)
  const states = useTextmenuStates(editor)
  const blockOptions = useTextmenuContentTypes(editor)

  return (
    <BubbleMenu
      tippyOptions={{
        popperOptions: { placement: 'top-start' },
        maxWidth: '100%',
        interactive: true,
      }}
      editor={editor}
      pluginKey="textMenu"
      shouldShow={states.shouldShow}
      updateDelay={100}
      className="z-[100]"
    >
      <div
        onMouseDown={(e) => {
          e.stopPropagation()
          e.preventDefault()
        }}
        className="flex items-center overflow-hidden rounded-md lighter-dropdown-background"
      >
        <MemoContentTypePicker compactMode={compactMode} options={blockOptions} />
        {/* <MemoFontFamilyPicker onChange={commands.onSetFont} value={states.currentFont || ''} /> */}
        {/* <MemoFontSizePicker onChange={commands.onSetFontSize} value={states.currentSize || ''} /> */}
        <Toolbar.Divider />
        <MemoButton
          tooltip="Bold"
          tooltipShortcut={['Mod', 'B']}
          onClick={commands.onBold}
          active={states.isBold}
        >
          <Icon name="Bold" />
        </MemoButton>
        <MemoButton
          tooltip="Italic"
          tooltipShortcut={['Mod', 'I']}
          onClick={commands.onItalic}
          active={states.isItalic}
        >
          <Icon name="Italic" />
        </MemoButton>
        <MemoButton
          tooltip="Underline"
          tooltipShortcut={['Mod', 'U']}
          onClick={commands.onUnderline}
          active={states.isUnderline}
        >
          <Icon name="Underline" />
        </MemoButton>
        <MemoButton
          tooltip="Strikehrough"
          tooltipShortcut={['Mod', 'Shift', 'S']}
          onClick={commands.onStrike}
          active={states.isStrike}
        >
          <Icon name="Strikethrough" />
        </MemoButton>
        <MemoButton
          tooltip="Code"
          tooltipShortcut={['Mod', 'E']}
          onClick={commands.onCode}
          active={states.isCode}
        >
          <Icon name="Code" />
        </MemoButton>

        <MemoButton tooltip="Code block" onClick={commands.onCodeBlock}>
          <Icon name="Code2" />
        </MemoButton>
        {!compactMode && (
          <>
            <Toolbar.Divider />
            <Popover modal={false}>
              <PopoverTrigger
                asChild
                className="gap-2 text-gray-500 border-none rounded-none hover:bg-secondary-foreground/5 dark:text-secondary-foreground focus:ring-0"
              >
                <MemoButton active={!!states.currentHighlight} tooltip="Highlight text">
                  <Icon name="Highlighter" />
                </MemoButton>
              </PopoverTrigger>
              <PopoverContent
                disableResizeAnimation={true}
                align="center"
                className="w-[235px] overflow-hidden pb-1.5 gap-0.5"
              >
                <MemoColorPicker
                  color={states.currentHighlight}
                  onChange={commands.onChangeHighlight}
                  onClear={commands.onClearHighlight}
                  highlight={true}
                />
              </PopoverContent>
            </Popover>
            <Popover modal={false}>
              <PopoverTrigger
                asChild
                className="gap-2 text-gray-500 border-none rounded-none hover:bg-secondary-foreground/5 dark:text-secondary-foreground focus:ring-0"
              >
                <MemoButton active={!!states.currentColor} tooltip="Text color">
                  <Icon name="Palette" />
                </MemoButton>
              </PopoverTrigger>
              <PopoverContent
                disableResizeAnimation={true}
                align="center"
                className="w-[235px] overflow-hidden pb-1.5 gap-0.5"
              >
                <MemoColorPicker
                  color={states.currentColor}
                  onChange={commands.onChangeColor}
                  onClear={commands.onClearColor}
                />
              </PopoverContent>
            </Popover>
          </>
        )}

        <Popover modal={false}>
          <PopoverTrigger
            asChild
            className="gap-2 text-gray-500 border-none rounded-none hover:bg-secondary-foreground/5 dark:text-secondary-foreground focus:ring-0"
          >
            <MemoButton tooltip="More options">
              <Icon name="MoreVertical" />
            </MemoButton>
          </PopoverTrigger>
          <PopoverContent className="w-[135px]" align="center">
            <div className="p-0 flex items-center  gap-0.5">
              {/* <MemoButton
                bottomTooltip={true}
                tooltip="Subscript"
                tooltipShortcut={['Mod', '.']}
                onClick={commands.onSubscript}
                active={states.isSubscript}
              >
                <Icon name="Subscript" />
              </MemoButton>
              <MemoButton
                bottomTooltip={true}
                tooltip="Superscript"
                tooltipShortcut={['Mod', ',']}
                onClick={commands.onSuperscript}
                active={states.isSuperscript}
              >
                <Icon name="Superscript" />
              </MemoButton>
              <Toolbar.Divider /> */}
              <MemoButton
                tabIndex={-1}
                bottomTooltip={true}
                tooltip="Align left"
                tooltipShortcut={['Shift', 'Mod', 'L']}
                onClick={commands.onAlignLeft}
                active={states.isAlignLeft}
              >
                <Icon name="AlignLeft" />
              </MemoButton>
              <MemoButton
                tabIndex={-1}
                bottomTooltip={true}
                tooltip="Align center"
                tooltipShortcut={['Shift', 'Mod', 'E']}
                onClick={commands.onAlignCenter}
                active={states.isAlignCenter}
              >
                <Icon name="AlignCenter" />
              </MemoButton>
              <MemoButton
                tabIndex={-1}
                bottomTooltip={true}
                tooltip="Align right"
                tooltipShortcut={['Shift', 'Mod', 'R']}
                onClick={commands.onAlignRight}
                active={states.isAlignRight}
              >
                <Icon name="AlignRight" />
              </MemoButton>
              <MemoButton
                tabIndex={-1}
                bottomTooltip={true}
                tooltip="Justify"
                tooltipShortcut={['Shift', 'Mod', 'J']}
                onClick={commands.onAlignJustify}
                active={states.isAlignJustify}
              >
                <Icon name="AlignJustify" />
              </MemoButton>
            </div>
          </PopoverContent>
        </Popover>

        {/* 
          <Popover.Trigger asChild>
            <MemoButton tooltip="More options">
              <Icon name="MoreVertical" />
            </MemoButton>
          </Popover.Trigger>
          <Popover.Content side="top" asChild>
            <Toolbar.Wrapper>
              <MemoButton
                tooltip="Subscript"
                tooltipShortcut={['Mod', '.']}
                onClick={commands.onSubscript}
                active={states.isSubscript}
              >
                <Icon name="Subscript" />
              </MemoButton>
              <MemoButton
                tooltip="Superscript"
                tooltipShortcut={['Mod', ',']}
                onClick={commands.onSuperscript}
                active={states.isSuperscript}
              >
                <Icon name="Superscript" />
              </MemoButton>
              <Toolbar.Divider />
              <MemoButton
                tooltip="Align left"
                tooltipShortcut={['Shift', 'Mod', 'L']}
                onClick={commands.onAlignLeft}
                active={states.isAlignLeft}
              >
                <Icon name="AlignLeft" />
              </MemoButton>
              <MemoButton
                tooltip="Align center"
                tooltipShortcut={['Shift', 'Mod', 'E']}
                onClick={commands.onAlignCenter}
                active={states.isAlignCenter}
              >
                <Icon name="AlignCenter" />
              </MemoButton>
              <MemoButton
                tooltip="Align right"
                tooltipShortcut={['Shift', 'Mod', 'R']}
                onClick={commands.onAlignRight}
                active={states.isAlignRight}
              >
                <Icon name="AlignRight" />
              </MemoButton>
              <MemoButton
                tooltip="Justify"
                tooltipShortcut={['Shift', 'Mod', 'J']}
                onClick={commands.onAlignJustify}
                active={states.isAlignJustify}
              >
                <Icon name="AlignJustify" />
              </MemoButton>
            </Toolbar.Wrapper>
          </Popover.Content>
        </Popover.Root> */}
        <Toolbar.Divider />

        <EditLinkPopover onSetLink={commands.onLink} />
      </div>
    </BubbleMenu>
  )
}
