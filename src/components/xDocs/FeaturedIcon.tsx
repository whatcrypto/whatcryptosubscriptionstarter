import React, { useMemo, useState } from 'react'
import SVG from 'react-inlinesvg'
import DOMPurify from 'dompurify'
import { IHelpCenterArticleDocument } from '@/interfaces/IHelpCenter'
import { IconList, IconPickerItem } from '../iconpicker'
import { cn } from '@/lib'
import sanitizeUrl from '@/lib/sanitizeUrl'

const FeaturedIcon: React.FC<{
  icon: IHelpCenterArticleDocument['icon']
  small?: boolean
  large?: boolean
  inButton?: boolean
}> = ({ icon, small, large, inButton }) => {
  const [isLoading, setIsLoading] = useState(true)

  // Determine the size class based on the props
  const sizeClass = large ? '!h-12 !w-12' : small ? '!h-4 !w-4' : '!h-5 !w-5'

  // Safely sanitize the icon URL
  const sanitizedIconUrl = useMemo(() => {
    if (typeof icon?.value !== 'string') return null

    try {
      return sanitizeUrl(icon.value)
    } catch (error) {
      return null
    }
  }, [icon?.value])

  const renderIcon = () => {
    if (!icon) return null

    switch (icon.type) {
      case 'emoji':
        return (
          <span className={cn(large ? 'text-4xl' : small ? 'text-sm' : 'text-base')}>
            {icon.value}
          </span>
        )

      case 'predefined':
        return (
          <IconPickerItem
            noSize={inButton}
            icon={icon.value as IconList}
            size={large ? 12 : small ? 4 : 5}
          />
        )

      case 'external':
        if (typeof icon.value !== 'string' || !sanitizedIconUrl) return null

        if (icon.value.toLowerCase().endsWith('.svg')) {
          // Render SVG icon
          return (
            <>
              {isLoading && (
                <div
                  className={cn(
                    sizeClass,
                    'animate-pulse bg-gray-50 dark:bg-foreground/[15%] rounded-full'
                  )}
                />
              )}
              <SVG
                src={sanitizedIconUrl}
                className={cn(sizeClass, 'aspect-auto', { hidden: isLoading })}
                preProcessor={(code) => {
                  // Sanitize the SVG code to prevent XSS attacks
                  const cleanSvg = DOMPurify.sanitize(code, { USE_PROFILES: { svg: true } })
                  const parser = new DOMParser()
                  const doc = parser.parseFromString(cleanSvg, 'image/svg+xml')

                  doc.querySelectorAll('*').forEach((el) => {
                    // Clean up 'style' attribute
                    let style = el.getAttribute('style')
                    if (style) {
                      // Replace 'stroke' and 'fill' with 'currentColor', if applicable
                      style = style.replace(/(stroke|fill)\s*:\s*[^;]+/gi, (match, p1) => {
                        const value = match.split(':')[1].trim()
                        if (value.toLowerCase() !== 'none') {
                          return `${p1}: currentColor`
                        }
                        return match
                      })
                      el.setAttribute('style', style)
                    }

                    // Update 'stroke' attribute
                    const strokeValue = el.getAttribute('stroke')
                    if (strokeValue && strokeValue.toLowerCase() !== 'none') {
                      el.setAttribute('stroke', 'currentColor')
                    }

                    // Update 'fill' attribute
                    const fillValue = el.getAttribute('fill')
                    if (fillValue && fillValue.toLowerCase() !== 'none') {
                      el.setAttribute('fill', 'currentColor')
                    }
                  })

                  const serializedSvg = new XMLSerializer().serializeToString(doc)
                  // Final sanitization of the modified SVG
                  return DOMPurify.sanitize(serializedSvg, { USE_PROFILES: { svg: true } })
                }}
                onLoad={() => setIsLoading(false)}
                onError={(error) => {
                  console.error('Error loading SVG:', error)
                  setIsLoading(false)
                }}
              />
            </>
          )
        } else {
          // Render non-SVG image
          return (
            <img
              src={sanitizedIconUrl}
              alt="Custom icon"
              className={cn(sizeClass, 'aspect-auto object-contain')}
              onLoad={() => setIsLoading(false)}
              onError={(error) => {
                console.error('Error loading image:', error)
                setIsLoading(false)
              }}
            />
          )
        }

      default:
        return null
    }
  }

  return (
    <div role="img" aria-label="Featured icon">
      {renderIcon()}
    </div>
  )
}

export default FeaturedIcon
