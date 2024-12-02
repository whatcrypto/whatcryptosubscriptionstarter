import {
  ClipboardCopyIcon,
  MailIcon,
  OfficeBuildingIcon,
  PlusCircleIcon,
  UserIcon,
  XIcon,
} from '@heroicons/react/solid'
import React, { useEffect, useState } from 'react'
import PopupWrapper from './PopupWrapper'
import InlineError from './InlineError'
import useSWR, { KeyedMutator } from 'swr'
import { addUpvoter, getSurveyVoters, removeUpvoter } from '../../network/lib/submission'
import Loader from './Loader'
import EmptyIllustration from './EmptyIllustration'
import { useCurrentOrganization } from '../data/organization'
import MRRBadge from './MRRBadge'
import { CopyText } from './UsersInfo'
import UserPicture from './UserPicture'
import { ISubmission } from '@/interfaces/ISubmission'
import { cn } from '@/lib/utils'
import { GetIconPerType, getColorByScore } from './LargeSurvey'
import Tooltip from './Tooltip'
import { surveyTypeData } from './Survey'
import { v4 as uuid } from 'uuid'
import { useTranslation } from 'next-i18next'
import { useUser } from '@/data/user'
import { CommandGroup } from './radix/Command'
import ActiveUserSearchResults from './ActiveUserSearchResults'
import AddNewUserAuthorModal from './AddNewUserAuthorModal'
import ModularComboBox from './radix/ModularComboBox'
import { ICustomer } from '@/interfaces/IUser'
import { TooltipProvider } from './radix/Tooltip'
import { can } from '@/lib/acl'
import { SurveyVoters } from './SurveyVoterList'
import { toast } from 'sonner'

export const getSurveyBeautifiedType = (type: string) => {
  switch (type) {
    case 'often':
      return 'Usage Frequency'
    case 'importance':
      return 'Importance'
    case 'urgency':
      return 'Urgency'
  }
}

