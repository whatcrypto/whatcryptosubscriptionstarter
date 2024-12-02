import { ChevronRightIcon, LockClosedIcon, UserCircleIcon, XIcon } from '@heroicons/react/solid'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { KeyedMutator } from 'swr'
import { createSubmission, getSubmissionSuggestedCategory } from '../../network/lib/submission'
import { useCurrentOrganization } from '../data/organization'
import { IPostCategory, ISubmission, ISubmissionPaginate } from '../interfaces/ISubmission'
import InlineError from './InlineError'
import Loader from './Loader'
import TextEditor from './TextEditor'
import { useSingleSubmission } from '../data/submission'
import { useUser, useUserProfilePreview } from '../data/user'
import { useTranslation } from 'next-i18next'
import { toast } from 'sonner'
import { meilisearchClientAtom, metaDataAtom } from '../atoms/orgAtom'
import { useAtom, useAtomValue } from 'jotai'
import { sanitizeHTML } from '../lib/contentSanitizer'
import { Tag } from './NewEditModal'
import { getColor } from './TagBullet'
import { IOrganization, IOrganizationStatus, ICustomInputValues } from '../interfaces/IOrganization'
import { useRouter } from 'next/router'
import { cn } from '@/lib/utils'
import { Button } from './radix/Button'
import useSubmissionUrl from '@/hooks/submissionUrlSyncer'
import MainPostViewPopup from './MainPostViewPopup'
import CreatePostSimilarSuggestion from './CreatePostSimilarSuggestion'
import { AxiosError, AxiosResponse } from 'axios'
import { Switch } from './radix/Switch'
import ModularComboBox from './radix/ModularComboBox'
import { CommandGroup, CommandHeading } from './radix/Command'
import { CategoryContentDisplayer } from './helper/category'
import CreatePostOptions from './CreatePostOptions'
import CategoryCombobox from './CategoryCombobox'
import UserPicture from './UserPicture'
import { Tooltip, TooltipContent, TooltipProvider } from './radix/Tooltip'
import ActiveUserSearchResults from './ActiveUserSearchResults'
import { ICustomer } from '@/interfaces/IUser'
import AddNewUserAuthorModal from './AddNewUserAuthorModal'
import { TooltipTrigger } from '@radix-ui/react-tooltip'
import { Editor } from '@tiptap/react'
import SimpleTooltip from './SimpleTooltip'
import PublicBoardAuth from './PublicBoardAuth'
import useMeasure from 'react-use-measure'
import PostCreationCustomFields from './PostCreationCustomFields'
import { can, isMember } from '@/lib/acl'
import { analyticsEventOriginAtom } from '@/atoms/widgetAtom'

export type createPostType = {
  status: IOrganizationStatus | undefined
  eta: string | undefined
  tags: ISubmission['postTags'] | never[]
  assignee: string | undefined
  author: string | undefined
  user: { profilePicture?: string; id?: string; name: string; email: string } | undefined
  customInputValues: ICustomInputValues
}

export const validateCustomFields = (
  customFields: string[],
  org: IOrganization,
  selectedOptions: createPostType,
  setCustomInputFieldErrors: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean
    }>
  >
) => {
  if (!customFields || customFields?.length === 0) return true

  return customFields.every((field) => {
    const fieldData = org.customInputFields?.find((f) => f._id === field)

    const selectedOptionValue = selectedOptions.customInputValues[field]

    if (fieldData?.required) {
      if (Array.isArray(selectedOptionValue)) {
        const isLongEnough = selectedOptionValue?.length > 0
        setCustomInputFieldErrors((prev) => ({
          ...prev,
          [field]: !isLongEnough,
        }))
        return isLongEnough
      } else {
        if (typeof selectedOptionValue === 'string') {
          const isLongEnough =
            fieldData?.type === 'text'
              ? selectedOptionValue?.length > 2
              : selectedOptionValue?.length > 0
          setCustomInputFieldErrors((prev) => ({
            ...prev,
            [field]: !isLongEnough,
          }))
          return isLongEnough
        } else if (fieldData.type === 'checkbox') {
          if (fieldData.required) {
            const isTrue = selectedOptionValue === true
            setCustomInputFieldErrors((prev) => ({
              ...prev,
              [field]: !isTrue,
            }))
            return isTrue
          } else {
            setCustomInputFieldErrors((prev) => ({
              ...prev,
              [field]: false,
            }))
            return true
          }
        } else {
          const isntUndefined = selectedOptionValue !== undefined
          setCustomInputFieldErrors((prev) => ({
            ...prev,
            [field]: !isntUndefined,
          }))
          return isntUndefined
        }
      }
    }
    return true
  })
}

