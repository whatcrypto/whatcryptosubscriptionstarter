import React, { Fragment } from 'react'
import {
  ClockIcon,
  IdentificationIcon,
  MailIcon,
  OfficeBuildingIcon,
  PlusCircleIcon,
  StarIcon,
  UserIcon,
  XIcon,
} from '@heroicons/react/solid'
import RoleChanger from './RoleChanger'
import Image from 'next/legacy/image'
import { useCurrentOrganization } from '../data/organization'
import { KeyedMutator } from 'swr'
import { dateDifference } from './MainPostView'
import { ICustomer } from '../interfaces/IUser'
import Tooltip from './Tooltip'
import { toast } from 'sonner'
import DisplayMemberCheckmark from './AdminCheck'
import UserActivityFeed from './UserActivityFeed'
import { removeTrackedUser } from 'network/lib/organization'
import { Button } from './radix/Button'
import ConfirmationModal from './ConfirmationModal'
import Loader from './Loader'
import { isMember } from '@/lib/acl'

export const Description: React.FC<{ content: string }> = ({ content }) => {
  return (
    <Tooltip
      notCentered={true}
      dropDown={
        <>
          <p className="flex items-center text-xs">Click to copy</p>
        </>
      }
      child={
        <>
          <button
            onClick={() => {
              if (navigator.clipboard) {
                toast.success('Copied to clipboard')
                navigator.clipboard.writeText(content)
              }
            }}
            className="w-full text-sm font-medium text-gray-600 truncate cursor-pointer unstyled-button dark:text-gray-100"
          >
            {content}
          </button>
        </>
      }
    />
  )
}

export const CopyText: React.FC<{ children: any; value: string }> = ({ children, value }) => {
  return (
    <Tooltip
      notCentered={true}
      dropDown={
        <>
          <p className="flex items-center text-xs">Click to copy</p>
        </>
      }
      noAlignment={true}
      child={
        <>
          <button
            onClick={(e) => {
              if (navigator.clipboard) {
                e.stopPropagation()
                toast.success('Copied to clipboard')
                navigator.clipboard.writeText(value)
              }
            }}
            className="text-sm cursor-pointer unstyled-button"
          >
            {children}
          </button>
        </>
      }
    />
  )
}

