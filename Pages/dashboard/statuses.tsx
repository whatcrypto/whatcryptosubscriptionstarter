import React, { useState } from 'react'
import DashboardWrapper from '../../../components/DashboardWrapper'
import SettingsWrapper from '../../../components/SettingsWrapper'
import { useCurrentOrganization } from '../../../data/organization'
import {
  addStatus,
  deleteStatus,
  rawStatuses,
  updateStatus,
} from '../../../../network/lib/organization'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CogIcon,
  PlusCircleIcon,
  PlusIcon,
  XIcon,
} from '@heroicons/react/solid'
import ConfirmationModal from '../../../components/ConfirmationModal'
import AddStatus from '../../../components/AddStatus'
import PayWall from '../../../components/PayWall'
import { toast } from 'sonner'
import { IOrganizationStatus } from '../../../interfaces/IOrganization'
import EditStatusModal from '../../../components/EditStatusModal'
import TagBullet from '../../../components/TagBullet'
import { orgSettingsChanger } from '@/lib/organizatioMutator'
import { AxiosError } from 'axios'

export const sortOrder = {
  reviewing: 0,
  unstarted: 1,
  active: 2,
  completed: 3,
  canceled: 4,
}

const Statuses = () => {
  const [activeStatus, setActiveStatus] = useState<string | undefined>()
  const [editModal, setEditModal] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [addCategory, setAddCategory] = useState(false)
  const [activeStatusType, setActiveStatusType] = useState<IOrganizationStatus['type']>('active')
  const { org, mutateCurrentOrg } = useCurrentOrganization()

  const deleteStatusCallback = () => {
    if (activeStatus && org.postStatuses.find((status) => status.id === activeStatus)) {
      if (org.postStatuses.find((status) => status.id === activeStatus)?.isDefault) {
        toast.error('Cannot delete default status!')
        return
      }
      deleteStatus(org.postStatuses.find((status) => status.id === activeStatus))
        .then(() => {
          toast.success('Status deleted')
          mutateCurrentOrg()
        })
        .catch((err: AxiosError) => toast.error(err.response?.data?.message))
    }
  }

  const createStatusCallback = (status: IOrganizationStatus) => {
    // Add new category
    if (!org.postStatuses.some((stat) => stat.id === status.id) && org.postStatuses) {
      addStatus(status)
        .then(() => {
          toast.success('Status created')
          mutateCurrentOrg()
        })
        .catch((err: AxiosError) => toast.error(err.response?.data?.message))
    }
  }

  const editStatusCallback = (newStatus: IOrganizationStatus) => {
    // Edit tag here
    if (activeStatus)
      updateStatus(org?.postStatuses?.find((status) => status.id === activeStatus), newStatus)
        .then(() => {
          toast.success('Status updated')
          mutateCurrentOrg()
        })
        .catch((err: AxiosError) => toast.error(err.response?.data?.message))
  }

  const moveStatus = (statusId: string, direction: 'up' | 'down') => {
    if (!org.postStatuses) return

    const copyOfStatuses = [...org.postStatuses]

    // Filter and sort the statuses based on sortOrder
    const filteredAndSortedStatuses = copyOfStatuses
      .filter((status) => Object.keys(sortOrder).includes(status.type))
      .sort((a, b) => sortOrder[a.type] - sortOrder[b.type])

    // Find the index of the status with the given statusId
    const index = filteredAndSortedStatuses.findIndex((status) => status.id === statusId)

    // Check if the index is valid
    if (index === -1) return

    // Perform the move operation
    const newIndex = direction === 'up' ? index - 1 : index + 1
    const temp = filteredAndSortedStatuses[index]
    filteredAndSortedStatuses[index] = filteredAndSortedStatuses[newIndex]
    filteredAndSortedStatuses[newIndex] = temp

    // Merge the sorted and moved statuses back into the original array
    const otherStatuses = org.postStatuses.filter(
      (status) => !Object.keys(sortOrder).includes(status.type)
    )
    const newStatuses = [...otherStatuses, ...filteredAndSortedStatuses]

    mutateCurrentOrg({ ...org, postStatuses: newStatuses }, false)
    rawStatuses(newStatuses).catch((err: AxiosError) => toast.error(err.response?.data?.message))
  }

  const setDefault = (oldStatus: IOrganizationStatus) => {
    if (!org.postStatuses) return

    const newStatuses = org.postStatuses.map((status) => {
      if (status.id === oldStatus.id) {
        return { ...status, isDefault: true }
      } else {
        return { ...status, isDefault: false }
      }
    })

    rawStatuses(newStatuses)
      .then(() => {
        toast.success(oldStatus.name + ' set as default status')
        mutateCurrentOrg()
      })
      .catch((err: AxiosError) => toast.error(err.response?.data?.message))
    mutateCurrentOrg({ ...org, postStatuses: newStatuses }, false)
  }

  if (!org) return null

  return (
    <DashboardWrapper
      title="Settings"
      upperBar={
        <>
          <button
            onClick={() => setAddCategory(true)}
            className="flex-shrink-0 py-2 dashboard-primary"
          >
            <PlusCircleIcon className="w-4 h-4 mr-1.5 " />
            Add status
          </button>
        </>
      }
    >
      <AddStatus
        type={activeStatusType}
        callBack={createStatusCallback}
        open={addCategory}
        setOpen={setAddCategory}
      />

      <SettingsWrapper>
        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
          <div className="relative sm:rounded-md">
            {activeStatus && (
              <EditStatusModal
                callBack={editStatusCallback}
                open={editModal}
                setOpen={setEditModal}
                initialStatus={
                  org?.postStatuses?.find((status) => status.id === activeStatus) || {
                    id: '',
                    name: '',
                    type: 'active',
                    isDefault: false,
                    color: 'Red',
                  }
                }
              />
            )}
            <ConfirmationModal
              buttonTxt="Delete status"
              open={confirmDelete}
              setOpen={setConfirmDelete}
              title="Delete status"
              description="All posts with this status wil be set to In Review. Are you sure you want to delete this status? "
              callBack={deleteStatusCallback}
            />
            <div className="px-4 py-6 rounded-md up-element sm:p-6">
              <div className="flex flex-wrap justify-between gap-3">
                <div className="">
                  <h2
                    id="payment-details-heading"
                    className="text-lg font-medium leading-6 text-gray-600 dark:text-white"
                  >
                    Statuses
                  </h2>
                  <p className="max-w-lg mt-1 text-sm text-gray-400 dark:text-foreground">
                    Customize existing ones or add extra statuses you can add for posts.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {Object.keys(sortOrder).map((type: any) => {
                  // Get the name of the current type, you might need to adjust this based on your data structure
                  const typeName = type

                  // Filter the postStatuses for the current type
                  const filteredStatuses = org?.postStatuses?.filter(
                    (postStatus) => postStatus.type === type
                  )

                  return (
                    <div key={type}>
                      <div className="flex items-center mb-2.5 justify-between">
                        <h3 className="text-sm text-gray-500 dark:text-foreground first-letter:uppercase font-medium">
                          {typeName === 'unstarted' ? 'Planned' : typeName}
                        </h3>
                        <button
                          onClick={() => {
                            setActiveStatusType(type)
                            setAddCategory(true)
                          }}
                          className="dashboard-secondary p-0.5 text-gray-200"
                        >
                          <PlusIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        {filteredStatuses?.map((status, index) => (
                          <div
                            className="flex group items-center justify-between px-3 py-2 text-gray-500 rounded-lg shadow-none dark:shadow-none dark:text-gray-50 dark:bg-secondary bg-gray-50 up-element"
                            key={status?.id}
                          >
                            <div className="flex items-center">
                              <TagBullet theme={status?.color} />

                              <p className="flex items-center text-base font-medium">
                                {status.name}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              {status.isDefault && (
                                <span className="text-xs font-medium text-gray-400 dark:text-foreground">
                                  Default
                                </span>
                              )}
                              {!status.isDefault && (
                                <button
                                  onClick={() => setDefault(status)}
                                  className="unstyled-button text-xs hidden group-hover:block main-transition font-medium text-gray-400 dark:text-foreground/80 cursor-pointer"
                                >
                                  Set Default
                                </button>
                              )}
                              {filteredStatuses?.length !== index + 1 && (
                                <ArrowDownIcon
                                  onClick={() => moveStatus(status.id, 'down')}
                                  className="h-4 w-4 cursor-pointer text-background-accent/70 dark:text-foreground/80 hidden group-hover:block main-transition"
                                />
                              )}
                              {filteredStatuses?.length !== 1 && index !== 0 && (
                                <ArrowUpIcon
                                  onClick={() => moveStatus(status.id, 'up')}
                                  className="h-4 w-4 cursor-pointer text-background-accent/70 dark:text-foreground/80 hidden group-hover:block main-transition"
                                />
                              )}
                              <button
                                onClick={() => {
                                  setActiveStatus(status.id)
                                  setEditModal(true)
                                }}
                                className="px-2 text-xs shadow-none dashboard-secondary"
                              >
                                <CogIcon className="w-3.5 h-3.5 mr-1 text-gray-200" /> Edit
                              </button>
                              <button
                                className="px-2 text-xs shadow-none dashboard-secondary"
                                onClick={() => {
                                  setActiveStatus(status.id)
                                  setConfirmDelete(true)
                                }}
                              >
                                <XIcon className="w-3.5 h-3.5 mr-1 text-gray-200 " /> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="relative flex items-start p-3 mt-6 rounded-md shadow-none dark:bg-secondary bg-gray-50 up-element">
                <div className="flex items-center h-5">
                  <input
                    id="hideCompletedAndCanceled"
                    aria-describedby="public-tags-description"
                    name="hideCompletedAndCanceled"
                    type="checkbox"
                    checked={org.settings.hideCompletedAndCanceled}
                    onChange={(e) => {
                      const newValue = e.target.checked
                      orgSettingsChanger(
                        { hideCompletedAndCanceled: newValue },
                        {
                          ...org,
                          settings: { ...org.settings, hideCompletedAndCanceled: newValue },
                        },
                        mutateCurrentOrg
                      )
                    }}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="hideCompletedAndCanceled"
                    className="font-medium text-gray-600 dark:text-white"
                  >
                    Hide completed and canceled posts from feedback board
                  </label>
                  <p id="public-tags-description" className="text-gray-400 dark:text-foreground">
                    By default completed and canceled posts are shown on the feedback board. You can
                    hide them to keep your feedback board clean.
                  </p>
                </div>
              </div>
              <div className="relative flex items-start p-3 mt-6 rounded-md shadow-none dark:bg-secondary bg-gray-50 up-element">
                <div className="flex items-center h-5">
                  <input
                    id="hide-statuses"
                    aria-describedby="hide-statuses-description"
                    name="hideStatusFromPublic"
                    type="checkbox"
                    checked={org.settings.hideStatusFromPublic}
                    onChange={(e) => {
                      const newValue = e.target.checked
                      orgSettingsChanger(
                        { hideStatusFromPublic: newValue },
                        { ...org, settings: { ...org.settings, hideStatusFromPublic: newValue } },
                        mutateCurrentOrg
                      )
                    }}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="hide-statuses"
                    className="font-medium text-gray-600 dark:text-white"
                  >
                    Hide all statuses from public feedback board
                  </label>
                  <p id="public-tags-description" className="text-gray-400 dark:text-foreground">
                    By default users will be able to see statuses of posts on the feedback board.
                    Check this option to hide all statuses from the public feedback board.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SettingsWrapper>
    </DashboardWrapper>
  )
}

export default Statuses
