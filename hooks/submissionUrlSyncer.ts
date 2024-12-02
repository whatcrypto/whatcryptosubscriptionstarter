import { submissionUrlCache } from '@/atoms/submissionAtom'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

// Custom Hook
function useSubmissionUrl(asRestorer = false) {
  const router = useRouter()
  const [previousUrl, setPreviousUrl] = useAtom(submissionUrlCache) // Correctly initializing a ref with an empty string

  // Function to navigate to the new URL and store the current URL
  const setUrl = useCallback(
    (id: string) => {
      if (!id) return
      // Construct the new path
      const newPath = `/p/${id}`

      if (!router.asPath?.includes('/p/')) {
        setPreviousUrl(router.asPath) // Set the current value of the ref
      }

      // Store the current path
      if (router?.asPath === newPath) {
        return
      }

      if (asRestorer) return
      // Navigate to the new path

      router.push(`?/p/${id}`, newPath, {
        shallow: true,
      })
    },
    [router, previousUrl, asRestorer]
  )

  // Function to restore the previous URL
  const restoreUrl = useCallback(() => {
    if (previousUrl) {
      router.push(previousUrl, previousUrl, {
        shallow: true,
      })
    }
  }, [router, previousUrl])

  // Return the setUrl and restoreUrl functions from the hook
  return { setUrl, restoreUrl }
}

export default useSubmissionUrl
