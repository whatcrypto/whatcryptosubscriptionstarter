import { PlusCircleIcon } from '@heroicons/react/solid'
import { useAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { authenitcateModalAtom } from '../atoms/authAtom'
import { createPostAtom } from '../atoms/displayAtom'
import { useCurrentOrganization } from '../data/organization'
import { useUser } from '../data/user'
import { sanitizeHTML } from '../lib/contentSanitizer'
import { Button } from './radix/Button'
import { isMember } from '@/lib/acl'

const PostCTA = () => {
  const [createPost, setCreatePost] = useAtom(createPostAtom)
  const [authenitcateModal, setAuthenitacteModal] = useAtom(authenitcateModalAtom)
  const { org } = useCurrentOrganization()
  const { user } = useUser()
  const { t } = useTranslation()
  const sanitizedHTML = sanitizeHTML(org?.structure?.CTASection?.content, true)

  const handlePost = () => {
    if (!user) {
      if (org.settings.anyoneCanSubmit) {
        setCreatePost(true)
        return
      }
      setAuthenitacteModal(true)
    } else {
      // Get element with create-post-title id and focus on it
      setCreatePost(true)
    }
  }

  if (!isMember(user?.id, org) && org?.postCategories?.every((cat) => cat?.disablePostCreation)) {
    return null
  }

  return (
    <Button
      onClick={handlePost}
      className={` px-3 sm:px-3 shadow-sm dark:shadow-lg text-left relative`}
    >
      <PlusCircleIcon className="flex-shrink-0 w-3.5 h-3.5 mr-1.5" />

      {org?.structure?.CTASection?.buttonText
        ? org?.structure.CTASection.buttonText
        : t('create-a-new-post')}
    </Button>
  )
}

export default PostCTA

// Old CTA section
// return (
//   <div className="relative w-full p-5 up-element ">
//     <svg
//       className="absolute bottom-0 right-0 w-10 h-10 m-5 text-gray-200 md:h-6 md:w-6 lg:h-10 lg:w-10 dark:text-border"
//       viewBox="0 0 48 48"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M13.1 2.4C11.4 4.5 2.8 33 3.4 34.6C4.2 36.6 7.1 36.3 9.6 33.9C11.7 31.9 12.3 31.9 20.7 32.9C34.3 34.6 34.8 34.5 36.4 30.7C38.6 25.3 39.3 22.7 38.3 23.3C37.8 23.6 36.7 25.8 36 28.1L34.6 32.3L22.7 31.6C12.6 31 10.5 31.1 8.3 32.5C7 33.4 5.6 33.9 5.3 33.6C5 33.3 5.7 30.5 6.8 27.3C8 24.1 10 17.6 11.5 12.8C14.3 3.2 15.7 1.3 16.6 5.9C17.3 9.4 22.9 14.9 29 18C33.1 20.1 33.7 20.9 32.1 22.5C31.7 23.1 31 24.8 30.6 26.5C30 29.4 30 29.4 31.5 27.5C32.4 26.4 33.3 24.5 33.6 23.3C34 21.8 34.7 21.3 35.8 21.7C38.5 22.7 37 21.5 28.9 16.2C20.5 10.7 20 10.1 18.5 5C17.4 1.2 15 0.0999947 13.1 2.4Z"
//         fill="currentColor"
//       />
//       <path
//         d="M1.4 14.6C-0.7 17.7 0.5 22.3 3.4 22.8C5.2 23.2 5.3 23.1 3.7 21.5C0.7 18.6 2.2 14.5 7 12.7C7.9 12.4 7.3 12.1 5.8 12.1C3.9 12 2.5 12.8 1.4 14.6Z"
//         fill={org.color}
//       />
//       <path
//         d="M42.8 24.2C45.6 25.6 46.6 29.3 45.1 32.6C44.2 34.6 43.3 35 40 35C37.5 35 36.1 35.4 36.5 36C36.8 36.5 38.9 37 41 37C45.5 37 48 34.4 48 29.8C48 26.6 44.9 23 42.3 23.1C40.9 23.1 41 23.4 42.8 24.2Z"
//         fill="currentColor"
//       />
//       <path
//         d="M17 35.5C17 36.4 18.1 37.5 19.5 38C21.7 38.8 21.8 39.2 20.8 42C19.6 45.6 19.7 45.8 23.6 46.5C26.2 46.9 26.8 46.5 29.8 41.8C34.2 34.9 33.4 33.4 28.7 39.8C26.1 43.4 24.6 44.8 23.5 44.3C22.5 44 22.1 43.1 22.5 42.1C22.9 41.2 23.3 38.9 23.6 37C23.8 35.1 23.7 34.3 23.4 35.2C22.7 37.4 19 37.6 19 35.5C19 34.7 18.6 34 18 34C17.5 34 17 34.7 17 35.5Z"
//         fill="currentColor"
//       />
//     </svg>

//     <h2 className="text-base font-semibold text-gray-600 dark:text-gray-50">
//       {org?.structure?.CTASection?.title
//         ? org.structure.CTASection.title
//         : t('have-something-to-say')}
//     </h2>
//     {sanitizedHTML ? (
//       <div
//         className={`text-gray-400 text-sm content dark:text-foreground mt-2`}
//         dangerouslySetInnerHTML={{
//           __html: sanitizedHTML,
//         }}
//       />
//     ) : (
//       <div className={`text-gray-400 text-sm content dark:text-foreground mt-2`}>
//         {t('tell-org-displayname-how-they-could-make-the-product-more-useful-to-you', {
//           displayName: org.displayName,
//         })}
//       </div>
//     )}

//     {/* <p className="relative mt-2 text-sm text-gray-400 dark:text-foreground">
//       {org?.structure?.CTASection?.content
//         ? org?.structure.CTASection.content
//         : `Tell ${org.displayName} how they could make the product more useful to you.`}
//     </p> */}

//     {/* <SpeakerphoneIcon className="absolute top-0 right-0 w-12 h-12 text-gray-700" /> */}
//   </div>
// )
