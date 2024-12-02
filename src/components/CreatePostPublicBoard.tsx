import { useCurrentOrganization } from '@/data/organization'
import React from 'react'
import { sanitizeHTML } from '../lib/contentSanitizer'
import { useTranslation } from 'next-i18next'
import chroma from 'chroma-js'
import PostCTA from './PostCTA'
import { PencilIcon } from '@heroicons/react/solid'
import { useUser } from '@/data/user'
import { can } from '@/lib/acl'

export function hexToRgb(hex: any) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export const reducedOpacityColor = (color: any) => {
  return chroma(color).alpha(0.25).css()
}

export function darkenColor(color: any, percentage: any) {
  let { r, g, b }: any = hexToRgb(color)
  r = Math.floor(r * (1 - percentage))
  g = Math.floor(g * (1 - percentage))
  b = Math.floor(b * (1 - percentage))
  return `rgb(${r}, ${g}, ${b})`
}

const CreatePostPublicBoard: React.FC<{ hidePostCreation: boolean }> = ({ hidePostCreation }) => {
  const { org } = useCurrentOrganization()
  const { t } = useTranslation()
  const sanitizedHTML = sanitizeHTML(org?.structure?.CTASection?.content, true)

  const { user } = useUser()

  return (
    <div>
      <div className=" relative group border border-accent/25 rounded-lg shadow ">
        <div className="relative p-4 overflow-hidden rounded-lg">
          <div
            className="absolute bg-accent/5 dark:bg-accent/[13%] inset-0"
            // style={{
            //   backgroundImage: `linear-gradient(to bottom right, ${org.color}, ${darkenColor(
            //     org.color,
            //     0.3
            //   )})`,
            // }}
          ></div>

          <div className="flex flex-col gap-3 overflow-auto custom-scrollbar-stronger max-h-[300px] sm:max-h-[450px]">
            <div className="relative text-accent-foreground">
              <h2 className="text-base font-semibold md:text-lg dark:text-white">
                {org?.structure?.CTASection?.title
                  ? org.structure.CTASection.title
                  : t('have-something-to-say')}
              </h2>
              {sanitizedHTML !== '<p></p>' ? (
                <div className="text-accent-foreground">
                  {sanitizedHTML ? (
                    <div
                      className={`text-sm content dark:text-white/80 mt-1.5`}
                      dangerouslySetInnerHTML={{
                        __html: sanitizedHTML,
                      }}
                    />
                  ) : (
                    <div className={`text-sm content dark:text-white/80 mt-1.5`}>
                      {t(
                        'tell-org-displayname-how-they-could-make-the-product-more-useful-to-you',
                        {
                          displayName: org.displayName,
                        }
                      )}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {can(user?.id, 'manage_branding', org) && (
            <div className="absolute hidden opacity-0 sm:block main-transition bottom-4 right-4 group-hover:opacity-100">
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/dashboard/settings/boards" target="_blank" rel="noreferrer">
                <span className="flex items-center text-xs bg-accent/10 hover:bg-accent/[15%] dark:bg-accent/20 dark:hover:bg-accent/30 main-transition backdrop-blur transform-gpu px-1.5 py-1 rounded-md font-medium cursor-pointer text-accent-foreground/80 dark:text-white/80">
                  <PencilIcon className="w-4 h-4 mr-1 text-accent/50 dark:text-white/50" />
                  Edit CTA
                </span>
              </a>
            </div>
          )}
          {hidePostCreation ? null : (
            <div className="relative z-20 mt-3 lg:hidden">
              <PostCTA />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreatePostPublicBoard
