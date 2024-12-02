import { useCurrentOrganization } from '@/data/organization'
import { IOrganization } from '@/interfaces/IOrganization'
import chroma from 'chroma-js'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
interface LCH {
  lightness: number
  chroma: number
  hue: number
}

function hexToLCH(hex: string): LCH {
  // Convert RGBA to Chroma instance
  const color = chroma(hex)

  // Get LCH values
  const [lightness, chromaValue, hue] = color.hsl()

  // Return LCH object with original hue
  return {
    lightness,
    chroma: chromaValue,
    hue,
  }
}

interface ColorProperties {
  [key: string]: string
}

interface SaturatedColors {
  [key: string]: string
}

function saturateColorsWithPrimary(
  primaryColorHex: string,
  colors: ColorProperties,
  theme: 'light' | 'dark',
  customTheme: {
    graySaturator: string
    graySaturation: number
    enabled: boolean
  },
  maxSaturation?: boolean
): SaturatedColors {
  if (!customTheme.enabled) return colors
  const backgroundColor = chroma(customTheme.graySaturator)
  const modifiedColors: SaturatedColors = {}

  const targetHue = backgroundColor.hsl()[0]
  const backgroundLightness = backgroundColor.get('hsl.l')
  const darkerTheme = backgroundLightness < 0.06

  // Precalculate target contrasts
  const targetContrasts = {
    secondary: darkerTheme ? 1.18 : 1.1,
    card: darkerTheme ? 1.13 : 1.035,
    border: darkerTheme ? 1.3 : 1.23,
    'dark-accent': darkerTheme ? 1.35 : 1.4,
    background: 1,
    muted: 1.4,
    'muted-foreground': 1.3,
    popover: darkerTheme ? 1.05 : 1,
    'popover-foreground': 1.2,
    input: 1.2,
    'background-accent': 3.2,
  }

  const backgroundAdjustedContrast = new Set([
    'background',
    'muted',
    'dark-accent',
    'popover',
    'border',
    'input',
    'card',
    'secondary',
    'destructive',
    'darker-bg',
    'background-accent',
  ])

  // Precalculate color adjustment functions
  const adjustLightness =
    backgroundLightness < 0.5
      ? (color: chroma.Color, amount: number) => color.brighten(amount)
      : (color: chroma.Color, amount: number) => color.darken(amount)

  function adjustColorForContrast(key: string, bgColor: chroma.Color): chroma.Color {
    if (key === 'darker-bg') {
      const maxAdjustment = darkerTheme ? 0.4 : 0.6
      const minAdjustment = darkerTheme ? 0.3 : 0.5
      let lightnessAdjustment = darkerTheme
        ? maxAdjustment * (1 - backgroundLightness / 0.02)
        : minAdjustment + (maxAdjustment - minAdjustment) * (backgroundLightness / 0.94)

      lightnessAdjustment = Math.max(minAdjustment, Math.min(maxAdjustment, lightnessAdjustment))

      return chroma.hsl(
        darkerTheme ? 255 : 0,
        0,
        darkerTheme
          ? backgroundLightness + lightnessAdjustment
          : backgroundLightness - lightnessAdjustment
      )
    }

    const targetContrast = targetContrasts[key as keyof typeof targetContrasts] || 1.2
    let adjustedColor = chroma(bgColor.hex()) // Create a new color instance
    let currentContrast = chroma.contrast(bgColor, adjustedColor)

    const step = 0.03
    const maxIterations = 100

    for (let i = 0; i < maxIterations; i++) {
      if (Math.abs(currentContrast - targetContrast) <= 0.01) break

      adjustedColor =
        currentContrast < targetContrast
          ? adjustLightness(adjustedColor, step)
          : adjustLightness(adjustedColor, -step)

      currentContrast = chroma.contrast(bgColor, adjustedColor)
    }

    return adjustedColor
  }

  // Use a single loop to process all colors
  for (const [key, value] of Object.entries(colors)) {
    if (key === 'background') {
      modifiedColors[key] = getValueinHSLString(backgroundColor.hex())
    } else if (backgroundAdjustedContrast.has(key)) {
      const adjustedColor = adjustColorForContrast(key, backgroundColor)
      modifiedColors[key] = getValueinHSLString(adjustedColor.hex())
    } else {
      const [h, s, l] = value.split(' ').map((n, i) => parseFloat(n) / (i === 0 ? 1 : 100))
      const adjustedColor = chroma.hsl(targetHue, s, l)
      const newColor = chroma.mix(
        chroma.hsl(h, s, l),
        adjustedColor,
        key === 'background-accent' ? 0.7 : 0.3,
        'oklch'
      )
      modifiedColors[key] = getValueinHSLString(newColor.hex())
    }
  }

  return modifiedColors
}

