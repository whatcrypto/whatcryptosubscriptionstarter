import {
  aiSearchForQueryAtom,
  aiSearchOutputContentAtom,
  helpCenterUrlPartsAtom,
} from '@/atoms/orgAtom'
import { useAtom } from 'jotai'
import { Loader } from 'lucide-react'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import Markdown from 'react-markdown'
import { CheckCircleIcon, XIcon } from '@heroicons/react/solid'
import { useTranslation } from 'next-i18next'

const HelpDocsAISearch: React.FC<{ query: string; onBack: () => void }> = ({ query, onBack }) => {
  const [content, setContent] = useAtom(aiSearchOutputContentAtom)
  const [isStreaming, setIsStreaming] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  const [helpCenterUrlParts] = useAtom(helpCenterUrlPartsAtom)
  const [aiSearchForQuery, setAiSearchForQuery] = useAtom(aiSearchForQueryAtom)

  const { i18n } = useTranslation()

  const endpoint = useMemo(() => {
    const locale = i18n.language === 'default' ? 'en' : i18n.language

    return `/api/v1/helpcenter/articles/searchWithAI?q=${encodeURIComponent(
      query
    )}&helpCenterId=${helpCenterUrlParts?.helpCenterId}${
      locale !== 'en' ? `&locale=${locale}` : ''
    }`
  }, [query, helpCenterUrlParts?.helpCenterId, i18n.language])

  useEffect(() => {
    if (aiSearchForQuery === query) {
      return
    }

    let currentEventSource: EventSource | null = null

    const initEventSource = () => {
      setContent('')
      setIsStreaming(true)

      const eventSource = new EventSource(endpoint)
      currentEventSource = eventSource
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        setAiSearchForQuery(query)
      }

      eventSource.onmessage = (event) => {
        if (event.data === '[DONE]') {
          eventSource.close()
          setIsStreaming(false)
          return
        }
        try {
          const parsedData = JSON.parse(event.data)
          setContent((prev) => prev + parsedData.content)
        } catch (error) {
          console.error('Error parsing SSE data:', error)
        }
      }

      eventSource.onerror = (error) => {
        eventSource.close()
        setIsStreaming(false)
      }
    }

    initEventSource()

    return () => {
      if (currentEventSource) {
        currentEventSource.close()
      }
    }
  }, [query, endpoint])

  const renderedContent = useMemo(() => {
    if (!content) {
      return (
        <div>
          <div className="h-5 w-2 animate-pulse bg-dark-accent mr-auto" />
        </div>
      )
    }
    return <Markdown>{content}</Markdown>
  }, [content])

  return (
    <div className="changelog p-4 overflow-y-auto 2xl:max-h-[800px] max-h-[700px] custom-scrollbar">
      <div className="flex items-center mb-3 pr-6 relative">
        <button
          onClick={onBack}
          className="absolute right-0 top-0 px-1.5 dashboard-secondary dark:border-0 shadow-none dark:hover:border-0 border-0 hover:border-0 rounded-lg"
        >
          <XIcon className="w-4 h-4 secondary-svg" />
        </button>
        <div className="mr-2 text-accent bg-accent/10 rounded-full p-[3px]">
          {isStreaming ? (
            <Loader className="animate-spin-slow w-5 h-5" />
          ) : (
            <CheckCircleIcon className="w-[18px] h-[18px]" />
          )}
        </div>
        <p className="text-lg pr-6 font-medium text-gray-500 dark:text-white first-letter:uppercase">
          {query}
        </p>
      </div>
      <div className="installation-content">{renderedContent}</div>
    </div>
  )
}

export default HelpDocsAISearch
