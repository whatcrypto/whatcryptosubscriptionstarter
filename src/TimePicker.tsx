import React from 'react'
import { ClockIcon } from '@heroicons/react/solid'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './radix/DropdownMenu'
import { Button } from './radix/Button'
import { format } from 'date-fns'

const TimePicker: React.FC<{
  startDate: Date | undefined
  setStartDate: (date: Date) => void
}> = ({ startDate, setStartDate }) => {
  const now = new Date()
  const isToday = startDate ? startDate.toDateString() === now.toDateString() : false

  const elements: JSX.Element[] = Array.from({ length: 24 * 2 }, (_, i) => i)
    .filter((time) => {
      // If the startDate is not today, we don't need to filter out times
      if (!isToday) return true

      // Convert index to hours and minutes
      const hours = Math.floor(time / 2)
      const minutes = (time % 2) * 30

      // Create a time slot for today with the given hours and minutes
      const timeSlot = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)

      // Filter out times that are in the past for today
      return timeSlot >= now
    })
    .map((time: number) => {
      let hour = time / 2 < 10 ? `0${Math.floor(time / 2)}` : `${Math.floor(time / 2)}`
      let minute = time % 2 === 0 ? '00' : '30'

      return (
        <DropdownMenuItem
          onClick={() => {
            if (startDate) {
              setStartDate(new Date(startDate.setHours(parseInt(hour), parseInt(minute), 0, 0)))
            } else {
              setStartDate(new Date(new Date().setHours(parseInt(hour), parseInt(minute), 0, 0)))
            }
          }}
          // If the hour and minute is the same as the current date, then set the class to active - Keep in mind that the hour can be 0, so we need to make it include 0 before
          className={`dropdown-item ${
            startDate &&
            startDate.getHours() === parseInt(hour, 10) &&
            startDate.getMinutes() === parseInt(minute, 10)
              ? `dark:bg-indigo-500 bg-indigo-500 dark:hover:bg-indigo-600 hover:bg-indigo-600 text-white dark:text-white`
              : ''
          }`}
          key={`${hour}:${minute}`}
        >{`${hour}:${minute}`}</DropdownMenuItem>
      )
    })

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant={'outline'} size={'sm'}>
          <ClockIcon className="mr-1.5 h-4 w-4 secondary-svg" />
          {startDate ? format(startDate, 'HH:mm') : 'Select time'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-96 overflow-auto custom-scrollbar-stronger">
        {elements}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TimePicker
