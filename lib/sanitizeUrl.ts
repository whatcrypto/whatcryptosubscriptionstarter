const sanitizeUrl = (inputUrl: string) => {
  try {
    const url = new URL(inputUrl)

    // Disallow non-http(s) protocols
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error('Invalid protocol')
    }

    return url.toString()
  } catch (error: any) {
    return null // or a default safe URL, or handle however you'd prefer
  }
}

export default sanitizeUrl
