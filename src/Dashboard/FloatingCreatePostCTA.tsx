import { authenitcateModalAtom } from '@/atoms/authAtom'
import { createPostAtom } from '@/atoms/displayAtom'
import { useCurrentOrganization } from '@/data/organization'
import { useUser } from '@/data/user'
import chroma from 'chroma-js'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { darkenColor } from './CreatePostPublicBoard'
import { PlusCircleIcon } from '@heroicons/react/solid'
import { useTranslation } from 'next-i18next'
import { AnimatePresence, motion } from 'framer-motion'

const FloatingCreatePostCTA: React.FC<{ inView: boolean }> = ({ inView }) => {
  const [createPost, setCreatePost] = useAtom(createPostAtom)
  const [authenitcateModal, setAuthenitacteModal] = useAtom(authenitcateModalAtom)
  const { org } = useCurrentOrganization()
  const { user } = useUser()
  const [delayed, setDelayed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      // Your code to trigger observing here
      setDelayed(true)
    }, 500) // Adjust time as needed
    return () => clearTimeout(timer)
  }, [])

  const handlePost = () => {
    if (!user) {
      if (org.settings.anyoneCanSubmit) {
        setCreatePost(true)
        return
      }
      setAuthenitacteModal(true)
    } else {
      setCreatePost(true)
    }
  }

  const { t } = useTranslation()

  return (
    <>
      {/* Attach the ref to the top element of your page */}
      <AnimatePresence>
        {!inView && delayed && (
          <motion.div
            exit={{
              opacity: 0,
              y: 100,
            }}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-x-0 flex items-center justify-center w-full bottom-5 sm:hidden"
          >
            <button
              onClick={handlePost}
              style={{
                background: chroma(org.color).alpha(0.1).css(),
              }}
              className={`border-none z-50 transform-gpu overflow-hidden relative font-medium dark:border-white/5 px-3  dark:text-white text-white sm:px-3 py-2  dark:hover:bg-gray-500/60 dark:backdrop-contrast-[60%] border backdrop-brightness-125 backdrop-blur-lg mx-4  w-full text-center flex items-center justify-center text-sm `}
            >
              <div
                className="absolute inset-0 hover:opacity-20 main-transition dark:opacity-20  dark:hover:opacity-50 opacity-[7.5%]"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${org.color}, ${darkenColor(
                    org.color,
                    0.3
                  )})`,
                }}
              ></div>

              <span className="relative items-center justify-center hidden pointer-events-none dark:text-white dark:flex">
                <PlusCircleIcon className="flex-shrink-0 w-3.5 h-3.5 mr-1.5 opacity-70 md:hidden lg:block" />
                {org?.structure?.CTASection?.buttonText
                  ? org?.structure.CTASection.buttonText
                  : t('create-a-new-post')}
              </span>
              <span
                style={{
                  color: darkenColor(org.color, 0.4),
                }}
                className="relative flex items-center justify-center pointer-events-none dark:hidden"
              >
                <PlusCircleIcon className="flex-shrink-0 w-3.5 h-3.5 mr-1.5 opacity-70 md:hidden lg:block" />
                {org?.structure?.CTASection?.buttonText
                  ? org?.structure.CTASection.buttonText
                  : t('create-a-new-post')}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default FloatingCreatePostCTA
