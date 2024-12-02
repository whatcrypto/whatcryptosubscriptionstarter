import { TextIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'
import React from 'react'
import { cn } from '@/lib'
import Scrollspy from '@/lib/scrollspy'
import { IHelpCenterArticleDocument } from '@/interfaces/IHelpCenter'
import { stripHtml } from 'string-strip-html'
import {
  EmojiHappyIcon,
  EmojiSadIcon,
  LightBulbIcon,
  QuestionMarkCircleIcon,
  XIcon,
} from '@heroicons/react/solid'
import { respondToSurvey, useArticleSurvey } from 'network/lib/survey'
import { IAdvancedSurvey } from '@/interfaces/ISurvey'
import { useState } from 'react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import TextareaAutosize from 'react-textarea-autosize'
import { useTranslation } from 'next-i18next'

interface TableOfContentsItem {
  tagName: string
  text: string
  id: string
  level: number
}

const extractHeaders = (html: string): TableOfContentsItem[] => {
  const headerRegex = /<(h[12])\s+id="([^"]+)"[^>]*>(.*?)<\/\1>/gi
  const headers: TableOfContentsItem[] = []
  let match

  while ((match = headerRegex.exec(html)) !== null) {
    headers.push({
      tagName: match[1],
      id: match[2],
      text: stripHtml(match[3].replace(/<[^>]+>/g, ''))?.result, // Decode HTML entities after removing nested tags
      level: parseInt(match[1].charAt(1)),
    })
  }

  return headers
}