const UsersInfo: React.FC<{
  activeUser: ICustomer
  mutateTrackedUsers?: KeyedMutator<any[]>
  activity?: boolean
  postView?: boolean
  setOpenSlideOver?: any
}> = ({ activeUser, mutateTrackedUsers, activity = false, postView = false, setOpenSlideOver }) => {
  const { org } = useCurrentOrganization()
  const { userId, customFields: identifiedUserCustomFields } = activeUser
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const getRoleNameFromId = (id: string) => {
    return org?.roles?.find((role) => role.id === id)?.role || 'Removed role'
  }

  const deleteUser = () => {
    if (!activeUser?.id) return toast.error('User not found')
    setLoading(true)
    removeTrackedUser(activeUser?.id || '')
      .then(() => {
        toast.success('User removed')
        mutateTrackedUsers && mutateTrackedUsers()
        setOpenSlideOver && setOpenSlideOver(false)
      })
      .catch((err) => {
        toast.error(
          'Failed to remove user, ' + err?.response?.data?.message ||
            'please contact support or try again.'
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      {!activity && (
        <div className="">
          <div className={!postView ? 'dark:bg-secondary/80' : ''}>
            {!postView && (
              <>
                <ConfirmationModal
                  open={confirmDelete}
                  setOpen={setConfirmDelete}
                  title={`Are you sure you want to remove ${activeUser?.name}?`}
                  callBack={deleteUser}
                  description="All actions this user made in your organization will be deleted."
                  buttonTxt="Remove user"
                />
                <div className="py-4 ">
                  <div className="flex items-center px-4 ">
                    <div className="relative">
                      <div className="absolute top-1 right-1">
                        <DisplayMemberCheckmark authorId={activeUser?.id} org={org} />
                      </div>
                      {activeUser?.profilePicture ? (
                        <Image
                          unoptimized
                          width={64}
                          height={64}
                          className="rounded-full h-14 w-14"
                          src={activeUser?.profilePicture}
                          alt=""
                        />
                      ) : (
                        <div className="flex items-center justify-center uppercase bg-white border border-gray-100 rounded-full shadow-lg h-14 w-14 dark:border-gray-400 dark:bg-gray-500">
                          {activeUser?.name ? (
                            <span className="text-xl font-medium text-gray-400 dark:text-gray-100">
                              {activeUser?.name[0]}
                              {activeUser?.name?.split(' ').length >= 2 &&
                                activeUser?.name?.split(' ')[1].length >= 1 &&
                                activeUser?.name?.split(' ')[1][0]}
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-gray-400 dark:text-gray-100">
                              <UserIcon className="w-6 h-6" />
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="w-full ml-4">
                      <div className="flex items-center justify-between w-full gap-3">
                        <h2 className="text-xl truncate max-w-[270px] font-semibold text-gray-700 dark:text-white">
                          {activeUser?.name ? activeUser?.name : 'Name not assigned yet'}
                        </h2>
                        <Button
                          tabIndex={-1}
                          variant={'outline'}
                          className="mt-1 dark:text-gray-200"
                          size={'sm'}
                          onClick={() => setConfirmDelete(true)}
                        >
                          {loading ? (
                            <div className="mr-1.5 secondary-svg !h-3 !w-3">
                              <Loader />
                            </div>
                          ) : (
                            <XIcon className="mr-1.5 secondary-svg !h-3 !w-3" />
                          )}
                          Remove user
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-0.5">
                        {activeUser?.companies?.map(({ id, name }: any) => {
                          return (
                            <p
                              key={id}
                              className="flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-foreground first-letter:capitalize"
                            >
                              <OfficeBuildingIcon className="mr-1 secondary-svg" />
                              {name}
                            </p>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="">
              <div className={`${!postView && 'border-t divide-y'}   text-sm divide-border`}>
                <div
                  className={`flex truncate ${
                    !postView ? 'p-4' : 'px-4 py-3'
                  } items-center justify-between`}
                >
                  <p className="flex items-center flex-shrink-0 font-medium w-28">
                    {!postView && <MailIcon className="secondary-svg mr-1.5" />}
                    Email
                  </p>

                  <Description content={activeUser?.email || ''} />
                </div>
                {userId ? (
                  <div
                    className={`flex ${
                      !postView ? 'p-4' : 'px-4 py-3'
                    } items-center justify-between`}
                  >
                    <p className="flex items-center flex-shrink-0 font-medium w-28">
                      {!postView && <IdentificationIcon className="secondary-svg mr-1.5" />}
                      UserID
                    </p>
                    <Description content={userId} />
                  </div>
                ) : null}
                {org?.enabledFeatures?.userRoles && !isMember(activeUser?.id, org) ? (
                  !postView ? (
                    <div
                      className={`flex items-center justify-between ${
                        !postView ? 'p-4 py-[11px]' : 'px-4 py-3'
                      }`}
                    >
                      <p className="flex items-center flex-shrink-0 font-medium w-28">
                        <StarIcon className="secondary-svg mr-1.5" /> User role
                      </p>
                      <RoleChanger
                        activeUser={activeUser}
                        getRoleNameFromId={getRoleNameFromId}
                        mutateTrackedUserActivity={() => {}}
                        mutateTrackedUsers={mutateTrackedUsers}
                      />
                    </div>
                  ) : (
                    activeUser?.roleId && (
                      <div
                        className={`flex items-center justify-between ${
                          !postView ? 'p-4 py-[11px]' : 'px-4 py-3'
                        }`}
                      >
                        <p className="flex items-center flex-shrink-0 font-medium w-28">Role</p>
                        <Description
                          content={
                            org?.roles?.find((role) => role?.id === activeUser?.roleId)?.role ||
                            'Unassigned'
                          }
                        />
                      </div>
                    )
                  )
                ) : null}
              </div>
            </div>
          </div>
          <div className=" xl:max-h-[20vh] custom-scrollbar-stronger overflow-auto">
            <div
              className={`${
                !postView && 'border-t divide-y'
              }   text-sm text-gray-500   dark:text-foreground border-gray-100/50 dark:border-border divide-gray-100/50 dark:divide-dark-accent`}
            >
              {activeUser?.lastActivity ? (
                <div
                  className={`flex items-center justify-between ${!postView ? 'p-4' : 'px-4 py-3'}`}
                >
                  <p className="flex items-center flex-shrink-0 font-medium w-28">
                    {!postView && <ClockIcon className="secondary-svg mr-1.5" />}
                    Last action{' '}
                  </p>
                  <Description
                    content={`${
                      dateDifference(activeUser?.lastActivity)[0]?.toUpperCase() +
                      dateDifference(activeUser?.lastActivity)?.slice(1)
                    }`}
                  />
                </div>
              ) : null}
              {activeUser?.createdAt && !activeUser?.createdAt?.includes('1970-') ? (
                <div
                  className={`flex items-center justify-between ${!postView ? 'p-4' : 'px-4 py-3'}`}
                >
                  <p className="flex items-center flex-shrink-0 font-medium w-28">
                    {!postView && <PlusCircleIcon className="secondary-svg mr-1.5" />}
                    Created at
                  </p>
                  <Description
                    content={`${
                      dateDifference(activeUser?.createdAt)[0]?.toUpperCase() +
                      dateDifference(activeUser?.createdAt)?.slice(1)
                    }`}
                  />
                </div>
              ) : null}

              {identifiedUserCustomFields &&
                Object.entries(identifiedUserCustomFields).map(([key, value]: any) => {
                  return (
                    <div
                      key={key}
                      className={`flex ${
                        !postView ? 'p-4' : 'px-4 py-3'
                      } items-center justify-between`}
                    >
                      <p className="flex-shrink-0 font-medium truncate w-28 first-letter:uppercase">
                        {key}
                      </p>
                      <Description content={value} />
                    </div>
                  )
                })}
            </div>
            {activeUser?.companies?.length > 0 && (
              <div>
                <div className="text-sm text-gray-500 border-t divide-y dark:text-foreground dark:shadow border-gray-100/50 dark:border-border divide-gray-100/50 dark:divide-dark-accent">
                  {activeUser?.companies?.map(({ id, monthlySpend, customFields, name }: any) => {
                    return (
                      <div key={id} className="p-4 space-y-4">
                        <div className="flex items-center justify-between ">
                          <p className="flex items-center space-x-2 text-sm font-semibold text-gray-500 dark:text-gray-100 first-letter:capitalize">
                            <OfficeBuildingIcon className="secondary-svg mr-1.5" />
                            {name}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="flex-shrink-0 font-medium w-28">CompanyID</p>
                          <Description content={id} />
                        </div>
                        {monthlySpend ? (
                          <div className="flex items-center justify-between">
                            <p className="flex-shrink-0 font-medium w-28">Company MRR</p>
                            <Description content={`$${monthlySpend} MRR`} />
                          </div>
                        ) : null}
                        {customFields
                          ? Object.entries(customFields).map(([key, value]) => {
                              return (
                                <div key={key} className="flex items-center justify-between">
                                  <p className="flex-shrink-0 font-medium truncate w-28 first-letter:uppercase">
                                    {key}
                                  </p>
                                  <Description content={`${value}`} />
                                </div>
                              )
                            })
                          : null}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {activity && activeUser.id && <UserActivityFeed activeUserId={activeUser.id} />}
    </>
  )
}

export default UsersInfo