// Helper function (unchanged)
const getValueinHSLString = (color: string) => {
  const [h, s, l] = chroma(color).hsl()
  return `${h || 0} ${s * 100 || 0}% ${l * 100 || 0}%`
}

const colorProperties: ColorProperties = {
  background: '224 22% 13.2%',
  foreground: '227 21% 75%',
  'background-accent': '227 22% 46%',
  muted: '227 21% 18%',
  'muted-foreground': '226.667 21% 75% 0.8',
  'dark-accent': '227 21% 25%',
  'dark-accent-foreground': '225 22% 89%',
  popover: '226 24% 11%',
  'popover-foreground': '227 21% 75%',
  border: '226 20% 21%',
  input: '227 21% 18%',
  card: '226 22% 14.5%',
  'card-foreground': '227 21% 75%',
  secondary: '227 21% 18%',
  'secondary-foreground': '227 21% 75%',
  destructive: '0 63% 31%',
  'destructive-foreground': '210 40% 98%',
  'darker-bg': '224 22% 8%',
}

const colorPropertiesLight: ColorProperties = {
  background: '220 33% 98%',
  foreground: '227 21% 39%',
  muted: '225 22% 89% 0.4',
  'muted-foreground': '227 22% 46%',
  'background-accent': '227 22% 46%',
  popover: '0 0% 100%',
  'popover-foreground': '227 21% 39%',
  border: '225 22% 89% / 0.8',
  input: '225 22% 89%',
  card: '0 0% 100%',
  'card-foreground': '227 21% 39%',
  secondary: '0 0% 100%',
  'secondary-foreground': '226.667 22% 32%',
  'dark-accent': '225 22% 89% / 0.6',
  destructive: '0 100% 50%',
  'destructive-foreground': '210 40% 98%',
  'darker-bg': '220 33% 90%',
}

export const getCompiledTheme = (
  theme: 'light' | 'dark',
  org: IOrganization,
  returnObject = false,
  maxSaturation = false
) => {
  const modifiedColors = saturateColorsWithPrimary(
    org?.color,
    theme === 'light' ? colorPropertiesLight : colorProperties,
    theme,
    org.settings.customTheme,
    maxSaturation
  )
  if (returnObject) return modifiedColors
  let cssString = ''
  Object.entries(modifiedColors).forEach(([key, value]) => {
    cssString += `--${key}: ${value};`
  })
  return cssString
}

export const getDarkerPrimaryColor = (org: IOrganization) => {
  // Get color luminance
  const inputColor = org?.color || '#000'
  const color = chroma(inputColor)
  const luminance = color.luminance()

  let textColor = '#fff'

  if (luminance > 0.45) {
    // Make color much darker
    textColor = color.darken(5).hex()
  }

  let baseColor = chroma(luminance < 0.45 ? '#fff' : '#000')

  // Extract the lightness from the base color
  const baseLightness = baseColor.lch()[0] // L in LCH is similar to Lightness in HSL

  // Assuming 'newColorHex' is the hex code for the color you want to adjust
  // For demonstration, let's say we're changing to a different color
  // 'org?.color || '#000'' suggests optional chaining, implying 'org' might be an object with an optional color property
  let newColorHex = textColor || '#000' // Example new color hex

  // To adjust the new color to have the same lightness as the base color,
  // first, convert the new color hex to a Chroma color object to extract its C (chroma) and H (hue) values.
  let newColorLCH = chroma(newColorHex).lch()

  // Then, create a new color with the same lightness as the base color,
  // using the C and H from the new color's original LCH values.
  let adjustedColor = chroma.lch(baseLightness, newColorLCH[1], newColorLCH[2])

  // Now, get the hex value of the adjusted color
  newColorHex = adjustedColor.hex()

  return getValueinHSLString(newColorHex)
}

