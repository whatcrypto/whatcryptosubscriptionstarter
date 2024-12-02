import { IOrganization } from '@/interfaces/IOrganization'
import { IAdmin, ICustomer } from '@/interfaces/IUser'

export const checkMicrosoftAccess = (
  user: IAdmin | ICustomer | null | undefined,
  org: IOrganization
) => {
  if (!org.microsoft?.tenantId) {
    return false
  }

  if (!user) {
    return false
  }

  if (user.type === 'customer') {
    if (!user.microsoft) {
      return false
    }
    if (user.microsoft.tenantId === org.microsoft.tenantId) {
      return true
    }
  }
  if (user.type === 'admin') {
    if (!user.microsoftOrgs) {
      return false
    }
    if (!user.microsoftOrgs[org.id]) {
      return false
    }

    if (user.microsoftOrgs[org.id].tenantId === org.microsoft.tenantId) {
      return true
    }
  }

  return false
}
