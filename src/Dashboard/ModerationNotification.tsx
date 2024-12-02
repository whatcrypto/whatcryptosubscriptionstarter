import { usePendingModerationCount } from '@/data/organization'
import { ShieldCheckIcon } from '@heroicons/react/solid'
import Link from '@/components/CustomLink'
import React from 'react'

const ModerationNotification = () => {
  const { pendingCount, mutate: mutatePending } = usePendingModerationCount()

  return pendingCount && pendingCount?.total > 0 ? (
    <Link legacyBehavior href="/dashboard/moderate">
      <button
        className={`rounded-full flex items-center justify-center relative dashboard-secondary-rounded h-9 w-9 p-[7px]`}
      >
        {pendingCount?.total ? (
          <div className="absolute -top-1.5 px-1.5 leading-3 py-0.5 -right-1.5  text-[10px] font-semibold bg-accent text-white rounded-full">
            {pendingCount?.total}
          </div>
        ) : null}

        <span className="sr-only">Moderate posts</span>
        <ShieldCheckIcon className="w-5 h-5 secondary-svg" aria-hidden="true" />
      </button>
    </Link>
  ) : null
}

export default ModerationNotification
