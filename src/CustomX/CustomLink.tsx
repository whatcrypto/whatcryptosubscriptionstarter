import React, { ReactNode } from 'react'
import { LinkProps } from 'next/dist/client/link' // Import LinkProps for typing
import { getAccessToken } from 'network/apiClient'
import NextLink from "next/link"

interface MyLinkProps extends LinkProps {
  children: ReactNode
  className?: string
}

const Link: React.FC<MyLinkProps> = ({ href, children, className, ...props }) => {
  const accessToken = getAccessToken()

  let hrefWithAppendedToken = href
  if (accessToken && typeof window !== 'undefined') {
    try {
      const url = new URL(href.toString(), window.location.origin)
      url.searchParams.append('jwt', accessToken)
      hrefWithAppendedToken = url.toString() // Convert URL object to string
    } catch (error) {
      console.error(
        'Error parsing URL:',
        error,
        'href',
        href.toString(),
        'origin',
        window.location.origin
      )
    }
  }

  let isAsPath = false
  // Check if first character of href is ?
  if (href && href.toString().charAt(0) === '?') {
    isAsPath = true
  }

  return (
    <NextLink
      legacyBehavior
      as={props.as ? props.as : accessToken ? href : undefined}
      href={accessToken && !isAsPath ? hrefWithAppendedToken : href}
      className={className}
      {...props}
    >
      {children}
    </NextLink>
  )
}

export default Link
