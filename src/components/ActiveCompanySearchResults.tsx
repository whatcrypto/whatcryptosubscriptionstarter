import { ICustomerCompany } from '@/interfaces/IUser'
import { useCommandState } from 'cmdk'
import React, { useCallback, useEffect, useState } from 'react'
import { CommandItem } from './radix/Command'
import { Tooltip, TooltipContent, TooltipTrigger } from './radix/Tooltip'
import Loader from './Loader'
import debounce from 'lodash/debounce'
import { UserGroupIcon } from '@heroicons/react/solid'
import { useAtom } from 'jotai'
import { fetchedOrgUserAtom } from '@/atoms/submissionAtom'
import { can } from '@/lib/acl'
import { useUser } from '@/data/user'
import { useCurrentOrganization } from '@/data/organization'
import { searchCompanies } from 'network/lib/organization'
import TrackedCompanyPreview from './TrackedCompanyPreview'

const ActiveCompanySearchResults: React.FC<{
  onSelectCompany: (company?: ICustomerCompany) => any
}> = ({ onSelectCompany }) => {
  const [loading, setLoading] = useState(false)
  const [fetchedFor, setFetchedFor] = useAtom(fetchedOrgUserAtom)
  const [results, setResults] = useState<ICustomerCompany[]>([])
  const { user } = useUser()
  const { org } = useCurrentOrganization()

  const search = useCommandState((state) => state.search)

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      setLoading(true)
      try {
        const res = await searchCompanies(query)
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
          {results?.length === 0 && (
            <CommandItem className="pointer-events-none" value={search}>
              No companies found {search ? `for "${search}"` : ''}
            </CommandItem>
          )}
          {results?.map((company) => {
            return (
              <Tooltip delayDuration={500} key={company.id}>
                <TooltipTrigger asChild>
                  <div>
                    <CommandItem
                      onSelect={() => {
                        onSelectCompany(company)
                      }}
                      className="pr-0.5 aria-selected:pr-0.5"
                      value={company.name + '-' + company?.id}
                    >
                      <div className="mr-1.5 flex w-full items-center justify-between">
                        <span className="truncate">
                          {company.name ? company.name : 'An Unnamed Company'}
                        </span>
                        {company?.count && company?.count !== 0 ? (
                          <span className="flex items-center flex-shrink-0 h-5 p-1 pl-3 ml-auto truncate rounded">
                            <UserGroupIcon className="mr-1 secondary-svg" />
                            {company?.count}
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
                  <TrackedCompanyPreview company={company} />
                </TooltipContent>
              </Tooltip>
            )
          })}
          {/* <CommandItem onSelect={() => onSele()} value={search} key={'create-new-user'}>
            <PlusCircleIcon className="secondary-svg mr-1.5" />
            Add a brand new user
          </CommandItem> */}
        </>
      )}
    </>
  )
}

export default ActiveCompanySearchResults