const AddUpvoters: React.FC<{
  submission: ISubmission
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  mutateSubmissions: KeyedMutator<any[]>
  submissionId: string
}> = ({ open, setOpen, submissionId, mutateSubmissions, submission }) => {
  const { user } = useUser()
  const { org } = useCurrentOrganization()
  const { mutate } = useSWR(
    can(user?.id, 'view_users', org) ? ['/v1/submission/subscribers', { submissionId }] : null
  )
  const { t } = useTranslation()

  interface Upvoter {
    id: string
    username: string
    email: string
    error: string
    userId?: string
    companies: []
    new: boolean
    profilePicture: string
    mrr: number
    type: 'customer' | 'admin' | 'guest'
  }

  const [createNewUser, setCreateNewUser] = useState(false)
  const [upvoterData, setUpvoterData] = useState<Upvoter[] | []>([])
  const [loading, setLoading] = useState(true)
  const [voters, setVoters] = useState<SurveyVoters[]>([])

  useEffect(() => {
    setLoading(true)
    if (open) {
      getSurveyVoters(submission.id, 'all')
        .then((res) => {
          if (res.data.success) {
            setVoters(res.data?.surveyVoters)
          }
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          setLoading(false)
        })

      mutate().then((data) => {
        setLoading(false)
        setUpvoterData(
          data?.map((upvoter: any) => ({
            type: upvoter.type,
            companies: upvoter.companies,
            userId: upvoter.userId,
            username: upvoter.name,
            email: upvoter.email,
            error: '',
            profilePicture: upvoter.profilePicture,
            id: upvoter.id,
            new: false,
            mrr: upvoter?.companies?.reduce((acc: any, item: any) => acc + item?.monthlySpend, 0),
          }))
        )
      })
    }
  }, [open])

  const processNewUpvoter = async (upvoter: Upvoter): Promise<void> => {
    try {
      const res = upvoter.email
        ? await addUpvoter(submissionId, upvoter.type, upvoter.username, upvoter.email)
        : await addUpvoter(submissionId, 'guest', upvoter.username)

      if (res.data.success) {
        updateUpvoterData(upvoter, res)
        mutateSubmissions()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const updateUpvoterData = (upvoter: Upvoter, res: any): void => {
    const user = res.data.user
    setUpvoterData((prev: Upvoter[]) =>
      prev.map((oldUpvoter: Upvoter) =>
        oldUpvoter.id === upvoter.id
          ? {
              ...oldUpvoter,
              ...createUpdatedUpvoterData(user, upvoter, res),
            }
          : oldUpvoter
      )
    )
  }

  const createUpdatedUpvoterData = (user: any, upvoter: Upvoter, res: any): Partial<Upvoter> => ({
    type: upvoter.type,
    companies: user?.companies,
    userId: user?.userId,
    username: user?.name || upvoter.username,
    email: user?.email || upvoter.email,
    error: '',
    profilePicture: user?.profilePicture,
    id: res.data.upvoterId,
    new: false,
    mrr: user?.companies?.reduce(
      (acc: number, item: { monthlySpend?: number }) => acc + (item.monthlySpend || 0),
      0
    ),
  })

  const copyDataToClipboard = (email?: boolean) => {
    const data = upvoterData
      .map((upvoter) => {
        if (upvoter.email) {
          return `${upvoter.username} <${upvoter.email}>`
        } else {
          return upvoter.username
        }
      })
      .join(', ')
    if (email) {
      // Open email cleint with that data
      window?.open(`mailto:${data}?subject=${encodeURIComponent(submission?.title)}`)
    } else {
      toast.success('Successfully copied to clipboard')
      navigator?.clipboard?.writeText(data)
    }
  }

  const UpvoterSurvey = ({
    upvoter,
    type,
  }: {
    upvoter: Upvoter
    type: 'often' | 'importance' | 'urgency'
  }) => {
    if (!submission.surveyScores?.[type]?.voters?.includes(upvoter?.id)) return null
    const voterScore = voters?.find((vote) => vote?.user?.id === upvoter?.id && vote?.type === type)
      ?.score

    if (typeof voterScore !== 'number') return null

    return (
      <Tooltip
        child={GetIconPerType({
          scoreType: type,
          color: getColorByScore(voterScore, true)?.replace('bg', 'text')?.replace('bg', 'text'),
        })}
        dropDown={
          <p className="text-xs text-gray-400 dark:text-foreground first-letter:uppercase">
            {getSurveyBeautifiedType(type)} is {t(surveyTypeData?.[type]?.options[voterScore])}
          </p>
        }
      />
    )
  }

  return (
    <PopupWrapper
      fullScreen={true}
      large={true}
      hasPadding={false}
      isOpen={open}
      setIsOpen={setOpen}
    >
      <AddNewUserAuthorModal
        makeNameOptional={true}
        isOpen={createNewUser}
        makeEmailOptional={true}
        setIsOpen={setCreateNewUser}
        onSubmit={(data) => {
          // Add new user to the upvoters list
          const newUpvoterData = {
            username: data.name || 'An Anonymous User',
            email: data.email || '',
            id: uuid(),
            error: '',
            new: true,
            companies: [],
            userId: '',
            profilePicture: '',
            mrr: 99999999,
            type: 'customer',
          } as Upvoter
          setUpvoterData((prev) => [newUpvoterData, ...prev])
          processNewUpvoter(newUpvoterData)
        }}
      />
      <div>
        <div className="p-6">
          <h2 className="text-lg font-medium leading-6 text-gray-500 dark:text-white">
            View & add upvoters
          </h2>
          <div className="mt-2">
            <p className="text-sm text-gray-400 dark:text-foreground">
              {t('upvoters-will-receive-notifications-by-email-when-you-make-changes-to-the-post')}
            </p>
          </div>
        </div>
        <span className="hidden text-lime-500"></span>
        <div className="flex gap-6 px-6 pb-3 border-b dark:border-border">
          <div className="flex items-center w-full gap-1 text-sm font-semibold text-gray-400 dark:text-foreground">
            <UserIcon className="secondary-svg" />
            Name
          </div>
          <div className="flex items-center w-full gap-1 text-sm font-semibold text-gray-400 dark:text-foreground">
            <MailIcon className="secondary-svg" />
            Email
          </div>
        </div>
        <div
          className={cn(
            'max-h-[600px] relative custom-scrollbar overflow-y-auto',
            !loading && upvoterData?.length === 0 && 'flex items-center justify-center',
            loading && 'min-h-[200px]'
          )}
        >
          <div className="divide-y dark:divide-border">
            {!loading ? (
              !upvoterData || upvoterData?.length === 0 ? (
                <div className="flex  min-h-[200px] flex-col items-center justify-center">
                  <div className="w-16 h-16 ">
                    <EmptyIllustration primary={org.color} />
                  </div>
                  <p className="dark:text-foreground text-center mx-3 text-gray-400 text-sm mt-1.5 font-medium">
                    No upvoters yet, check again later
                  </p>
                </div>
              ) : (
                upvoterData
                  .sort((a, b) => {
                    return b.mrr - a.mrr
                  })
                  .map((upvoter, index) => {
                    return (
                      <div
                        key={upvoter.id}
                        className={`relative ${
                          index % 2 == 0 ? 'dark:bg-secondary/40 bg-gray-50/60' : 'bg-transparent'
                        }  md:gap-x-6 px-4 sm:px-6 py-4 md:py-0   md:grid md:grid-cols-12`}
                      >
                        <div className="flex items-center w-full col-span-6 pt-1 pb-2 overflow-auto custom-scrollbar md:py-3">
                          <div className="mr-2.5">
                            <UserPicture
                              img={upvoter.profilePicture}
                              authorId={upvoter?.id || ''}
                            />
                          </div>

                          <div className="flex flex-wrap items-center justify-between w-full md:flex-nowrap">
                            <div className="flex items-center gap-3">
                              <CopyText value={upvoter.username}>
                                <p className="text-base lg:max-w-[300px] truncate text-gray-500 dark:text-gray-50 tracking-tight font-medium flex-shrink-0">
                                  {upvoter.username}
                                </p>
                              </CopyText>
                              {upvoter?.companies && (
                                <div className="flex items-center gap-2 justify-normal">
                                  {upvoter?.companies?.map((company: any) => (
                                    <div
                                      key={company.id}
                                      className="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-foreground"
                                    >
                                      <OfficeBuildingIcon className="flex-shrink-0 secondary-svg" />
                                      <CopyText value={company.name}>
                                        <span className=" max-w-[160px] truncate">
                                          {company.name}
                                        </span>
                                      </CopyText>
                                    </div>
                                  ))}
                                  {upvoter?.mrr && upvoter?.mrr !== 99999999 ? (
                                    <div className="pl-2 border-l dark:border-border ">
                                      <MRRBadge mrr={upvoter.mrr?.toString()} small={true} />
                                    </div>
                                  ) : null}
                                  <div className="flex items-center gap-2 pl-2 border-l dark:border-border">
                                    <UpvoterSurvey upvoter={upvoter} type="often" />
                                    <UpvoterSurvey upvoter={upvoter} type="urgency" />
                                    <UpvoterSurvey upvoter={upvoter} type="importance" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-start w-full h-full col-span-5 md:py-3">
                          <div className="w-full text-sm font-medium text-gray-500 dark:text-foreground">
                            <CopyText value={upvoter.email}>
                              <p className="max-w-[500px] truncate">{upvoter.email}</p>
                            </CopyText>
                          </div>
                        </div>
                        <div
                          className={`absolute md:inline-flex md:relative right-3 my-auto inset-y-0 col-span-1 ml-auto rounded-md `}
                        >
                          <button
                            onClick={() => {
                              setUpvoterData((prev) =>
                                prev.filter((item) => item.id !== upvoter.id)
                              )
                              if (!upvoter.new) {
                                removeUpvoter(submissionId, {
                                  id: upvoter.id,
                                  type: upvoter.type,
                                })
                                  .catch(() => {
                                    toast.error('Failed to remove upvoter')
                                  })
                                  .finally(() => {
                                    mutateSubmissions()
                                  })
                              }
                            }}
                            className={`dashboard-secondary p-1 my-3`}
                          >
                            <XIcon className="w-4 h-4 secondary-svg" />
                          </button>
                        </div>
                        <div className="col-span-12">
                          <InlineError error={upvoter.error} />
                        </div>
                      </div>
                    )
                  })
              )
            ) : (
              <div className="absolute inset-0 flex items-center justify-center w-full">
                <div className="w-6 h-6 secondary-svg">
                  <Loader />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row flex-wrap items-end justify-end gap-3 p-4 border-t sm:p-6 dark:border-border md:items-center md:justify-betwen">
          {upvoterData && upvoterData.length > 0 && (
            <>
              <button
                onClick={() => copyDataToClipboard()}
                className="border shadow-none dashboard-secondary bg-gray-50 border-gray-100/50 py-1.5 px-2.5"
              >
                <ClipboardCopyIcon className="w-4 h-4 mr-2 text-background-accent dark:text-gray-100" />
                Copy data
              </button>
              <button
                onClick={() => copyDataToClipboard(true)}
                className="border shadow-none dashboard-secondary bg-gray-50 border-gray-100/50 py-1.5 px-2.5"
              >
                <MailIcon className="w-4 h-4 mr-2 text-background-accent dark:text-gray-100" />
                Email all upvoters
              </button>
            </>
          )}

          <div>
            <TooltipProvider>
              <ModularComboBox
                TriggerButton={() => (
                  <button className="border shadow-none dashboard-primary py-1.5 px-2.5">
                    <PlusCircleIcon className="w-4 h-4 mr-1.5" />
                    {t('add-new-upvoter')}
                  </button>
                )}
                CommandItems={({ closeComboBox }) => {
                  return (
                    <CommandGroup>
                      <ActiveUserSearchResults
                        setNewAuthor={(user?: ICustomer) => {
                          closeComboBox()
                          if (user) {
                            if (upvoterData.find((upvoter) => upvoter.email === user.email)) {
                              toast.error('User already added')
                              return
                            }
                            setUpvoterData((prev) => [
                              {
                                email: user.email || '',
                                username: user.name || '',
                                id: user.id,
                                error: '',
                                new: false,
                                companies: (user.companies || []) as any,
                                userId: user?.userId || '',
                                profilePicture: user.profilePicture || '',
                                mrr: user?.companies?.reduce(
                                  (acc: number, item: { monthlySpend?: number }) =>
                                    acc + (item.monthlySpend || 0),
                                  0
                                ),
                                type: 'customer',
                              },
                              ...prev,
                            ])
                            if (user) {
                              addUpvoter(submissionId, 'customer', user.name || '', user.email)
                                .catch(() => {
                                  toast.error('Failed to add upvoter')
                                })
                                .finally(() => {
                                  mutateSubmissions()
                                })
                            }
                          } else {
                            setCreateNewUser(true)
                          }
                        }}
                      />
                    </CommandGroup>
                  )
                }}
                allowNewCreation={false}
                searchableDisplayName="users"
              />
            </TooltipProvider>
          </div>
        </div>
      </div>
    </PopupWrapper>
  )
}

export default AddUpvoters
