import React from 'react'


import { tagColorData } from './AddTagModal'
import { useCurrentOrganization } from '@/data/organization'

const Callout: React.FC<{ background: string; editor: any; children: any }> = ({
  background: providedBg,
  editor,
  children,
}) => {
  const { org } = useCurrentOrganization()

  // const accentColor = useMemo(() => {
  //   if (!org) return 'hsl(0, 0%, 100%)'
  //   return getLighterPrimaryColor(org, true)
  // }, [org])

  // console.log('customTheme ', customTheme)

  // const accentColor = customTheme?.accent

  // if (customTheme) {
  //   borderColor = convertHSLToRGB(customTheme?.border)
  // }

  // const presetColros = [{ name: 'Accent', hex: accentColor }, ...tagColorData]

  const presetColros = [{ name: 'Accent', hex: '' }, ...tagColorData]

  const currentColor = providedBg.toString()?.startsWith('#')
    ? { name: 'Custom', hex: providedBg }
    : presetColros.find((color) => color.name === providedBg)

  const background = currentColor?.hex ? currentColor?.hex : 'hsl(var(--accent))'

  return (
    <div className="relative p-4 overflow-hidden rounded-md callout-component">
      <div
        className="absolute inset-0 rounded-md opacity-10"
        contentEditable={false}
        style={{
          background: background,
        }}
      ></div>
      <div
        className="absolute inset-0 rounded-md opacity-10"
        contentEditable={false}
        style={{
          border: `1px solid ${background}`,
        }}
      ></div>
      {editor}
      <div className="dark:!text-white relative">{children}</div>
    </div>
  )
}

export default Callout
