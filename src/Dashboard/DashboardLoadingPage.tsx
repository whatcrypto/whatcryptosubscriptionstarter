import React from 'react'
import Loader from './Loader'

const DashboardLoadingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-8 h-8 text-background-accent dark:text-background-accent">
        <Loader />
      </div>
    </div>
  )
}

export default DashboardLoadingPage
