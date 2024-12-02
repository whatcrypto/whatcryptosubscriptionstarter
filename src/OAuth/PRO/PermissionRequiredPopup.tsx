import React from 'react'
import { useCurrentOrganization } from '../data/organization'
import PopupWrapper from './PopupWrapper'
import { IMemberRolePermissions } from '@/interfaces/IOrganization'

const permissionToText = (permission: keyof IMemberRolePermissions) => {
  switch (permission) {
    case 'view_comments_private':
      return 'view private comments'
    case 'manage_comments':
      return 'manage comments'
    case 'manage_comments_private':
      return 'manage private comments'

    case 'set_comment_pinned':
      return 'pin comments'
    case 'moderate_comments':
      return 'moderate comments' // Update, delete, pin, unpin others comments

    case 'set_post_category':
      return 'set post category'
    case 'set_post_pinned':
      return 'pin posts'
    case 'set_post_eta':
      return 'set post ETA'
    case 'set_post_tags':
      return 'set post tags'
    case 'set_post_author':
      return 'set post author'
    case 'set_post_status':
      return 'set post status'
    case 'set_post_assignee':
      return 'set post assignee'
    case 'set_post_custom_fields':
      return 'set post custom fields'

    case 'post_vote_on_behalf':
      return 'vote on behalf of a post'
    case 'post_merge':
      return 'merge posts'
    case 'post_import':
      return 'import posts'
    case 'post_export':
      return 'export posts'
    case 'moderate_posts':
      return 'moderate posts'

    case 'view_users':
      return 'view user information'
    case 'manage_users':
      return 'manage users'

    case 'view_posts_private':
      return 'view private posts'

    case 'view_private_post_tags':
      return 'view private post tags'

    case 'manage_changelogs':
      return 'manage changelogs'

    case 'manage_surveys':
      return 'manage surveys'

    case 'manage_branding':
      return 'manage branding'
    case 'manage_billing':
      return 'manage billing'
    case 'manage_team_members':
      return 'manage team members'
    case 'manage_sso':
      return 'manage SSO'
    case 'manage_api':
      return 'manage the API'
    case 'manage_statuses':
      return 'manage statuses'
    case 'manage_boards':
      return 'manage boards'
    case 'manage_post_tags':
      return 'manage post tags'
    case 'manage_custom_fields':
      return 'manage custom fields'
    case 'manage_moderation_settings':
      return 'manage moderation settings'
    case 'manage_roadmap':
      return 'manage roadmap'
    case 'manage_user_roles':
      return 'manage user roles'
    case 'manage_prioritization':
      return 'manage prioritization'
    case 'manage_notifications':
      return 'manage notifications'
    case 'manage_custom_domain':
      return 'manage custom domain'

    case 'manage_integrations':
      return 'manage integrations'
    case 'use_integrations':
      return 'use integrations'

    default:
      return 'perform this action'
  }
}

const PermissionRequiredPopup: React.FC<{
  isOpen: boolean
  setOpen: Function
  permission: keyof IMemberRolePermissions
}> = ({ isOpen, setOpen, permission }) => {
  const { org } = useCurrentOrganization()

  return (
    <PopupWrapper isOpen={isOpen} setIsOpen={setOpen}>
      <div className="relative w-full">
        <h2 className="text-lg font-medium text-gray-500 dark:text-white">
          You do not have permission to{' '}
          <span className="font-semibold">{permissionToText(permission)}</span>
        </h2>
        <p className="mt-1.5 max-w-[400px] text-sm">
          Please contact your organization administrators to request access to{' '}
          <span className="font-medium">{permissionToText(permission)}</span>.
        </p>
        <div className="flex w-full justify-end">
          <button
            className="dashboard-primary"
            onClick={() => {
              setOpen(false)
            }}
          >
            Close
          </button>
        </div>
      </div>
    </PopupWrapper>
  )
}

export default PermissionRequiredPopup
