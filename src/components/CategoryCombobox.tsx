import { EyeIcon, LockClosedIcon } from '@heroicons/react/solid'
import React, { useState } from 'react'
import { useCurrentOrganization } from '../data/organization'
import { IPostCategory, IPostCategoryWithoutId } from '../interfaces/ISubmission'
import { createCategoryCallback } from '@/lib/category'
import ModularComboBox from './radix/ModularComboBox'
import { CommandGroup, CommandItem } from './radix/Command'
import { useUser } from '@/data/user'
import { can, isMember } from '@/lib/acl'

const CategoryCombobox: React.FC<{
  TriggerButton: () => JSX.Element
  callBack: (c: IPostCategory) => void
  selectedCategory: IPostCategory | undefined
  popoverContentProps?: any
}> = ({ TriggerButton, callBack, selectedCategory, popoverContentProps }) => {
  const { org, mutateCurrentOrg } = useCurrentOrganization()
  const [newCategoryData, setNewCategoryData] = useState<IPostCategoryWithoutId>({
    category: '',
    private: false,
  })

  const { user } = useUser()
  const orgCategories = org.plan !== 'free' ? org.postCategories : [org.postCategories[0]]

  const CategoryCommandItem = ({
    category,
    closeComboBox,
  }: {
    category: IPostCategory
    closeComboBox: () => void
  }) => {
    return (
      <CommandItem
        value={category.category}
        key={category.id}
        onSelect={() => {
          closeComboBox()
          callBack(category)
        }}
      >
        {category.category}
      </CommandItem>
    )
  }

  return (
    <ModularComboBox
      setNewItemName={(name) => {
        setNewCategoryData((prev) => ({ ...prev, category: name }))
      }}
      popoverContentProps={popoverContentProps}
      TriggerButton={TriggerButton}
      CommandItems={({ closeComboBox }) => {
        const notSelectedCategories = orgCategories.filter(
          (cat) =>
            selectedCategory?.category !== cat?.category &&
            (isMember(user?.id, org) || !cat.disablePostCreation)
        )
        return (
          <>
            {notSelectedCategories.some((cat) => !cat.private) && (
              <CommandGroup
                heading={
                  can(user?.id, 'view_posts_private', org) ? (
                    <div className="flex items-center justify-between dark:bg-border/60 -mx-1 -mb-0.5 px-1.5 -mt-2.5 py-0.5 uppercase border-b border-black/5 dark:border-border shadow-sm tracking-wide">
                      Public Boards
                      <EyeIcon className="w-3 h-3 secondary-svg" />
                    </div>
                  ) : undefined
                }
              >
                {notSelectedCategories
                  .filter(
                    (cat) =>
                      !cat.private &&
                      (cat.disablePostCreation
                        ? can(user?.id, 'view_posts_private', org)
                          ? true
                          : false
                        : true)
                  )
                  .map((category, index) => {
                    return (
                      <CategoryCommandItem
                        category={category}
                        closeComboBox={closeComboBox}
                        key={category.id}
                      />
                    )
                  })}
              </CommandGroup>
            )}
            {notSelectedCategories.some((cat) => cat.private) && (
              <CommandGroup
                heading={
                  <div className="flex items-center justify-between dark:bg-border/60 -mx-1 -mb-0.5 px-1.5 -mt-2.5 py-0.5 uppercase border-b border-black/5 dark:border-border shadow-sm tracking-wide">
                    Private Boards
                    <LockClosedIcon className="w-3 h-3 secondary-svg" />
                  </div>
                }
              >
                {notSelectedCategories
                  .filter((cat) => cat.private)
                  .map((category, index) => {
                    return (
                      <CategoryCommandItem
                        category={category}
                        closeComboBox={closeComboBox}
                        key={category.id}
                      />
                    )
                  })}
              </CommandGroup>
            )}
          </>
        )
      }}
      allowNewCreation={can(user?.id, 'manage_boards', org) ? true : false}
      firstNewStep={'privacy'}
      searchableDisplayName="board"
      CustomPage={({ closeComboBox, setPages, activePage }) => {
        if (activePage === 'privacy') {
          return (
            <CommandGroup>
              {['Create a Public board', 'Create a Private board'].map((item, index) => {
                return (
                  <CommandItem
                    onSelect={() => {
                      setPages([])
                      createCategoryCallback(
                        {
                          category: newCategoryData.category,
                          private: index === 1 ? true : false,
                        },
                        org,
                        mutateCurrentOrg,
                        closeComboBox
                      ).then((resp: any) => {
                        if (resp) {
                          const c = resp?.category
                          mutateCurrentOrg(
                            { ...org, postCategories: [...org.postCategories, c] },
                            false
                          )
                          callBack(c)
                        }
                      })
                    }}
                    value={item}
                    key={item}
                  >
                    {item}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          )
        }
        return null
      }}
    />
  )
}

export default CategoryCombobox
