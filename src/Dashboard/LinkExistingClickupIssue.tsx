import React, { useEffect, useState } from 'react'
import { linkClickupIssue, searchClickupTasks } from '../../network/lib/organization'
import { ISubmission } from '../interfaces/ISubmission'
import Loader from './Loader'
import { toast } from 'sonner'

interface IClickupSearchResult {
  id: string
  name: string
  description: string
  url: string
  status: {
    status: string
    color: string
    type: string
    orderindex: number
  }
  assignees: {
    id: number
    username: string
    color: string
    initials: string
    email: string
    profilePicture: string
  }
  list: {
    id: string
    name: string
  }
}
const LinkExistingClickupIssue: React.FC<{
  submission: ISubmission
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  callback?: () => void
}> = ({ submission, setOpen, callback }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [noResults, setNoResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [linkLoading, setLinkLoading] = useState(false)
  const [activeResult, setActiveResult] = useState('')
  useEffect(() => {
    setLoading(true)
    const delayDebounceFn = setTimeout(() => {
      searchClickupTasks(searchTerm)
        .then((res) => {
          setSearchResults(res.data)
          setNoResults(res.data.length === 0)
          setLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
      // Send Axios request here
    }, 200)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  const linkIssue = (issueId: string) => {
    setActiveResult(issueId)
    setLinkLoading(true)
    linkClickupIssue(submission.id, issueId)
      .then((res) => {
        if (res.data.success) {
          setOpen(false)
          callback && callback()
          setLinkLoading(false)
          toast.success('Issue linked to ClickUp')
        }
      })
      .catch((err) => {
        toast.error('Error linking issue. ' + err.message)
        setOpen(false)
        setLinkLoading(false)
      })
  }

  return (
    <div className="mt-3">
      <input
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm((prev) => event.target.value)
          setNoResults(false)
        }}
        autoFocus={true}
        placeholder="Task title to search by..."
        className="mb-2"
      />
      {loading && (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 my-3 secondary-svg">
            <Loader />
          </div>
        </div>
      )}
      {noResults && <p className="text-sm text-gray-400 dark:text-foreground">No results found</p>}
      <div className="divide-y divide-gray-100 dark:divide-dark-accent max-h-[400px] overflow-y-auto">
        {searchResults.map((result: IClickupSearchResult, idx: number) => {
          return (
            <div key={result.id + idx.toString()} className="py-3 text-white dark:shadow-sm">
              <div className="flex">
                <p className="p-1 px-1.5 mr-2 text-xs up-element text-gray-400 bg-gray-50 dark:text-foreground tracking-wide font-medium rounded-md dark:shadow-none dark:border-dark-accent dark:bg-border">
                  {result.list.name}
                </p>
                <p className="p-1 px-1.5 text-xs up-element text-gray-400 bg-gray-50 dark:text-foreground tracking-wide font-medium rounded-md dark:shadow-none dark:border-dark-accent dark:bg-border">
                  {result.status.status}
                </p>
              </div>
              <p className="pt-2 pb-1 text-gray-900 dark:text-white">
                {result.name?.substring(0, 50)}
              </p>
              <p className="pb-1.5 text-background-accent text-sm truncate dark:text-foreground">
                {result.description}
              </p>
              <div className="flex justify-end">
                <button
                  className="text-xs items-centeras dashboard-primary"
                  onClick={() => {
                    linkIssue(result.id)
                  }}
                >
                  {linkLoading && activeResult === result.id && (
                    <div className="secondary-svg mr-1.5 h-3.5 w-3.5">
                      <Loader />
                    </div>
                  )}
                  Link to task
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LinkExistingClickupIssue
