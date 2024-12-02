import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import PopupWrapper from './PopupWrapper'
import { toast } from 'sonner'
import { ISubmissionSavedFilter } from '@/interfaces/IOrganization'
import { useUser } from '@/data/user'
import Loader from './Loader'

const schema = z.object({
  viewName: z.string().min(1, 'View name is required'),
  description: z.string().optional(),
  isPrivate: z.boolean(),
})

const CreateFilterModal: React.FC<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  handleCreationAndUpdate: (data: {
    title: string
    description: string
    isPrivate: boolean
    filter: string
  }) => Promise<void>
  activeViewData?: ISubmissionSavedFilter
}> = ({ open, setOpen, handleCreationAndUpdate, activeViewData }) => {
  const [viewName, setViewName] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [loading, setLoading] = useState(false)

  const { user } = useUser()

  useEffect(() => {
    if (activeViewData && open) {
      setViewName(activeViewData.title)
      setDescription(activeViewData.description || '')
      setIsPrivate(activeViewData.isPrivate)
    } else {
      setViewName('')
      setDescription('')
      setIsPrivate(false)
    }
  }, [activeViewData, open])

  const handleSubmit = () => {
    const inputData = { viewName, description, isPrivate }
    const validationResult = schema.safeParse(inputData)

    if (validationResult.success === false && validationResult.error) {
      validationResult.error.errors.forEach((error) => {
        toast.error(error.message)
      })
      return
    }

    // If validation passes, you can further handle the logic, like sending the data to the server.
    setLoading(true)
    handleCreationAndUpdate({
      title: viewName,
      description: description,
      isPrivate: isPrivate,
      filter: '',
    })
      .catch((err) => {
        setLoading(false)
      })
      .then(() => {
        setLoading(false)
      })
  }

  return (
    <PopupWrapper isOpen={open} setIsOpen={setOpen}>
      <h2 className="text-lg font-medium text-gray-600 dark:text-white">
        Create a View to save filters
      </h2>
      <p className="mt-1 mb-2 text-sm text-gray-400 dark:text-foreground">
        Create a custom view to show only the posts you want to see.
      </p>

      <label htmlFor="viewName" className="text-sm text-gray-400 dark:text-gray-100">
        Name
      </label>
      <input
        value={viewName}
        onChange={(e) => setViewName(e.target.value)}
        className="mt-1"
        id="viewName"
        type="text"
        placeholder="Ideas from this week"
      />

      <div className=" mt-3">
        <label htmlFor="description" className="text-sm text-gray-400 dark:text-gray-100">
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full p-2"
          id="description"
          placeholder="Top ideas from this week."
        />
      </div>

      {activeViewData && activeViewData?.createdBy !== user?.id ? null : (
        <div className="relative flex items-start mt-3">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="isPrivate" className="font-medium text-gray-400 dark:text-white">
              Make this view private
            </label>
            <p id="comments-description" className="text-gray-400 dark:text-foreground">
              Only you will be able to see this view.
            </p>
          </div>
        </div>
      )}

      <button className="mt-4 ml-auto flex items-center dashboard-primary" onClick={handleSubmit}>
        {loading && (
          <div className="w-4 h-4 mr-1.5">
            <Loader />
          </div>
        )}
        {activeViewData ? 'Save view' : 'Create view'}
      </button>
    </PopupWrapper>
  )
}

export default CreateFilterModal
