import { useCurrentOrganization } from '@/data/organization'
import { useQuery } from '@tinybirdco/charts'
import { useEffect, useState } from 'react'

export const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    return () => {
      setIsMounted(false)
    }
  }, [])

  return isMounted
}

// hooks/useDisableKeyboardScroll.ts
type Props = {
  wrapperRef: React.RefObject<HTMLElement>
}

export const useDisableKeyboardScroll = ({ wrapperRef }: Props) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Define keys that can trigger scrolling
      const keys = ['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown', 'Home', 'End']

      if (keys.includes(event.key) && wrapperRef.current?.contains(event.target as Node)) {
        event.preventDefault()
      }
    }

    // Add event listener
    document.addEventListener('keydown', handleKeyDown)

    // Remove event listener on cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [wrapperRef]) // Dependency array ensures effect runs only if containerRef changes
}

import * as React from 'react'

export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false)

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches)
    }

    const result = matchMedia(query)
    result.addEventListener('change', onChange)
    setValue(result.matches)

    return () => result.removeEventListener('change', onChange)
  }, [query])

  return value
}

export const useActiveHeader = (headers: any) => {
  const [activeHeader, setActiveHeader] = useState<string | null>(null)

  useEffect(() => {
    const options = {
      rootMargin: '40% 0px -35% 0px', // This value controls when the active element changes relative to the
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveHeader(entry.target.id)
        }
      })
    }, options)

    const filteredHeaders = headers.filter((header: any) =>
      ['h2', 'h3'].includes(header.tagName.toLowerCase())
    )

    const headerElements = filteredHeaders.map((header: any) => document.getElementById(header.id))

    headerElements.forEach((element: any) => element && observer?.observe(element))

    return () => {
      headerElements.forEach((element: any) => element && observer?.unobserve(element))
    }
  }, [headers])

  return activeHeader
}