export const getLighterPrimaryColor = (org: IOrganization, returnHex = false) => {
  // Assume we're starting with a base color
  let baseColor = chroma('#818cf8')

  // Extract the lightness from the base color
  const baseLightness = baseColor.lch()[0] // L in LCH is similar to Lightness in HSL

  // Assuming 'newColorHex' is the hex code for the color you want to adjust
  // For demonstration, let's say we're changing to a different color
  // 'org?.color || '#000'' suggests optional chaining, implying 'org' might be an object with an optional color property
  let newColorHex = org?.color || '#000' // Example new color hex

  // To adjust the new color to have the same lightness as the base color,
  // first, convert the new color hex to a Chroma color object to extract its C (chroma) and H (hue) values.
  let newColorLCH = chroma(newColorHex).lch()

  // Then, create a new color with the same lightness as the base color,
  // using the C and H from the new color's original LCH values.
  let adjustedColor = chroma.lch(baseLightness, newColorLCH[1], newColorLCH[2])

  // Now, get the hex value of the adjusted color
  newColorHex = adjustedColor.hex()

  if (returnHex) return newColorHex

  return getValueinHSLString(newColorHex)
}

export const getRegularPrimaryColor = (org: IOrganization) => {
  // Assume we're starting with a base color
  let baseColor = chroma('#4f46e5')

  // Extract the lightness from the base color
  const baseLightness = baseColor.lch()[0] // L in LCH is similar to Lightness in HSL

  // Assuming 'newColorHex' is the hex code for the color you want to adjust
  // For demonstration, let's say we're changing to a different color
  // 'org?.color || '#000'' suggests optional chaining, implying 'org' might be an object with an optional color property
  let newColorHex = org?.color || '#000' // Example new color hex

  // To adjust the new color to have the same lightness as the base color,
  // first, convert the new color hex to a Chroma color object to extract its C (chroma) and H (hue) values.
  let newColorLCH = chroma(newColorHex).lch()

  // Then, create a new color with the same lightness as the base color,
  // using the C and H from the new color's original LCH values.
  let adjustedColor = chroma.lch(baseLightness, newColorLCH[1], newColorLCH[2])

  // Now, get the hex value of the adjusted color
  newColorHex = adjustedColor.hex()

  return getValueinHSLString(newColorHex)
}

function adjustLightnessToMatchBaseColor(baseColorHex: string, newColorHex: string): string {
  // Convert the base color to a Chroma color object
  const baseColor = chroma(baseColorHex)

  // Extract the lightness from the base color
  const baseLightness = baseColor.lch()[0] // L in LCH is similar to Lightness in HSL

  // Convert the new color hex to a Chroma color object to extract its LCH values
  const newColorLCH = chroma(newColorHex).lch()

  // Create a new color with the same lightness as the base color,
  // using the C and H from the new color's original LCH values
  const adjustedColor = chroma.lch(baseLightness, newColorLCH[1], newColorLCH[2])

  // Return the hex value of the adjusted color
  return adjustedColor.hex()
}

