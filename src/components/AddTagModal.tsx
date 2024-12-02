import React, { useState } from 'react'
import InlineError from './InlineError'
import PopupWrapper from './PopupWrapper'
import CustomColorSwatch from './CustomColorSwatch'
import PRO from './PRO'
import CreateTrialButton from './CreateTrialButton'
import { useCurrentOrganization } from '../data/organization'
import { can } from '@/lib/acl'
import { useUser } from '@/data/user'
import { isPlan } from '@/lib/utils'

export const tagColorData = [
  {
    name: 'Red',
    color: 'bg-red-400',
    hex: '#f87171',
  },
  {
    name: 'Orange',
    color: 'bg-orange-400',
    hex: '#fb923c',
  },
  {
    name: 'Yellow',
    color: 'bg-yellow-400',
    hex: '#fbbf24',
  },
  {
    name: 'Green',
    color: 'bg-green-400',
    hex: '#4ade80',
  },
  {
    name: 'Sky',
    color: 'bg-sky-400',
    hex: '#38bdf8',
  },
  {
    name: 'Teal',
    color: 'bg-teal-400',
    hex: '#2dd4bf',
  },
  {
    name: 'Blue',
    color: 'bg-blue-400',
    hex: '#60a5fa',
  },
  {
    name: 'Indigo',
    color: 'bg-indigo-400',
    hex: '#818cf8',
  },
  {
    name: 'Purple',
    color: 'bg-purple-400',
    hex: '#c084fc',
  },
  {
    name: 'Pink',
    color: 'bg-pink-400',
    hex: '#f472b6',
  },
  {
    name: 'Gray',
    color: 'bg-gray-400',
    hex: '#4F587A',
  },
]

const AddTagModal: React.FC<{ open: boolean; setOpen: Function; callBack: Function }> = ({
  open,
  setOpen,
  callBack,
}) => {
  const [tag, setTag] = useState('')
  const [errors, setErrors] = useState(false)
  const { user } = useUser()
  const [isPrivate, setPrivate] = useState(false)
  const [color, setColor] = useState('')
  const { org } = useCurrentOrganization()
  const addTag = () => {
    if (tag === '') {
      setErrors(true)
    } else {
      const newTag = {
        id: 'new', // Generate unique ID
        name: tag,
        private: isPrivate, // Default value
        color: color, // Color value (can be empty)
      }
      callBack(newTag)
      setTag('')
      setColor('')
      setOpen(false)
    }
  }

  return (
    <PopupWrapper isOpen={open} setIsOpen={setOpen}>
      <h2 className="text-lg font-medium text-gray-600 dark:text-white">Add Tag</h2>
      <p className="mt-1 mb-2 text-sm text-gray-400 dark:text-foreground">
        Enter a name for your new tag.
      </p>
      <label htmlFor="tag" className="text-sm text-gray-400 dark:text-gray-100">
        Name
      </label>
      <input
        value={tag}
        onChange={(event) => {
          errors && setErrors(false)
          setTag(event.target.value)
        }}
        className="mt-1"
        id="tag"
        type="text"
        placeholder="High priority"
      />
      {errors && <InlineError error="Please enter a tag." />}

      <CustomColorSwatch active={color} setActive={setColor} />
      {/* Display available color options (can be omitted) */}

      {!isPlan(org.plan, 'growth') ? (
        <div className="rounded-md up-element mt-4">
          <div className="relative flex-col flex items-start px-4 py-3 w-full">
            <div className="text-sm">
              <label className="font-semibold text-gray-700 dark:text-white">
                Private tag <PRO plan="growth" />
              </label>
              <p id="comments-description" className="mt-1 text-gray-400 dark:text-indigo-100">
                Only the organization owner and managers can see private tags.
              </p>
            </div>
            <div className="ml-auto mt-2">
              <CreateTrialButton plan="growth" />
            </div>
          </div>
        </div>
      ) : can(user?.id, 'view_private_post_tags', org) ? (
        <div className="relative flex items-start mt-4">
          <div className="flex items-center h-5">
            <input
              id="comments"
              aria-describedby="comments-description"
              name="comments"
              type="checkbox"
              checked={isPrivate}
              onChange={() => setPrivate((p) => !p)}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="comments" className="font-medium text-gray-400 dark:text-white">
              Private tag (optional)
            </label>
            <p id="comments-description" className="text-gray-400 dark:text-foreground">
              Only the organization owner and managers can see private tags.
            </p>
          </div>
        </div>
      ) : null}

      <button onClick={addTag} className="mt-4 ml-auto dashboard-primary">
        Add Tag
      </button>
    </PopupWrapper>
  )
}

export default AddTagModal
