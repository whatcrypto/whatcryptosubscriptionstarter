import { CheckIcon, PlusCircleIcon, SelectorIcon } from '@heroicons/react/solid'
import React, { useEffect, useState } from 'react'
import { addUserRole } from '../../network/lib/submission'
import { useCurrentOrganization } from '../data/organization'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './radix/DropdownMenu'
import { toast } from 'sonner'

const RoleChanger: React.FC<{
  activeUser: any
  getRoleNameFromId: any
  mutateTrackedUserActivity: any
  mutateTrackedUsers: any
}> = ({ activeUser, getRoleNameFromId, mutateTrackedUserActivity, mutateTrackedUsers }) => {
  const [activeRoles, setActiveRoles] = useState<string[]>([])
  const { org } = useCurrentOrganization()

  useEffect(() => {
    setActiveRoles(activeUser?.roleIds || [])
  }, [activeUser])

  const handleRoleChange = (roleId: string) => {
    const newRoles = activeRoles?.includes(roleId)
      ? activeRoles.filter((role) => role !== roleId)
      : [...activeRoles, roleId]
    setActiveRoles(newRoles)
    addUserRole({
      email: activeUser.email,
      roles: newRoles,
    })
      .then((res) => {
        mutateTrackedUserActivity()
        mutateTrackedUsers()
      })
      .catch((err) => {
        toast.error('Failed to update role.')
      })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative truncate w-40 py-0 pl-1 pr-10 text-left border rounded-md shadow-none white-btn dark:border-dark-accent dark:bg-border hover:dark:bg-dark-accent sm:text-sm">
        <span
          className={` font-medium truncate text-gray-500 dark:text-foreground flex items-center`}
        >
          {activeRoles?.length > 0 ? (
            <span className="mr-1.5 truncate pl-2 py-1">
              {activeRoles?.length > 1 ? (
                <span className="rounded-md dark:bg-dark-accent bg-gray-100/60 -mt-0.5 -ml-2 mr-1.5 p-1 text-xs ">
                  +{activeRoles.length - 1}
                </span>
              ) : null}
              {getRoleNameFromId(activeRoles[0])}{' '}
            </span>
          ) : (
            <span className="py-1 pl-2 opacity-50 truncate">Unassigned</span>
          )}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <SelectorIcon
            className="w-5 h-5 text-background-accent/60 dark:text-background-accent"
            aria-hidden="true"
          />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <>
          {org?.roles.map((role) => (
            <DropdownMenuItem
              key={role.id}
              className={
                'dropdown-item font-medium dark:hover:bg-dark-accent/80 flex items-center cursor-pointer'
              }
              onSelect={(e) => {
                e.preventDefault()
                handleRoleChange(role.id)
              }}
            >
              {activeRoles?.includes(role.id) && (
                <CheckIcon className="w-4 h-4 mr-2 text-background-accent/80 dark:text-background-accent" />
              )}
              {role.role}
            </DropdownMenuItem>
          ))}

          <DropdownMenuItem
            onSelect={() => {
              window.open('/dashboard/settings/roles')
            }}
          >
            <PlusCircleIcon className="mr-1.5 secondary-svg" />
            Create new role
          </DropdownMenuItem>
        </>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default RoleChanger
