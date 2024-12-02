import React, { useState } from 'react'
import { createTrial } from '../../network/lib/organization'
import { toast } from 'sonner'
import { useCurrentOrganization } from '../data/organization'
import Loader from './Loader'
import { getPlanName } from '@/lib/utils'

const CreateTrialButton: React.FC<{
  plan: 'growth' | 'premium' | 'pro'
  successCallback?: () => void
}> = ({ plan, successCallback }) => {
  const { org, mutateCurrentOrg } = useCurrentOrganization()
  const [loading, setLoading] = useState(false)

  const startTrial = () => {
    setLoading(true)
    createTrial({ plan: plan === 'pro' ? 'starter' : plan })
      .then(() => {
        mutateCurrentOrg()
        setLoading(false)
        toast.success('Trial successfully activated')
        successCallback && successCallback()
      })
      .catch(() => {
        setLoading(false)
        toast.error('Error activating trial')
      })
  }

  return (
    <button onClick={() => startTrial()} className="ml-auto dashboard-primary">
      {loading && (
        <div className="w-4 h-4 mr-1">
          <Loader />
        </div>
      )}
      Try <span className="mx-1 first-letter:capitalize">{getPlanName(plan)} </span> for 10 days. No
      CC required
    </button>
  )
}

export default CreateTrialButton
