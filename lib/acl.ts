import { IMemberRolePermissions, IOrganization } from '@/interfaces/IOrganization'
import { isValidObjectId } from './utils'
import { ISubmission } from '@/interfaces/ISubmission'

type ResourceAction = keyof IMemberRolePermissions
/**
 * Checks if the given user is allowed to access the resource for the given permissions (note: it must fulfill all the permissions).
 * @returns
 */
function can(
  userId: string | undefined | null,
  permissions: ResourceAction[] | ResourceAction,
  org: IOrganization | null | undefined
) {
  if (!org) {
    return false
  }

  permissions = Array.isArray(permissions) ? permissions : [permissions]

  if (!userId || !isValidObjectId(userId)) {
    return false
  }

  userId = userId.toString()

  if (org.owner === userId) {
    return true
  }

  if (!org.memberRoles || org.memberRoles.length === 0) {
    return false
  }

  if (!permissions || permissions.length === 0) {
    return false
  }

  // check if userId is member of the organization
  const member = org.members.find((member) => member.userId.toString() === userId)

  if (!member) {
    return false
  }

  const userRole = getUserRole(userId, org)
  if (!userRole || !userRole._id.toString()) {
    return false
  }

  // check if user has the required permissions
  const hasPermissions = permissions.every((permission) => {
    const permissionValue = org.memberRoles.find(
      (role) => role._id.toString() === userRole._id.toString()
    )?.permissions[permission]
    return permissionValue
  })

  if (!hasPermissions) {
    return false
  }

  return true
}

/**
 * Method to check if a member has access to a submission. Used by things like assignee dropdown to determine which members can be assigned to a submission.
 *
 * @param userId
 * @param sub
 * @param org
 * @returns
 */
function memberHasAccessToSubmission(
  userId: string | undefined | null,
  sub: ISubmission,
  org: IOrganization
) {
  if (!isMember(userId, org)) {
    return false
  }

  if (sub.postCategory.private && !can(userId, 'view_posts_private', org)) {
    return false
  }

  if (sub.inReview && !can(userId, 'moderate_posts', org)) {
    return false
  }

  return true
}

function getUserRole(userId: string | undefined | null, org: IOrganization) {
  if (!org) {
    return null
  }

  if (!userId || !isValidObjectId(userId)) {
    return null
  }

  const member = org.members.find((member) => member.userId.toString() === userId.toString())

  if (!member) {
    return null
  }

  return org.memberRoles.find((role) => role._id === member.roleId.toString()) || null
}

function isMember(userId: string | undefined | null, org: IOrganization | null | undefined) {
  if (!org) {
    return false
  }
  if (!userId || !isValidObjectId(userId)) {
    return false
  }

  return org.members.some((member) => member.userId.toString() === userId.toString())
}

function isOwner(userId: string | undefined | null, org: IOrganization | null | undefined) {
  if (!org) {
    return false
  }
  if (!userId || !isValidObjectId(userId)) {
    return false
  }

  return org.owner === userId.toString()
}

export { can, getUserRole, isMember, isOwner, memberHasAccessToSubmission }
