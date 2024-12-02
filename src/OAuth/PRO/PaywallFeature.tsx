import React, { useCallback, useState } from 'react'
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/solid'
import SimpleTooltip from './SimpleTooltip'
import 'react-medium-image-zoom/dist/styles.css'
import Zoom from 'react-medium-image-zoom'

interface FeatureProps {
  feature: {
    name: string
    img?: string
    tooltip?: string
    url?: string
  }
}

const Feature: React.FC<FeatureProps> = ({ feature }) => {
  return (
    <div className="col-span-4">
      <SimpleTooltip
        contentClass={`p-0 ${feature?.img ? 'max-w-[430px]' : 'max-w-[360px]'}`}
        contentProps={{ side: 'right', sideOffset: 5, delayDuration: 0 }}
        allowHoverableContent={true}
        content={
          <div className="-m-2 overflow-hidden max-w-[450px]">
            {feature?.img && (
              <Zoom zoomMargin={12} classDialog="custom-zoom">
                <img
                  src={feature.img}
                  alt={feature.name}
                  loading="lazy"
                  className="object-center object-cover w-full rounded-none bg-secondary h-full cursor-zoom-in"
                />
              </Zoom>
            )}
            <div className="p-5 text-left !tracking-normal">
              <p className="text-[15px] text-gray-500 font-semibold dark:text-gray-100">
                {feature.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-foreground mt-1.5">
                {feature?.tooltip}
              </p>
              {feature.url && feature.url !== 'https://help.featurebase.app/' && (
                <a
                  href={feature.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 flex items-center text-[13px] link-style"
                >
                  Read more about this feature{' '}
                  <ArrowRightIcon className="ml-1 h-3 w-3 opacity-70" />
                </a>
              )}
            </div>
          </div>
        }
      >
        <p className="inline-flex text-[15px] items-center col-span-4 text-gray-500 dark:text-gray-100">
          <CheckCircleIcon className="w-5 h-5 flex-shrink-0 mr-1.5 text-accent" />
          <span className="main-transition cursor-help underline decoration-gray-200 dark:decoration-gray-300/80 decoration-dotted decoration-2 underline-offset-[4px] hover:decoration-gray-200/80">
            {feature.name}
          </span>
        </p>
      </SimpleTooltip>
    </div>
  )
}

export default Feature
