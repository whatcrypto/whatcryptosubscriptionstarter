import { LinkEditorPanel } from '@/components/editor/components/panels'
import { Icon } from '@/components/editor/components/ui/Icon'
import { Toolbar } from '@/components/editor/components/ui/Toolbar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/radix/Popover'

export type EditLinkPopoverProps = {
  onSetLink: (link: string, openInNewTab?: boolean) => void
}

export const EditLinkPopover = ({ onSetLink }: EditLinkPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Toolbar.Button tooltip="Set Link">
          <Icon name="Link" />
        </Toolbar.Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="center">
        <LinkEditorPanel onSetLink={onSetLink} />
      </PopoverContent>
    </Popover>
  )
}