const CreatePost: React.FC<{
  isOpen?: boolean
  setIsOpen?: Function
  mutateSubmissions?: KeyedMutator<any[]>
  rawSubmissionData?: ISubmissionPaginate | ISubmissionPaginate[] | undefined
  postStatus?: IOrganizationStatus
  eta?: Date | null
  widget?: boolean
  initialCategory?: string
  showHiddenDisclaimer?: boolean
  submissionResults?: ISubmission[] | undefined
  setDisablePopupClosing?: (value: boolean) => void
  initialUser?: { profilePicture?: string; id?: string; name: string; email: string }
  onCreatePost?: (submission: ISubmission) => void
}> = ({
  isOpen,
  setIsOpen,
  mutateSubmissions,
  rawSubmissionData,
  postStatus,
  widget,
  initialCategory,
  showHiddenDisclaimer = false,
  eta,
  submissionResults,
  setDisablePopupClosing,
  initialUser,
  onCreatePost,
}) => {
  const [formData, setFormData] = useState({ title: '', content: '' })
  const [category, setCategory] = useState<IPostCategory>()
  const [tags, setTags] = useState<Tag[]>([])
  const [success, setSuccess] = useState('')
  const [meilisearchClient, setMeilisearchClient] = useAtom(meilisearchClientAtom)
  const [authenitcateModal, setAuthenitacteModal] = useState(false)
  const eventOrigin = useAtomValue(analyticsEventOriginAtom)

  const [errors, setErrors] = useState({ title: false })
  const [loading, setLoading] = useState(false)
  const [activeSubmissionId, setActiveSubmissionId] = useState('')
  const [createNewUser, setCreateNewUser] = React.useState(false)
  const [createMore, setCreateMore] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)
  const [loadingSuggestedCategory, setLoadingSuggestedCategory] = useState<boolean | undefined>(
    undefined
  )

  const [metaData, setMetaData] = useAtom(metaDataAtom)
  const editorRef: React.MutableRefObject<Editor | null> = useRef(null)
  const hasUserChangedCategoryRef = useRef(false)
  let [ref, { width }] = useMeasure()

  const { org, mutateCurrentOrg } = useCurrentOrganization()
  const { user } = useUser()
  const { t } = useTranslation()
  const router = useRouter()
  const { userMutate: userProfilePreviewMutate } = useUserProfilePreview(
    user && !isMember(user?.id, org) && !widget ? true : false
  )

  const { restoreUrl, setUrl } = useSubmissionUrl()
  const [selectedOptions, setSelectedOptions] = useState<createPostType>({
    status: postStatus ? postStatus : org?.postStatuses?.find((s) => s.isDefault),
    eta: eta ? eta?.toISOString() : undefined,
    tags: [],
    assignee: undefined,
    author: undefined,
    customInputValues: {},
    user: initialUser
      ? initialUser
      : {
          profilePicture: user?.profilePicture || '',
          id: user?.id || '',
          name: user?.name || '',
          email: user?.email || '',
        },
  })

  const [customInputFieldErrors, setCustomInputFieldErrors] = useState<{
    [key: string]: boolean
  }>({})

  const setCustomFieldsForCategory = (category?: IPostCategory) => {
    const customFields = category?.customInputFields
    if (!category || !customFields || customFields?.length === 0) {
      // Remove all custom fields
      setSelectedOptions((prev) => ({
        ...prev,
        customInputValues: {},
      }))
    } else {
      setSelectedOptions((prev) => ({
        ...prev,
        customInputValues: customFields.reduce((acc: ICustomInputValues, field) => {
          if (acc?.[field]) return acc
          return { ...acc, [field]: '' }
        }, {}),
      }))
    }
  }

  useEffect(() => {
    if (!category) {
      if (router.query?.b) {
        const queryValue = router.query.b as string
        const realCategory = org.postCategories.find(
          (cat) => cat.id === queryValue && (!cat.disablePostCreation || isMember(user?.id, org)) // Updated condition
        )
        if (realCategory) {
          setCustomFieldsForCategory(realCategory)
          setCategory(realCategory)
          hasUserChangedCategoryRef.current = true
        }
      } else {
        const newCategory = initialCategory
          ? org.postCategories.find(
              (c) =>
                c.category === initialCategory &&
                (!c.disablePostCreation || isMember(user?.id, org)) // Updated condition
            )
          : org.postCategories.find(
              (c) => !c.disablePostCreation || isMember(user?.id, org) // Updated condition
            )
        if (newCategory) {
          setCustomFieldsForCategory(newCategory)
          setCategory(newCategory)
          if (initialCategory) {
            hasUserChangedCategoryRef.current = true
          }
        }
      }
    }
  }, [router.query, isOpen, initialCategory, category, org.postCategories])

  useEffect(() => {
    if (setDisablePopupClosing !== undefined) {
      if (formData.content.length > 7 || formData.title.length > 0) {
        setDisablePopupClosing(true)
      } else {
        setDisablePopupClosing(false)
      }
    }
  }, [formData.title, formData.content, setDisablePopupClosing])

  const createPost = async () => {
    if (loading) return
    setSuccess('')
    setErrors((prev) => ({ ...prev, title: false }))

    if (isFormDataInvalid()) {
      setErrors((prev) => ({ ...prev, title: true }))
      return
    }

    // Validate custom fields
    if (
      !validateCustomFields(
        category?.customInputFields ? category?.customInputFields : [],
        org,
        selectedOptions,
        setCustomInputFieldErrors
      )
    ) {
      toast.error('Please fill in all required custom fields', {
        position: 'bottom-right',
      })
      return
    }

    setLoading(true)
    const submittingCategory = category ? category : org.postCategories[0]

    let newSubData = buildSubmissionData(submittingCategory)
    createSubmission(newSubData)
      .then((resp) => {
        handleSuccess(resp, submittingCategory)
        hasUserChangedCategoryRef.current = false
      })
      .catch(handleError)
      .finally(() => setLoading(false))
  }

  const isFormDataInvalid = (): boolean => {
    return formData.title.length < 2
  }

  const buildSubmissionData = (submittingCategory: IOrganization['postCategories'][0]) => {
    const modifiedCustomInputValues = Object.fromEntries(
      Object.entries(selectedOptions.customInputValues).map(([key, value]) => {
        return [key, value ? value : null]
      })
    )

    let newSubData = {
      title: formData.title,
      content: formData.content,
      category: submittingCategory,
      postTags: selectedOptions.tags,
      postStatus: selectedOptions.status,
      eta: selectedOptions.eta ? selectedOptions.eta : undefined,
      metadata: metaData ? metaData : undefined,
      assignee: selectedOptions.assignee ? selectedOptions.assignee : undefined,
      authorId: selectedOptions.user?.id || undefined,
      email: !selectedOptions.user?.id ? selectedOptions.user?.email : undefined,
      // Map through values and change value to {value: value}
      customInputValues: modifiedCustomInputValues,
      eventOrigin,
    }
    if (!newSubData.email) delete newSubData.email

    return newSubData
  }

  const handleSuccess = (
    resp: AxiosResponse,
    submittingCategory: IOrganization['postCategories'][0]
  ) => {
    // Additional success logic like clearing form data, updating state, etc.
    if (widget) {
      toast.success('Successfully created post and forwarded it to the team!')
      setSuccess('Successfully created post and forwarded it to the team!')
      resetFormData()
      mutateSubmissions && mutateSubmissions()
      onCreatePost && onCreatePost(resp.data.submission)
    } else {
      toast.success('Successfully created post', {
        position: 'bottom-right',
      })
    }
    editorRef && editorRef.current?.commands.clearContent()

    if (meilisearchClient) {
      meilisearchClient.clearCache()
    }

    updateSubmissionData(resp)

    if (!widget && user) {
      userProfilePreviewMutate()
    }
  }

  const handleError = (err: AxiosError) => {
    if (
      err?.response?.data?.message ===
      'Anonymous submissions are not enabled for this organization!'
    ) {
      setAuthenitacteModal(true)
      toast.error('Please authenticate for the post to go through', {
        position: 'bottom-right',
      })
    } else {
      const errorMessage =
        err?.response?.data?.error || 'Something went wrong, please try again later'
      toast.error(errorMessage, {
        position: 'bottom-right',
      })
    }
  }

  const resetFormData = () => {
    setFormData({ title: '', content: '' })
    setCategory(org.postCategories[0])
    setCustomFieldsForCategory(org.postCategories[0])
    setTags([])
  }

  const updateSubmissionData = (resp: AxiosResponse) => {
    if (Array.isArray(rawSubmissionData) && mutateSubmissions) {
      mutateSubmissions(
        rawSubmissionData.map((entry, i) => ({
          ...entry,
          results: i === 0 ? [resp.data.submission, ...entry.results] : entry.results,
          totalResults: entry.totalResults + 1,
        })),
        false
      ).then(() => {
        if (setIsOpen && !createMore) setIsOpen(false)
        resetFormData()
      })
    } else {
      if (setIsOpen && !createMore) setIsOpen(false)
      resetFormData()

      // @ts-ignore
      if (mutateSubmissions && rawSubmissionData?.results) {
        mutateSubmissions({
          ...rawSubmissionData,
          // @ts-ignore
          results: [resp.data.submission, ...(rawSubmissionData?.results || [])],
        })
      }
    }
  }

  const {
    submission,
    mutateSingleSubmission,
    rawSubmissionData: rawSingleSubmissionData,
  } = useSingleSubmission(activeSubmissionId)

  const [mainPostView, setMainPostView] = useState(false)

  const sanitziedContent = sanitizeHTML(category?.prefill ? category?.prefill : '', false)

  const activeSubmission = submissionResults?.find(
    (submission: ISubmission) => submission.id === activeSubmissionId
  )

  const closePopup = () => {
    setMainPostView(false)
    setActiveSubmissionId('')
    restoreUrl()
  }

  const getInputSuggestedCategory = () => {
    const input = formData?.title + ' ' + formData?.content
    if (org?.postCategories?.length === 1) return
    if (hasUserChangedCategoryRef.current) return
    if (!input || input.length < 12) return
    setLoadingSuggestedCategory(true)

    getSubmissionSuggestedCategory(input)
      .then((res: any) => {
        if (res?.data?.category) {
          if (res.data.category === 'not enough examples') {
            hasUserChangedCategoryRef.current = true
            return
          }
          if (!hasUserChangedCategoryRef.current) {
            const suggestedCategory = org.postCategories.find(
              (c) =>
                c.id === res.data.category && (!c.disablePostCreation || isMember(user?.id, org)) // Updated condition
            )

            if (suggestedCategory?.disablePostCreation && !isMember(user?.id, org)) {
              return
            }

            if (suggestedCategory) {
              setCategory(suggestedCategory)
              setCustomFieldsForCategory(suggestedCategory)
            }
          }
        }
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoadingSuggestedCategory(false)
      })
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      getInputSuggestedCategory()
    }, 600)
    return () => clearTimeout(timeout)
  }, [formData?.title])

  useEffect(() => {
    const timeout = setTimeout(() => {
      getInputSuggestedCategory()
    }, 1300)
    return () => clearTimeout(timeout)
  }, [formData.content])

  const isMobile = width ? width < 420 : false

  return (
    <div ref={ref} className={` ${widget && 'w-full'}`}>
      {category?.defaultAuthorOnly && !category?.defaultCompanyOnly && !isMember(user?.id, org) && (
        <div className="border-b p-3 px-4 bg-gray-50 dark:bg-white/[2%] text-[13px] rounded-t-md">
          <p>
            {t('author-only-disclaimer', {
              displayName: org.displayName,
            })}
          </p>
        </div>
      )}
      {category?.defaultCompanyOnly && !isMember(user?.id, org) && (
        <div className="border-b p-3 px-4 bg-gray-50 dark:bg-white/[2%] text-[13px] rounded-t-md">
          <p>
            {t('company-only-disclaimer', {
              displayName: org.displayName,
            })}
          </p>
        </div>
      )}
      {!mainPostView && (
        <style>{`
          .ProseMirror p.is-editor-empty:first-child::after {
            margin-top: -24px !important;
            line-height: 1.5rem !important;
          }
          @media (max-width: 640px) {
            .ProseMirror p.is-editor-empty:first-child::after {
              margin-top: -24px !important;
              line-height: 1.5rem !important;
            }
          }
          `}</style>
      )}
      <MainPostViewPopup
        activeSubmissionId={activeSubmissionId}
        setShowPostView={() => {
          closePopup()
        }}
        showPostView={mainPostView}
        activeSubmission={activeSubmission}
        mutateSubmissions={mutateSubmissions}
        submission={submission}
        rawSubmissionData={rawSubmissionData}
        rawSingleSubmissionData={rawSingleSubmissionData}
        mutateSingleSubmission={mutateSingleSubmission}
      />{' '}
      <PublicBoardAuth
        isOpen={authenitcateModal}
        setIsOpen={setAuthenitacteModal}
        callback={(user) => {
          mutateCurrentOrg()
          if (user)
            setSelectedOptions((prev) => ({
              ...prev,
              user: {
                profilePicture: user?.profilePicture,
                _id: user?.id,
                name: user?.name || '',
                email: user?.email || '',
              },
            }))

          // Focus on title
          if (titleRef && titleRef.current) {
            setTimeout(() => {
              titleRef.current?.focus()
            }, 100)
          }
        }}
        widget={true}
      />
      <AddNewUserAuthorModal
        isOpen={createNewUser}
        setIsOpen={setCreateNewUser}
        onSubmit={(data) => {
          setSelectedOptions((prev) => ({
            ...prev,
            user: {
              email: data.email || '',
              id: undefined,
              name: data.name || '',
              profilePicture: undefined,
            },
          }))
        }}
      />
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center">
          {can(user?.id, 'post_vote_on_behalf', org) ? (
            <TooltipProvider>
              <Tooltip>
                <ModularComboBox
                  oncloseFocus={() => {
                    setTimeout(() => {
                      titleRef && titleRef.current?.focus()
                    }, 100)
                  }}
                  popoverContentProps={{
                    side: 'left',
                    align: 'start',
                  }}
                  TriggerButton={() =>
                    user?.id !== selectedOptions?.user?.id ? (
                      <TooltipTrigger asChild>
                        <button
                          tabIndex={-1}
                          className="flex -m-1.5 p-1.5 hover:bg-gray-100/40 dark:hover:bg-white/5 border-white/5 rounded-full items-center col-span-3 truncate"
                        >
                          <UserPicture authorId={''} img={selectedOptions.user?.profilePicture} />
                        </button>
                      </TooltipTrigger>
                    ) : (
                      <button
                        tabIndex={-1}
                        className={cn(
                          'flex -m-1.5 p-1.5 hover:bg-gray-100/40 dark:hover:bg-white/5 border-white/5 rounded-full items-center col-span-3 truncate'
                        )}
                      >
                        <UserPicture authorId={''} img={selectedOptions.user?.profilePicture} />
                      </button>
                    )
                  }
                  CommandItems={({ closeComboBox }) => {
                    return (
                      <CommandGroup
                        heading={
                          <CommandHeading
                            text="Create on behalf of user"
                            icon={<UserCircleIcon />}
                          />
                        }
                      >
                        <ActiveUserSearchResults
                          setNewAuthor={(user?: ICustomer) => {
                            closeComboBox()
                            if (user) {
                              //  Set user
                              setSelectedOptions((prev) => ({
                                ...prev,
                                user: {
                                  email: user.email || '',
                                  id: user.id,
                                  name: user.name || '',
                                  profilePicture: user.profilePicture || '',
                                },
                              }))
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
                <TooltipContent className="text-center">
                  Posting as <span className="font-medium">{selectedOptions?.user?.name}</span>
                  {selectedOptions?.user?.email && (
                    <span>
                      , they will receive email updates on your post to{' '}
                      <span className="font-medium">{selectedOptions?.user?.email}</span>
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div className="flex items-center col-span-3">
              <SimpleTooltip
                content={
                  user ? (
                    <>
                      Posting as <span className="font-medium">{user?.name}</span>, you'll receive
                      email status updates about your post
                    </>
                  ) : (
                    'Posting anonymously, we recommend authenticating to receive email status updates about your post'
                  )
                }
              >
                <button
                  onClick={() => {
                    if (!user) setAuthenitacteModal(true)
                  }}
                  tabIndex={-1}
                  className={cn(
                    'flex -m-1.5 p-1.5 hover:bg-gray-100/40 dark:hover:bg-white/5 border-white/5 rounded-full items-center col-span-3 truncate',
                    user && 'cursor-default focus:outline-none focus:ring-0'
                  )}
                >
                  <UserPicture authorId={''} img={user?.profilePicture} />
                </button>
              </SimpleTooltip>
            </div>
          )}
          <ChevronRightIcon className="w-4 h-4 mx-1.5 secondary-svg" />
          <CategoryCombobox
            popoverContentProps={{
              side: isMobile ? 'bottom' : 'left',
              align: 'start',
              alignOffset: -6,
            }}
            TriggerButton={() => (
              <button
                tabIndex={-1}
                className={cn(
                  'text-xs h-7 font-medium px-1.5 py-1 rounded-md flex items-center create-post-btn text-gray-500  dark:text-foreground',
                  !can(user?.id, 'set_post_category', org) &&
                    org?.postCategories?.length === 1 &&
                    'pointer-events-none'
                )}
              >
                {loadingSuggestedCategory && !hasUserChangedCategoryRef.current ? (
                  <div className="w-28 animate-pulse rounded-full bg-gray-100/80 dark:bg-gray-200/30 h-2.5 secondary-svg"></div>
                ) : (
                  <CategoryContentDisplayer category={category} />
                )}
              </button>
            )}
            callBack={(c: IPostCategory) => {
              setCategory(c)
              setCustomFieldsForCategory(c)
              hasUserChangedCategoryRef.current = true
              setLoadingSuggestedCategory(false)
            }}
            selectedCategory={category}
          />

          {/* <ChevronRightIcon className="w-4 h-4 mx-1.5 secondary-svg" />
          <h2 className="py-1 text-xs font-medium text-gray-500 rounded-md cursor-default dark:text-foreground">
            {t('create-post')}
          </h2> */}
        </div>
        {!widget && (
          <button
            onClick={() => {
              setIsOpen && setIsOpen(false)
              setDisablePopupClosing && setDisablePopupClosing(false)
            }}
            tabIndex={-1}
            className="p-1 bg-transparent shadow-none dark:bg-transparent hover:dark:bg-dark-accent hover:bg-gray-100"
          >
            <XIcon className="w-4.5 h-4.5 cursor-pointer secondary-svg main-transition" />
          </button>
        )}
      </div>
      {/* {showHiddenDisclaimer &&
        category &&
        org?.structure?.roadmap?.hiddenCategories?.includes(category?.category) && (
          <div className="p-3 mt-3 rounded-md bg-indigo-50 dark:bg-indigo-500/10">
            <div className="flex">
              <div className="flex-shrink-0">
                <InformationCircleIcon className="w-4 h-4 text-indigo-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-xs text-indigo-700 dark:font-medium dark:text-indigo-100">
                  {t(
                    'keep-in-mind-that-that-posts-made-under-this-category-are-not-visible-from-the-public-roadmap-dont-worry-the-team-will-still-receive-it'
                  )}
                </h3>
              </div>
            </div>
          </div>
        )} */}
      <div className="relative mt-1 z-[50] px-1">
        <input
          // WHen enter is pressed, do the same behavior as pressing TAB
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !(e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              e.stopPropagation()

              if (editorRef.current) {
                editorRef.current.commands.focus()
              }
            }
          }}
          id="create-post-title"
          ref={titleRef}
          value={formData.title}
          className="text-base font-medium bg-transparent border-0 dark:text-white sm:text-lg dark:bg-transparent focus-within:outline-none focus-within:ring-0 dark:focus-within:outline-none "
          onChange={(event) => {
            setFormData((prev) => ({ ...prev, title: event.target.value }))
            setErrors((prev) => ({ ...prev, title: false }))
          }}
          // autoFocus={true}
          placeholder={t('title-of-your-post')}
        />
      </div>
      {errors.title && (
        <div className="px-4">
          <InlineError error={t('title-must-be-longer-that-2-characters')} />
        </div>
      )}
      <div className="px-1 mb-1">
        <TextEditor
          className="p-3 py-1 !text-base sm:!leading-6  sm:!text-[15px] bg-transparent border-0 border-none dark:text-gray-100 ring-0 dark:bg-transparent dark:border-0 focus:ring-0 dark:focus:ring-0 focus-within:outline-none focus-within:ring-0 dark:focus-within:outline-none"
          editorRef={editorRef}
          formData={formData}
          activeCategory={category}
          setFormData={(content) => setFormData({ ...formData, content: content })}
          height={isMobile ? 140 : 80}
          placeholder={sanitziedContent || t('post-description')}
          widget={widget}
          compactMode={true}
        />
      </div>
      {/* <AnimatePresence initial={false}>
        {formData.title?.length > 5 && !loadingSuggestedCategory && ( */}
      {/* <motion.div
        initial={{ height: 0, overflow: 'hidden' }}
        animate={{ height: 'auto', overflow: 'auto' }}
        exit={{ height: 0, overflow: 'hidden' }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="mt-1 -mb-px max-h-60 custom-scrollbar-stronger"
      > */}
      {/* Check if object has any keys and values */}
      <PostCreationCustomFields
        selectedOptions={selectedOptions}
        setSelectedOptions={(value: any) => {
          setDisablePopupClosing && setDisablePopupClosing(true)
          hasUserChangedCategoryRef.current = true

          return setSelectedOptions(value)
        }}
        activeCategory={category}
        customInputFieldErrors={customInputFieldErrors}
        setCustomInputFieldErrors={setCustomInputFieldErrors}
      />
      {/* </motion.div> */}
      {/* )}
      </AnimatePresence> */}
      {org?.settings?.hasPublicTags && !can(user?.id, 'view_private_post_tags', org) && (
        <div className="px-4 pb-4 border-t dark:border-white/5">
          <p className="mt-3 text-sm font-medium text-gray-400 dark:text-foreground">{t('tag')}</p>
          {org && (
            <div className="flex flex-wrap mt-1.5 gap-2.5">
              {org.postTags.map((tag) => {
                const checked = selectedOptions.tags.some(
                  (findingTag) => findingTag.name === tag.name
                )
                return (
                  <button
                    onClick={() => {
                      if (checked) {
                        setSelectedOptions((prev) => ({
                          ...prev,
                          tags: prev.tags.filter((t) => t.name !== tag.name),
                        }))
                      } else {
                        setSelectedOptions((prev) => ({
                          ...prev,
                          tags: [...prev.tags, tag],
                        }))
                      }
                    }}
                    className={cn(
                      'text-[12px] font-medium py-1 px-2 create-post-btn',
                      category?.id !== tag.id ? '' : ''
                    )}
                    style={{
                      ...(checked && {
                        backgroundColor: tag.color ? getColor(tag.color) : org.color,
                        borderColor: tag.color ? getColor(tag.color) : org.color,
                        color: 'white',
                      }),
                    }}
                    key={tag.id}
                  >
                    {tag.private && (
                      <LockClosedIcon
                        className={`h-4 w-4 ${checked ? 'text-blue-100' : 'secondary-svg'}  mr-1`}
                      />
                    )}
                    {tag.name}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
      <div className="flex items-center justify-between gap-5 px-4 py-4 ml-auto border-t dark:border-white/5">
        {isMember(user?.id, org) && (
          <CreatePostOptions
            setSelectedOptions={setSelectedOptions}
            selectedOptions={selectedOptions}
          />
        )}

        <div className="flex items-center flex-shrink-0 gap-5 ml-auto">
          <div className=" items-center text-xs gap-2.5 hidden sm:flex">
            <Switch
              checked={createMore}
              onCheckedChange={() => setCreateMore((p) => !p)}
              id="create-more"
              tabIndex={-1}
              small={true}
            />
            <label
              htmlFor="create-more"
              className="select-none text-background-accent/80 dark:text-foreground/90"
            >
              {t('create-more')}
            </label>
          </div>

          <Button
            className="px-3 text-xs"
            onClick={() => {
              hasUserChangedCategoryRef.current = true
              !loading && createPost()
            }}
          >
            {loading ? (
              <div className="w-4 h-4 mr-1">
                <Loader />
              </div>
            ) : null}
            {t('submit-post')}
          </Button>
        </div>
      </div>
      <div>
        <CreatePostSimilarSuggestion
          setActiveSubmissionId={(value) => {
            setActiveSubmissionId(value)
            setMainPostView(true)
          }}
          title={formData.title}
          content={formData.content}
        />
      </div>
    </div>
  )
}

export default CreatePost
