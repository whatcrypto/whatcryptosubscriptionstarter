import { AxiosError } from 'axios'
import { useAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import { pushIssueToClickup, updateOrganization } from '../../network/lib/organization'
import { popupNotificationsAtom } from '../atoms/notificationAtom'
import { useClickupInformation, useCurrentOrganization } from '../data/organization'
import { ISubmission } from '../interfaces/ISubmission'
import InlineError from './InlineError'
import { toast } from 'sonner'
import Loader from './Loader'

import MultiselectButton from './MultiselectButton'
import ModularComboBox from './radix/ModularComboBox'
import { CommandGroup, CommandItem } from './radix/Command'
import { IOrganization } from '@/interfaces/IOrganization'

export const createCustomInputFieldText = (submission: ISubmission, org: IOrganization) => {
  if (
    !submission.customInputValues ||
    Object.keys(submission.customInputValues).length === 0 ||
    !org.customInputFields ||
    org.customInputFields.length === 0
  ) {
    return ''
  }

  // Output should be like this:
  // Field 1: Value 1
  // Field 2: Value 2

  const customInputValues = submission.customInputValues

  let output = 'Custom Fields:\n'
  for (const customFieldId in customInputValues) {
    // look up the field from the organization
    const customField = org.customInputFields.find((cf) => cf._id === customFieldId)
    if (!customField) {
      continue
    }

    output += `${customField.label}: ${customInputValues[customFieldId]}\n`
  }

  // remove the last newline
  output = output.trim()

  return output
}

export const getContentForNewPost = async (submission: ISubmission, org: IOrganization) => {
  const quillToText = (await import('../lib/quillToText')).default
  let output = await quillToText(submission.content)

  const customInputFieldText = createCustomInputFieldText(submission, org)
  if (!output) {
    return customInputFieldText
  }

  return output + '\n\n' + customInputFieldText
}

const CreateNewClickupPost: React.FC<{
  submission: ISubmission
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  callback?: () => void
}> = ({ submission, setOpen, callback }) => {
  const [issueTitle, setIssueTitle] = React.useState(submission.title)
  const { org } = useCurrentOrganization()
  const [content, setContent] = useState('')
  const [selectedTeam, setSelectedTeam] = React.useState('')
  const [selectedFolder, setSelectedFolder] = React.useState('')
  const [selectedList, setSelectedList] = React.useState('')
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const { clickupInformation } = useClickupInformation()
  const { t } = useTranslation()

  useEffect(() => {
    // set default team
    if (!clickupInformation) return
    if (clickupInformation.clickupPreviousTeamId) {
      setSelectedTeam(clickupInformation.clickupPreviousTeamId)
    }
    if (typeof clickupInformation.clickupPreviousFolderId !== 'undefined') {
      setSelectedFolder(clickupInformation.clickupPreviousFolderId)
    }
    if (clickupInformation.clickupPreviousListId) {
      setSelectedList(clickupInformation.clickupPreviousListId)
    }
  }, [clickupInformation])

  useEffect(() => {
    getContentForNewPost(submission, org).then(setContent)
  }, [submission, org])

  const pushToClickup = () => {
    if (loading) return
    if (!selectedList) {
      setError('Please select a list')
      return
    }

    if (!issueTitle) {
      setError('Please enter a title')
      return
    }

    setLoading(true)

    pushIssueToClickup({
      title: issueTitle,
      description: content,
      teamId: selectedTeam,
      submissionId: submission.id,
      status: submission.status,
      listId: selectedList,
    })
      .then((res) => {
        if (res.data.success) {
          setOpen(false)
          setLoading(false)

          callback && callback()
          toast.success('Issue pushed to ClickUp')
          // save the selected team, folder, list for next time
          updateOrganization({
            clickupPreviousTeamId: selectedTeam,
            clickupPreviousFolderId: selectedFolder,
            clickupPreviousListId: selectedList,
          }).catch(() => {
            toast.error('Error saving ClickUp data')
          })
        }
      })
      .catch((err: AxiosError) => {
        setLoading(false)
        toast.error('Could not push issue to ClickUp. ' + err.response?.data.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <div>
      <p className="mt-3 mb-1 text-sm font-medium text-gray-400 dark:text-foreground">Title</p>
      <input
        value={issueTitle}
        onChange={(event) => setIssueTitle((prev) => event.target.value)}
        placeholder={t('title-of-your-post')}
      />
      <div className="flex items-center mt-3">
        <p className="text-sm font-medium text-gray-400 dark:text-foreground">{t('content')}</p>
      </div>

      <div className="mt-1">
        <textarea
          rows={4}
          value={content}
          onChange={(event) => setContent((prev) => event.target.value)}
          //   placeholder={t('title-of-your-post')}
        />
      </div>
      {clickupInformation ? (
        <div>
          <div className="flex w-full gap-4">
            <div className="w-full">
              <div className="flex items-center mt-3 ">
                <p className="mb-1 text-sm font-medium text-gray-400 dark:text-foreground">Team</p>
              </div>
              <div className="">
                <ModularComboBox
                  searchableDisplayName="Team Selection"
                  TriggerButton={() => (
                    <MultiselectButton className="h-8">
                      {clickupInformation.teams.find((t) => t.id === selectedTeam)?.name ||
                        'Select a Team'}
                    </MultiselectButton>
                  )}
                  CommandItems={({ closeComboBox }) => (
                    <CommandGroup>
                      {clickupInformation.teams.map((t) => (
                        <CommandItem
                          key={t.id}
                          onSelect={() => {
                            setSelectedTeam(t.id)
                            setSelectedFolder('')
                            setSelectedList('')
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
                  Folder
                </p>
              </div>
              <div className="">
                <ModularComboBox
                  searchableDisplayName="Folder Selection"
                  TriggerButton={() => (
                    <MultiselectButton className="h-8">
                      {!selectedFolder
                        ? 'No Folder'
                        : clickupInformation.folders.find((f) => f.id === selectedFolder)?.name ||
                          ''}
                    </MultiselectButton>
                  )}
                  CommandItems={({ closeComboBox }) => (
                    <CommandGroup>
                      {clickupInformation.folders
                        .filter((f) => f.space.id === selectedTeam)
                        .map((t) => (
                          <CommandItem
                            key={t.id}
                            onSelect={() => {
                              setSelectedFolder(t.id)
                              closeComboBox()
                            }}
                          >
                            {t.name}
                          </CommandItem>
                        ))}
                      <CommandItem
                        key="empty"
                        onSelect={() => {
                          setSelectedFolder('') // Set folder to null when the empty folder is selected
                          setSelectedList('')
                          closeComboBox()
                        }}
                      >
                        No Folder
                      </CommandItem>
                    </CommandGroup>
                  )}
                  popoverContentProps={{
                    align: 'start',
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex w-full gap-4">
            <div className="w-full">
              <div className="flex items-center mt-3 ">
                <p className="mb-1 text-sm font-medium text-gray-400 dark:text-foreground">List</p>
              </div>
              <div className="">
                <ModularComboBox
                  searchableDisplayName="List Selection"
                  TriggerButton={() => (
                    <MultiselectButton className="h-8">
                      {!selectedFolder
                        ? clickupInformation.folderlessLists.find((t) => t.id === selectedList)
                            ?.name || ''
                        : clickupInformation.folders
                            .find((t) => t.id === selectedFolder)
                            ?.lists.find((l) => l.id === selectedList)?.name || ''}
                    </MultiselectButton>
                  )}
                  CommandItems={({ closeComboBox }) => (
                    <CommandGroup>
                      {(!selectedFolder
                        ? clickupInformation.folderlessLists.filter(
                            (fl) => fl.space.id === selectedTeam
                          )
                        : clickupInformation.folders.find((f) => f.id === selectedFolder)?.lists
                      )?.map((item) => (
                        <CommandItem
                          key={item.id}
                          onSelect={() => {
                            setSelectedList(item.id)
                            closeComboBox()
                          }}
                        >
                          {item.name}
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
          {' '}
          <div className="w-5 h-5 secondary-svg">
            <Loader />
          </div>
        </div>
      )}

      {error && <InlineError error={error}></InlineError>}
      <div className="flex justify-end w-full pt-4">
        <button onClick={() => pushToClickup()} className="dashboard-primary">
          {loading && (
            <div className="secondary-svg mr-1.5">
              {' '}
              <Loader />
            </div>
          )}
          Push to ClickUp
        </button>
      </div>
    </div>
  )
}

export default CreateNewClickupPost
