import React, { useEffect, useState } from 'react'
import InlineError from './InlineError'
import PopupWrapper from './PopupWrapper'
import CustomColorSwatch from './CustomColorSwatch'
import { IOrganizationStatus } from '../interfaces/IOrganization'

export const statusBulletColorData = [
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
]

const AddStatus: React.FC<{
  open: boolean
  setOpen: Function
  callBack: Function
  type: IOrganizationStatus['type']
}> = ({ open, setOpen, callBack, type }) => {
  const [status, setStatus] = useState('')
  const [errors, setErrors] = useState({ name: false, color: false })
  const [color, setColor] = useState('')

  const addStatus = () => {
    if (status === '' || color === '') {
      setErrors({ name: status === '', color: color === '' })
    } else {
      const newStatus = {
        name: status,
        color: color, // Color value (can be empty)
        type, // Default value
        isDefault: false, // Default value
      }
      setErrors({ name: false, color: false })
      callBack(newStatus)
      setStatus('')
      setColor('')
      setOpen(false)
    }
  }

  useEffect(() => {
    setErrors({ ...errors, color: false })
  }, [color])

  return (
    <PopupWrapper isOpen={open} setIsOpen={setOpen}>
      <h2 className="text-lg font-medium text-gray-600 dark:text-white">Add Status</h2>
      <p className="mt-1 mb-2 text-sm text-gray-400 dark:text-foreground">
        Enter a name for your new status.
      </p>
      <label htmlFor="tag" className="text-sm text-gray-400 dark:text-gray-100">
        Name
      </label>
      <input
        value={status}
        onChange={(event) => {
          errors && setErrors({ ...errors, name: false })
          setStatus(event.target.value)
        }}
        className="mt-1"
        id="status"
        type="text"
        placeholder="Next Release"
      />
      {errors.name && <InlineError error="Please enter a status name." />}
      <CustomColorSwatch active={color} setActive={setColor} />
      {errors.color && <InlineError error="Please select a color." />}

      <button onClick={addStatus} className="mt-4 ml-auto dashboard-primary">
        Add Status
      </button>
    </PopupWrapper>
  )
}

export default AddStatus
