import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import PopupWrapper from './PopupWrapper'
import { toast } from 'sonner'
import isEmail from 'validator/lib/isEmail'

const AddNewUserAuthorModal: React.FC<{
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  onSubmit: (data: { name?: string; email?: string }) => void
  initialName?: string
  makeNameOptional?: boolean
  makeEmailOptional?: boolean
}> = ({ isOpen, setIsOpen, onSubmit, initialName, makeNameOptional, makeEmailOptional }) => {
  const userSchema = makeEmailOptional
    ? z
        .object({
          name: z.string().optional(), // Allow name to be optional
          email: z.string().optional(), // Allow email to be optional and can be an empty string
        })
        .refine(
          (data) => data.name || (data.email && data.email.length > 0 && isEmail(data.email)),
          {
            message: 'Either name or email is required',
          }
        )
    : z.object({
        // Refine for a more beautiful minimum 3 characters error message
        name: z.string().refine((data) => data.length > 2, {
          message: 'Name is required',
        }),
        email: z.string().email('Invalid email format'), // Allow email to be optional and can be an empty string
      })

  const [formData, setFormData] = useState({ name: '', email: '' })
  const [errors, setErrors] = useState<string | null>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrors(null)
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  useEffect(() => {
    if (isOpen && initialName && formData.name === '')
      setFormData({ ...formData, name: initialName })
  }, [initialName, isOpen])

  const handleSubmit = () => {
    try {
      const result = userSchema.parse(formData)
      onSubmit(result)
      toast.success('User added successfully')
      setIsOpen(false)
      setFormData({ name: '', email: '' })
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.errors.map((e) => e.message).join(', '))
        toast.error('Error adding user')
      }
    }
  }

  return (
    <PopupWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
      <h2 className="text-lg font-medium text-gray-600 mb-1.5 dark:text-white">Add new user</h2>

      <label htmlFor="author-email" className="text-sm text-gray-600 dark:text-foreground">
        Email {makeEmailOptional ? '(optional)' : ''}
      </label>
      <input
        value={formData.email}
        onChange={handleChange}
        className="mt-1 mb-2"
        id="author-email"
        name="email"
        type="email"
        placeholder={makeNameOptional ? 'Enter upvoter email' : 'Enter author email'}
        autoComplete="off"
      />

      <label htmlFor="author-name" className="text-sm text-gray-600 dark:text-foreground">
        Name {makeEmailOptional ? '(optional)' : ''}
      </label>
      <input
        value={formData.name}
        onChange={handleChange}
        className="mt-1 mb-2"
        id="author-name"
        name="name"
        type="text"
        placeholder={makeNameOptional ? 'Enter upvoter name' : 'Enter author name'}
        autoComplete="off"
      />
      {errors && <p className="text-red-500 mt-2 dark:text-red-300 text-sm">{errors}</p>}

      <button onClick={handleSubmit} className="ml-auto mt-4 dashboard-primary">
        Add User
      </button>
    </PopupWrapper>
  )
}

export default AddNewUserAuthorModal
