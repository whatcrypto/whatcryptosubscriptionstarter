import React from 'react'
import { useCurrentOrganization } from '../data/organization'

const UpperLoader = () => {
  const { org } = useCurrentOrganization()

  return (
    <div>
      <style>{`
        #nprogress .peg {
          box-shadow: 0 0 20px ${org?.color}, 0 0 15px ${org?.color} !important;
        }

        #nprogress .bar {
          background: ${org?.color} !important;
        }
      `}</style>
    </div>
  )
}

export default UpperLoader
