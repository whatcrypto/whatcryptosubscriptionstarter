import { CheckCircleIcon } from '@heroicons/react/solid'
import Image from "next/legacy/image"
import Link from '@/components/CustomLink'
import React from 'react'
import { useCurrentOrganization } from '../data/organization'
import PopupWrapper from './PopupWrapper'
import CreateTrialButton from './CreateTrialButton'
import { getPlanName } from '@/lib/utils'
import PayWallContent from './PayWallContent'

const PayWallPopup: React.FC<{
  isOpen: boolean
  setOpen: Function
  title: string
  settings?: boolean
  gif?: string
  plan: string
}> = ({ isOpen, setOpen, title, settings = true, plan, gif }) => {
  return (
    <PopupWrapper shiny={true} isOpen={isOpen} setIsOpen={setOpen}>
      <div className="relative w-full px-4 md:px-0 ">
        <PayWallContent setOpen={setOpen} title={title} plan={plan} />
      </div>
    </PopupWrapper>
  )
}

export default PayWallPopup
