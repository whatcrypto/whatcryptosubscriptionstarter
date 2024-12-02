import { AxiosError } from 'axios'
import { useAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import React, { useEffect } from 'react'
import {
  devopsStorePushPreferences,
  pushWorkItemToDevOps,
  updateOrganization,
} from '../../network/lib/organization'
import { popupNotificationsAtom } from '../atoms/notificationAtom'
import { useCurrentOrganization, useDevOpsConfig } from '../data/organization'
import { ISubmission } from '../interfaces/ISubmission'
import InlineError from './InlineError'
import { toast } from 'sonner'
import Loader from './Loader'

import MultiselectButton from './MultiselectButton'
import ModularComboBox from './radix/ModularComboBox'
import { CommandGroup, CommandItem } from './radix/Command'
import { getOrganizationUrl } from '@/lib/subdomain'
import { getContentForNewPost } from './CreateNewClickupPost'

const CreateNewDevOpsWorkItem: React.FC<{
  submission: ISubmission
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  callback?: () => void
}> = ({ submission, setOpen, callback }) => {
  const [workItemTitle, setWorkItemTitle] = React.useState(submission.title)
  const [content, setContent] = React.useState<string>('')
  const [popupNotifications, setPopupNotifications] = useAtom(popupNotificationsAtom)
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const { devOpsConfig } = useDevOpsConfig()
  const { t } = useTranslation()
  const [selectedProjectName, setSelectedProjectName] = React.useState('')
  const [selectedWorkItemType, setSelectedWorkItemType] = React.useState('')
  const [selectedPriority, setSelectedPriority] = React.useState('')
  const { org } = useCurrentOrganization()

  useEffect(() => {
    if (submission && org) {
      getContentForNewPost(submission, org).then(setContent)
    }
  }, [submission, org])

  useEffect(() => {
    if (!devOpsConfig) return
    if (!devOpsConfig.pushPreferences) return
    if (!devOpsConfig.pushPreferences.projectName) return

    // check if projectName is in projects
    const project = devOpsConfig.projects.find(
      (p) => p.name === devOpsConfig.pushPreferences.projectName
    )

    if (!project) return

    setSelectedProjectName(project.name)

    if (!devOpsConfig.pushPreferences.workItemType) return

    const workItemType = project.workItemTypes.find(
      (t) => t.name === devOpsConfig.pushPreferences.workItemType
    )

    if (!workItemType) return

    setSelectedWorkItemType(workItemType.name)

    if (devOpsConfig.pushPreferences.priority) {
      setSelectedPriority(devOpsConfig.pushPreferences.priority)
    }
  }, [devOpsConfig])

  const pushToDevOps = () => {
    if (loading) return
    if (!selectedProjectName) {
      setError('Please select a project')
      return
    }

    if (!selectedWorkItemType) {
      setError('Please select a type')
      return
    }

    if (!workItemTitle) {
      setError('Please enter a title')
      return
    }

    setLoading(true)

    pushWorkItemToDevOps({
      title: workItemTitle,
      description: content,
      submissionId: submission.id,
      projectName: selectedProjectName,
      workItemType: selectedWorkItemType,
      priority: selectedPriority,
    })
      .then((res) => {
        if (res.data.success) {
          setOpen(false)
          setLoading(false)

          callback && callback()
          toast.success('Work item pushed to DevOps')
          // Save the selected project, type, and priority for next time
          devopsStorePushPreferences({
            projectName: selectedProjectName,
            workItemType: selectedWorkItemType,
            priority: selectedPriority,
          }).catch(() => {
            toast.error('Error saving DevOps data')
          })
        }
      })
      .catch((err: AxiosError) => {
        setLoading(false)
        toast.error('Could not push work item to DevOps. ' + err.response?.data.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <p className="mt-3 mb-1 text-sm font-medium text-gray-400 dark:text-foreground">
        Work Item Title
      </p>
      <input
        value={workItemTitle}
        onChange={(event) => setWorkItemTitle(event.target.value)}
        placeholder={t('title-of-your-post')}
      />
      <div className="flex items-center mt-3">
        <p className="text-sm font-medium text-gray-400 dark:text-foreground">{t('content')}</p>
      </div>

      <div className="mt-1">
        <textarea rows={4} value={content} onChange={(event) => setContent(event.target.value)} />
      </div>
      {devOpsConfig ? (
        <div>
          <div className="flex w-full gap-4">
            <div className="w-full">
              <div className="flex items-center mt-3 ">
                <p className="mb-1 text-sm font-medium text-gray-400 dark:text-foreground">
                  Project
                </p>
              </div>
              <div className="">
                <ModularComboBox
                  searchableDisplayName="Projects"
                  TriggerButton={() => (
                    <MultiselectButton className="h-8">
                      {devOpsConfig.projects.find((p) => p.name === selectedProjectName)?.name ||
                        'Select a Project'}
                    </MultiselectButton>
                  )}
                  CommandItems={({ closeComboBox }) => (
                    <CommandGroup>
                      {devOpsConfig.projects.map((p) => (
                        <CommandItem
                          key={p.id}
                          onSelect={() => {
                            setSelectedProjectName(p.name)
                            setSelectedWorkItemType('')
                            setSelectedPriority('')
                            closeComboBox()
                          }}
                        >
                          {p.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  popoverContentProps={{
                    align: 'start',
                  }}
                />
              </div>
            </div>
            <div className="w-full">
              <div className="flex items-center mt-3 ">
                <p className="mb-1 text-sm font-medium text-gray-400 dark:text-foreground">Type</p>
              </div>
              <div className="">
                <ModularComboBox
                  searchableDisplayName="Types"
                  TriggerButton={() => (
                    <MultiselectButton className="h-8">
                      {devOpsConfig.projects
                        .find((p) => p.name === selectedProjectName)
                        ?.workItemTypes.find((t) => t.name === selectedWorkItemType)?.name ||
                        'Select a Type'}
                    </MultiselectButton>
                  )}
                  CommandItems={({ closeComboBox }) => (
                    <CommandGroup>
                      {devOpsConfig.projects
                        .find((p) => p.name === selectedProjectName)
                        ?.workItemTypes.map((t) => (
                          <CommandItem
                            key={t.name}
                            onSelect={() => {
                              setSelectedWorkItemType(t.name)
                              closeComboBox()
                            }}
                          >
                            {t.name}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  )}
                  popoverContentProps={{
                    align: 'start',
                  }}
                />
              </div>
            </div>
            <div className="w-full">
              <div className="flex items-center mt-3 ">
                <p className="mb-1 text-sm font-medium text-gray-400 dark:text-foreground">
                  Priority
                </p>
              </div>
              <div className="">
                <ModularComboBox
                  searchableDisplayName="Priorities"
                  TriggerButton={() => (
                    <MultiselectButton className="h-8">
                      {selectedPriority || 'Select a Priority'}
                    </MultiselectButton>
                  )}
                  CommandItems={({ closeComboBox }) => (
                    <CommandGroup>
                      {['1', '2', '3', '4'].map((priority) => (
                        <CommandItem
                          key={priority}
                          onSelect={() => {
                            setSelectedPriority(priority)
                            closeComboBox()
                          }}
                        >
                          {priority}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  popoverContentProps={{
                    align: 'start',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center mt-8 mb-4">
          <div className="w-5 h-5 secondary-svg">
            <Loader />
          </div>
        </div>
      )}

      {error && <InlineError error={error}></InlineError>}
      <div className="flex justify-end w-full pt-4">
        <button onClick={pushToDevOps} className="dashboard-primary">
          {loading && (
            <div className="secondary-svg mr-1.5">
              <Loader />
            </div>
          )}
          Push to DevOps
        </button>
      </div>
    </div>
  )
}

export default CreateNewDevOpsWorkItem
