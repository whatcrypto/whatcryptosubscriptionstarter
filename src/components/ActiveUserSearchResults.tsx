import { ICustomer } from '@/interfaces/IUser'
import { useCommandState } from 'cmdk'
import { searchUsers } from 'network/lib/user'
import React, { useCallback, useEffect, useState } from 'react'
import { CommandItem } from './radix/Command'
import UserPicture from './UserPicture'
import { Tooltip, TooltipContent, TooltipTrigger } from './radix/Tooltip'
import TrackedUserPreview from './TrackedUserPreview'
import Loader from './Loader'
import debounce from 'lodash/debounce'
import { CollectionIcon, PlusCircleIcon } from '@heroicons/react/solid'
import { useAtom } from 'jotai'
import { fetchedOrgUserAtom, fetchedOrgUserResults } from '@/atoms/submissionAtom'
import { can } from '@/lib/acl'
import { useUser } from '@/data/user'
import { useCurrentOrganization } from '@/data/organization'

const ActiveUserSearchResults: React.FC<{
  setNewAuthor: (user?: ICustomer) => any
  filterView?: boolean
}> = ({ setNewAuthor, filterView }) => {
  const [loading, setLoading] = useState(false)
  const [fetchedFor, setFetchedFor] = useAtom(fetchedOrgUserAtom)
  const [results, setResults] = useAtom(fetchedOrgUserResults)
  const { user } = useUser()
  const { org } = useCurrentOrganization()

  const search = useCommandState((state) => state.search)

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      setLoading(true)
      try {
        const res = await searchUsers({ query })
        setResults(res.data?.results)
      } catch (err: any) {
        console.error('error searching users', err.response)
        // Handle error here, for example logging or setting an error state
        if (err?.response?.status === 403) {
          setFetchedFor('')
        }
      } finally {
        setLoading(false)
      }
    }, 300),
    []
  )

  useEffect(() => {
    if (search && search !== fetchedFor) {
      setFetchedFor(search)
      debouncedSearch(search)
    } else if (!search && fetchedFor !== '') {
      setResults([])
      setFetchedFor('')
    }
  }, [search, fetchedFor, debouncedSearch])

  if (!can(user?.id, 'view_users', org)) {
    return (
      <>
        <CommandItem value={search}>You do not have permission to search users</CommandItem>
      </>
    )
  }

  return (
    <>
      {loading ? (
        <CommandItem value={search}>
          <div className="mr-2.5 secondary-svg">
            <Loader />
          </div>{' '}
          Searching...
        </CommandItem>
      ) : (
        <>
          {results?.length === 0 && filterView && (
            <CommandItem className="pointer-events-none" value={search}>
              No users found {search ? `for "${search}"` : ''}
            </CommandItem>
          )}
          {results?.map((user) => {
            return (
              <Tooltip delayDuration={500} key={user.id}>
                <TooltipTrigger asChild>
                  <div>
                    <CommandItem
                      onSelect={() => {
                        setNewAuthor(user)
                      }}
                      value={user.name + '-' + user?.email}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center flex-shrink w-full min-w-0 pr-3">
                          <div className="mr-1.5">
                            <UserPicture
                              authorId={user.id}
                              img={user?.profilePicture}
                              small={true}
                            />
                          </div>
                          <span className="truncate">
                            {user.name ? user.name : 'An Anonymous User'}
                          </span>
                        </div>
                        {user?.postsCreated && user?.postsCreated !== 0 ? (
                          <span className="flex items-center flex-1 flex-shrink-0 h-5 p-1 ml-auto rounded">
                            <CollectionIcon className="mr-1 secondary-svg" />
                            {user?.postsCreated}
                          </span>
                        ) : null}
                      </div>
                    </CommandItem>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  className="pt-0 px-0 pb-3 text-sm min-w-[200px] max-w-[350px]"
                  side="right"
                >
                  <TrackedUserPreview userId={user?.id} />
                </TooltipContent>
              </Tooltip>
            )
          })}

          {!filterView && (
            <CommandItem
              tabIndex={-1}
              onSelect={() => setNewAuthor()}
              value={search}
              key={'create-new-user'}
            >
              <PlusCircleIcon className="secondary-svg mr-1.5" />
              Add a brand new user
            </CommandItem>
          )}
        </>
      )}
    </>
  )
}

export default ActiveUserSearchResults