const DocsMinimap: React.FC<{ editor?: boolean; docsData?: IHelpCenterArticleDocument }> = ({
  editor,
  docsData,
}) => {
  const tableOfContents = docsData?.body ? extractHeaders(docsData.body) : []

  const { survey, mutate: mutateSurvey } = useArticleSurvey(
    docsData?.articleId ? docsData?.articleId : null
  )

  let hasPreviousH1 = false
  const { t } = useTranslation()

  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)
  const [showTextQuestion, setShowTextQuestion] = useState(false)
  const [activeSurveyId, setActiveSurveyId] = useState('')
  const [secondaryPageId, setSecondaryPageId] = useState('')

  const ratingPageId = survey?.pages?.find(
    (page: IAdvancedSurvey['pages'][0]) => page.type === 'rating'
  )?._id

  const textPageId = survey?.pages?.find(
    (page: IAdvancedSurvey['pages'][0]) => page.type === 'text'
  )?._id

  const handleEmojiVote = (emoji: number) => {
    setSelectedEmoji(emoji.toString())

    if (!ratingPageId) {
      return
    }

    setActiveSurveyId(survey?._id)
    setSecondaryPageId(textPageId)

    respondToSurvey({
      id: survey?._id,
      responses: [
        {
          pageId: ratingPageId,
          type: 'rating',
          value: emoji,
        },
      ],
    }).catch((err) => {
      toast.error('Failed to submit survey')
    })

    mutateSurvey({}, false)

    if (emoji < 3) {
      setShowTextQuestion(true)
    }
  }

  const handleTextSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const textResponse = formData.get('textResponse') as string

    handleSecondaryQuestion(textResponse)
  }

  const handleSecondaryQuestion = (question: string) => {
    respondToSurvey({
      id: activeSurveyId,
      responses: [
        {
          pageId: secondaryPageId,
          type: 'text',
          value: question,
        },
      ],
    }).catch((err) => {
      toast.error('Failed to submit survey')
    })
    setShowTextQuestion(false)
  }

  if (!editor && tableOfContents.length === 0 && !survey && !secondaryPageId) {
    return null
  }

  const emojiStyle = cn('h-[24px] w-[24px] !m-0 !p-0')

  return (
    <aside
      className={cn(
        'mt-[8px] flex-shrink-0 hidden sm:block custom-scrollbar-stronger relative w-52 h-max ml-0'
      )}
    >
      <div className="fixed w-52 flex flex-col gap-6">
        {tableOfContents.length > 0 && (
          <div>
            <p className="flex items-center text-sm font-medium">
              <TextIcon className="mr-2 secondary-svg" />
              On this page
            </p>
            <div className="mt-3 -ml-1 max-h-[calc(100dvh-120px)] custom-scrollbar overflow-auto">
              <div className="flex flex-col gap-1">
                <Scrollspy
                  className="!m-0 !p-0"
                  items={tableOfContents.map((item) => item.id)}
                  currentClassName={
                    editor
                      ? ''
                      : 'dark:text-accent dark:hover:text-accent text-primary-modified hover:text-primary-modified'
                  }
                >
                  {tableOfContents.map((item, index) => {
                    let marginLeft: any = 0

                    if (item.tagName.toLowerCase() === 'h1') {
                      hasPreviousH1 = true
                    }

                    if (item.tagName.toLowerCase() === 'h2' && hasPreviousH1) {
                      marginLeft = `${1 * item.level - 1}rem`
                    }

                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        style={{
                          marginLeft: marginLeft,
                        }}
                        className={cn(
                          'block font-medium max-w-52 line-clamp-2 p-1 text-foreground/80 hover:text-foreground main-transition rounded bg-opacity-10 text-sm transition-all'
                        )}
                      >
                        <span className="line-clamp-2">{item.text}</span>
                      </a>
                    )
                  })}
                </Scrollspy>
              </div>
            </div>
          </div>
        )}
        {!editor && docsData?.surveyId && (survey || secondaryPageId) && (
          <AnimatePresence initial={false}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="flex items-center text-sm font-medium dark:opacity-80 opacity-80">
                {t('was-this-helpful')}
              </p>
              <AnimatePresence mode="wait">
                {ratingPageId && !showTextQuestion && (
                  <motion.div
                    key="rating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="inline-flex items-center gap-2 mt-3"
                  >
                    {['1', '2', '3'].map((emoji, index) => (
                      <button
                        key={emoji}
                        className={cn(
                          'h-full flex-1 flex border dark:text-foreground/60 text-foreground/60 duration-200 px-[4px] py-[4px] rounded-full dark:bg-border/50 dark:border-border/60 dark:shadow bg-gray-50/60 border-gray-100/60 items-center justify-center',
                          index === 0 &&
                            'hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-900/30 dark:hover:text-rose-300 hover:border-rose-200 dark:hover:border-rose-800/50',
                          index === 1 &&
                            'hover:bg-yellow-100 hover:text-yellow-700 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 hover:border-yellow-200 dark:hover:border-yellow-800/50',
                          index === 2 &&
                            'hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-300 hover:border-emerald-200 dark:hover:border-emerald-800/50'
                        )}
                        onClick={() => handleEmojiVote(parseInt(emoji))}
                      >
                        <div className="w-[22px] h-[22px] flex items-center justify-center">
                          {emoji === '1' && (
                            <svg
                              className={emojiStyle}
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="hsl(var(--secondary))"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8 17C8.91212 15.7856 10.3643 15 12 15C13.6357 15 15.0879 15.7856 16 17"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M8.00897 9H8M16 9H15.991"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                          {emoji === '2' && (
                            <svg
                              className={emojiStyle}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24"
                              fill="hsl(var(--secondary))"
                            >
                              <path
                                d="M8.00897 9H8M16 9H15.991"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M9 16H15"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                          {emoji === '3' && (
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              className={emojiStyle}
                              fill="hsl(var(--secondary))"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8 15C8.91212 16.2144 10.3643 17 12 17C13.6357 17 15.0879 16.2144 16 15"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M8.00897 9H8M16 9H15.991"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
                {showTextQuestion && (
                  <motion.form
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleTextSubmit}
                    className="mt-3"
                  >
                    <TextareaAutosize
                      autoFocus
                      name="textResponse"
                      className="w-full p-2 border rounded-md text-[13px] placeholder:text-[13px]"
                      placeholder={t('how-can-we-improve')}
                      minRows={2}
                    />

                    <div className="flex justify-between gap-2.5 mt-3">
                      <button
                        type="button"
                        onClick={() => setShowTextQuestion(false)}
                        className=" px-2 py-1 dark:text-foreground/70 dashboard-secondary"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                      <button type="submit" className="text-[13px] px-2 py-1 dashboard-primary ">
                        {t('submit')}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
              {!showTextQuestion && !ratingPageId && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="mt-3 text-sm text-foreground/80 dark:text-foreground/70"
                >
                  {t('thank-you-for-your-feedback')}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </aside>
  )
}

export default DocsMinimap
