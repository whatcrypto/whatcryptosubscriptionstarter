import { CheckIcon, EyeIcon, LockClosedIcon } from '@heroicons/react/solid'
import { useTranslation } from 'next-i18next'
import React, { useRef, useState } from 'react'
import { KeyedMutator } from 'swr'
import { updateSubmissionInfo } from '../../network/lib/submission'
import { useCurrentOrganization } from '../data/organization'
import { useUser } from '../data/user'
import { ISubmission, ISubmissionPaginate } from '../interfaces/ISubmission'
import Tooltip from './Tooltip'
import { createTag } from '../../network/lib/organization'
import { toast } from 'sonner'
import { Tag } from './NewEditModal'
import TagBullet, { getColor } from './TagBullet'
import { cn } from '@/lib/utils'
import ModularComboBox from './radix/ModularComboBox'
import { CommandGroup, CommandHeading, CommandItem } from './radix/Command'
import { tagColorData } from './AddTagModal'
import MultiselectButton from './MultiselectButton'
import { can } from '@/lib/acl'

const TagComponent: React.FC<{
  tags: ISubmission['postTags']
  small?: boolean
  postId?: string
  truncate?: boolean
  mutateSubmissions?: KeyedMutator<any[]>
  widget?: boolean
  dash?: boolean
  rawSubmissionData?: ISubmissionPaginate[] | ISubmissionPaginate
  xSmall?: boolean
  postCreation?: boolean
  postCreationTagCallback?: (tags: ISubmission['postTags']) => void
  customTriggerButton?: () => JSX.Element
  popoverContentProps?: any
}> = ({
  tags,
  small = false,
  postId,
  truncate,
  mutateSubmissions,
  widget = false,
  dash,
  rawSubmissionData,
  xSmall,
  postCreation,
  postCreationTagCallback,
  customTriggerButton,
  popoverContentProps,
}) => {
  const { org, mutateCurrentOrg } = useCurrentOrganization()
  const { user } = useUser()
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const inputElement = useRef<HTMLInputElement>(null)
  const [newTagData, setNewTagData] = useState<ISubmission['postTags'][0]>({
    name: '',
    color: '',
    private: false,
    id: '',
  })

  const createTagCallback = (tag: Tag) => {
    if (tag?.name?.length >= 3 && !org?.postTags.find((tags) => tags.name === tag.name)) {
      // Add new tag here
      createTag(tag)
        .then((res) => {
          toast.success('Tag created')
          setSearch('')
          mutateCurrentOrg({ ...org, postTags: [...org.postTags, res.data.tag] }, false)

          // const newData = tags.includes(name) ? tags.filter((item) => item !== name) : [...tags, name]
          const newData = tags?.some((item) => item.id === tag.id) ? tags : [...tags, res.data.tag]
          changeTag(newData)
        })
        .catch((err) => toast.error(err.response?.data.message))
    } else {
      if (org?.postTags.find((tags) => tags.name === tag.name)) {
        toast.error('Tag with this name already exists')
      } else {
        toast.error('Name must be more than 2 characters')
      }
    }
  }

  const changeTag = (newTags: Tag[]) => {
    if (postCreation) {
      postCreationTagCallback && postCreationTagCallback(newTags)
      return
    }
    const generateNewSubmissionDataForTag = (oldResults: ISubmission[]) => {
      return oldResults.map((sub) => {
        if (sub.id === postId) {
          return {
            ...sub,
            postTags: newTags,
          }
        }
        return sub
      })
    }

    if (!postId) return
    updateSubmissionInfo({ submissionId: postId, postTags: newTags })
      .then((resp) => {
        !(mutateSubmissions && rawSubmissionData) && mutateSubmissions && mutateSubmissions()
      })
      .catch(() => {
        toast.error('Failed to update tags.')
      })

    if (mutateSubmissions && rawSubmissionData) {
      if (!Array.isArray(rawSubmissionData)) {
        // Mutate data for single submission
        mutateSubmissions(
          {
            ...rawSubmissionData,
            // @ts-ignore
            results: generateNewSubmissionDataForTag(rawSubmissionData?.results),
          },
          false
        )
      } else if (Array.isArray(rawSubmissionData)) {
        mutateSubmissions(
          rawSubmissionData.map((entry) => ({
            ...entry,
            results: generateNewSubmissionDataForTag(entry.results),
          })),
          false
        )
      }
    } else {
    }
  }

  const copyOfTags = [...org.postTags]

  const reorderedTags = copyOfTags
    .filter((tag) => tag.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (tags.some((tag) => tag.name === a.name) && !tags.some((tag) => tag.name === b.name)) {
        return -1
      } else if (
        !tags.some((tag) => tag.name === a.name) &&
        tags.some((tag) => tag.name === b.name)
      ) {
        return 1
      } else {
        return 0
      }
    })

  const TagCommandItem = ({
    tag,
    closeComboBox,
  }: {
    tag: ISubmission['postTags'][0]
    closeComboBox: () => void
  }) => {
    return (
      <CommandItem
        value={tag.name}
        key={tag.id}
        onSelect={() => {
          const newData = tags.some((tempTag) => tempTag.id === tag.id)
            ? tags.filter((item) => item.name !== tag.name)
            : [...tags, tag]
          changeTag(newData)
          // closeComboBox()
        }}
      >
        {tags.some((tempTag) => tempTag.name === tag.name) ? (
          <CheckIcon
            style={{ fill: getColor(tag.color) }}
            className={`h-4 w-4 flex-shrink-0 mr-1`}
          />
        ) : (
          <div className="ml-1 flex-shrink-0 mr-0.5">
            <TagBullet theme={tag?.color} />
          </div>
        )}
        {tag.name}
      </CommandItem>
    )
  }

  const ExtraTagList = () => {
    return (
      <span className="hidden sm:inline-block">
        <Tooltip
          dontTruncate={true}
          dropDown={
            <div className="z-10 space-y-2">
              {tags.map((tag, index) => {
                if (index === 0) return null
                return (
                  <div
                    key={tag.id}
                    className={`w-36 text-xs font-medium flex items-center px-0.5  text-gray-500 dark:text-foreground`}
                  >
                    <TagBullet theme={tag?.color} />
                    <span className="truncate">{tag.name}</span>
                  </div>
                )
              })}
            </div>
          }
          child={
            <span
              className={cn(
                'p-1.5 pl-2 ml-1.5 -my-2.5 -mr-1.5 text-[10px] dark:text-foreground relative border-l dark:border-border/70',
                xSmall && '-my-1.5'
              )}
            >
              +{tags.length > 1 ? tags.length - 1 : tags.length}
            </span>
          }
        />
      </span>
    )
  }

  if ((postId && can(user?.id, 'set_post_tags', org)) || postCreation) {
    return (
      <>
        <ModularComboBox
          setNewItemName={(name) => {
            setNewTagData((prev) => ({ ...prev, name }))
          }}
          popoverContentProps={popoverContentProps}
          TriggerButton={
            customTriggerButton
              ? customTriggerButton
              : () => (
                  <MultiselectButton
                    customBadge={
                      tags?.length > 1 &&
                      dash && (
                        <span className="text-xs dark:text-foreground text-background-accent/60">
                          (+ {tags.length > 1 ? tags.length - 1 : tags.length})
                        </span>
                      )
                    }
                    icon={<TagBullet theme={tags[0]?.color} />}
                    compact={dash}
                  >
                    {tags?.length > 0 && <>{tags[0]?.name}</>}
                  </MultiselectButton>
                )
          }
          CommandItems={({ setPages, setOnlyDisplayCustomPage, closeComboBox }) => {
            return (
              <>
                {org?.postTags?.some((tag) => !tag.private) && (
                  <CommandGroup heading={<CommandHeading text="Public tags" icon={<EyeIcon />} />}>
                    {reorderedTags
                      ?.filter((tag) => !tag.private)
                      .map((tag) => {
                        return (
                          <TagCommandItem key={tag.id} closeComboBox={closeComboBox} tag={tag} />
                        )
                      })}
                  </CommandGroup>
                )}
                {org?.postTags?.some((tag) => tag.private) && (
                  <CommandGroup
                    heading={<CommandHeading text="Private tags" icon={<LockClosedIcon />} />}
                  >
                    {reorderedTags
                      ?.filter((tag) => tag.private)
                      .map((tag) => {
                        return (
                          <TagCommandItem key={tag.id} closeComboBox={closeComboBox} tag={tag} />
                        )
                      })}
                  </CommandGroup>
                )}
              </>
            )
          }}
          allowNewCreation={true}
          firstNewStep={'Color'}
          searchableDisplayName="tag"
          CustomPage={({ closeComboBox, setPages, activePage }) => {
            if (activePage === 'Color') {
              return (
                <CommandGroup className="pb-1">
                  {tagColorData.map((color) => (
                    <CommandItem
                      value={color.name}
                      key={color.name}
                      onSelect={() => {
                        setNewTagData((prev) => ({
                          ...prev,
                          color: color.name,
                        }))
                        setPages((prev) => [...prev, 'Type'])
                      }}
                    >
                      <TagBullet theme={color?.name} />
                      {color.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            } else if (activePage === 'Type') {
              return (
                <CommandGroup>
                  {['Create a Private tag', 'Create a Public tag'].map((value, index) => (
                    <CommandItem
                      value={value}
                      key={value}
                      onSelect={() => {
                        createTagCallback({
                          color: newTagData.color,
                          id: '',
                          name: newTagData.name,
                          private: index === 0 ? true : false,
                        })
                        setPages([])

                        closeComboBox()
                      }}
                    >
                      <span className="first-letter:capitalize">{value}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            }
            return null
          }}
        />
      </>
    )
  } else {
    return (
      <div className={`flex flex-wrap gap-4 gap-y-2 items-center truncate`}>
        <span
          className={`px-2  ${
            xSmall ? 'py-0.5' : 'py-1'
          } public-category flex items-center text-gray-400 dark:text-foreground ${
            small ? 'text-xs' : 'text-sm'
          } truncate font-medium max-w-[260px] border-gray-100/50 bg-gray-50/50 dark:bg-secondary dark:border-border/70 dark:shadow-sm rounded-md border `}
        >
          <div>
            <TagBullet theme={tags[0]?.color} />
          </div>
          <p className={`truncate text-xs`}>{tags[0].name}</p>{' '}
          {tags?.length > 1 && <ExtraTagList />}
        </span>
      </div>
    )
  }
}

export default TagComponent
