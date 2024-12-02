import React from 'react'

const PRO: React.FC<{ plan?: 'growth' | 'premium' | 'pro' }> = ({ plan }) => {
  return (
    <span className="bg-primary py-[2px] mx-1.5 rounded capitalize hover:opacity-100 px-1.5 text-xs tracking-wide font-semibold cursor-pointer text-primary-foreground">
      {plan ? plan : 'Starter'}
    </span>
  )
}

export default PRO