const CustomThemeHandler: React.FC<{
  children: React.ReactNode
  useCustomWhenDark?: boolean
  maxSaturation?: boolean
}> = ({ children, useCustomWhenDark, maxSaturation = false }) => {
  const { org } = useCurrentOrganization()

  const router = useRouter()

  const primaryColor = useMemo(() => {
    if (!org?.color)
      return {
        lightness: 0,
        chroma: 0,
        hue: 0,
      }
    return hexToLCH(org?.color)
  }, [org])

  const primaryColorLuminance = useMemo(() => {
    return getDarkerPrimaryColor(org)
  }, [org])

  const regularPrimaryColor = useMemo(() => {
    return getRegularPrimaryColor(org)
  }, [org])

  const lighterPrimaryColor = useMemo(() => {
    return getLighterPrimaryColor(org)
  }, [org])

  const darkerPrimaryColor = useMemo(() => {
    // Assume we're starting with a base color
    let baseColor = chroma('#000')

    // Extract the lightness from the base color
    const baseLightness = baseColor.lch()[0] // L in LCH is similar to Lightness in HSL

    // Assuming 'newColorHex' is the hex code for the color you want to adjust
    // For demonstration, let's say we're changing to a different color
    // 'org?.color || '#000'' suggests optional chaining, implying 'org' might be an object with an optional color property
    let newColorHex = org?.color || '#000' // Example new color hex

    // To adjust the new color to have the same lightness as the base color,
    // first, convert the new color hex to a Chroma color object to extract its C (chroma) and H (hue) values.
    let newColorLCH = chroma(newColorHex).lch()

    // Then, create a new color with the same lightness as the base color,
    // using the C and H from the new color's original LCH values.
    let adjustedColor = chroma.lch(baseLightness, newColorLCH[1], newColorLCH[2])

    // Now, get the hex value of the adjusted color
    newColorHex = adjustedColor.hex()

    return getValueinHSLString(newColorHex)
  }, [org])

  const accentForegroundDark = useMemo(() => {
    // Assume we're starting with a base color
    let baseColor = chroma('#c7d2fe')

    // Extract the lightness from the base color
    const baseLightness = baseColor.lch()[0] // L in LCH is similar to Lightness in HSL

    // Assuming 'newColorHex' is the hex code for the color you want to adjust
    // For demonstration, let's say we're changing to a different color
    // 'org?.color || '#000'' suggests optional chaining, implying 'org' might be an object with an optional color property
    let newColorHex = org?.color || '#000' // Example new color hex

    // To adjust the new color to have the same lightness as the base color,
    // first, convert the new color hex to a Chroma color object to extract its C (chroma) and H (hue) values.
    let newColorLCH = chroma(newColorHex).lch()

    // Then, create a new color with the same lightness as the base color,
    // using the C and H from the new color's original LCH values.
    let adjustedColor = chroma.lch(baseLightness, newColorLCH[1], newColorLCH[2])

    // Now, get the hex value of the adjusted color
    newColorHex = adjustedColor.hex()

    return getValueinHSLString(newColorHex)
  }, [org])

  const portalWidgetDarkBackground = useMemo(() => {
    const baseColorHex = '#4f46e5' // Base color hex code
    const newColorHex = org?.color || '#000' // New color hex code (with optional chaining)

    const adjustedColorHex = adjustLightnessToMatchBaseColor(baseColorHex, newColorHex)

    return getValueinHSLString(adjustedColorHex)
  }, [org])

  const portalWidgetLighterBackground = useMemo(() => {
    const baseColorHex = '#000' // Base color hex code
    const newColorHex = org?.color || '#000' // New color hex code (with optional chaining)

    const adjustedColorHex = adjustLightnessToMatchBaseColor(baseColorHex, newColorHex)

    return getValueinHSLString(adjustedColorHex)
  }, [org])

  return (
    <>
      <style>
        {primaryColor &&
          `
            :root {
                --primary: ${primaryColor.lightness || 0} ${primaryColor.chroma * 100 || 0}% ${
                  primaryColor.hue * 100 || 0
                }%;
                --primary-foreground: ${primaryColorLuminance};
                --accent: ${lighterPrimaryColor};
                --accent-foreground: ${darkerPrimaryColor};
                --modified-primary: ${regularPrimaryColor};
                   --portal-widget-dark-background: ${portalWidgetDarkBackground};
                --portal-widget-lighter-background: ${portalWidgetLighterBackground};
              }
              .dark {
                --primary: ${primaryColor.lightness || 0} ${primaryColor.chroma * 100 || 0}% ${
                  primaryColor.hue * 100 || 0
                }%;
                --primary-foreground: ${primaryColorLuminance};
                --accent: ${lighterPrimaryColor};
                --accent-foreground: ${accentForegroundDark};
                --modified-primary: ${regularPrimaryColor};
                ${
                  !router.pathname.startsWith('/dashboard') && !org?.settings?.customTheme?.enabled
                    ? '--background: 224 22% 13.2%;'
                    : ''
                }
                  ${
                    (!router.pathname.startsWith('/dashboard') &&
                      org?.settings?.customTheme?.enabled) ||
                    useCustomWhenDark
                      ? getCompiledTheme('dark', org, false, maxSaturation)
                      : ''
                  }
                --portal-widget-dark-background: ${portalWidgetDarkBackground};
                --portal-widget-lighter-background: ${portalWidgetLighterBackground};
            }
            `}
      </style>
      {children}
    </>
  )
}

export default CustomThemeHandler
