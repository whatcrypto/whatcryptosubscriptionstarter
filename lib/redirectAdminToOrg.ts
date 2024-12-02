export function redirectToOrg(orgId: string, path?: string) {
  const redirectUrl = new URL(
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
      ? `http://auth.fbasedev.com/api/v1/auth/organization-redirect`
      : `https://auth.featurebase.app/api/v1/auth/organization-redirect`
  )

  if (path) {
    redirectUrl.searchParams.set('path', path)
  }
  redirectUrl.searchParams.set('organizationId', orgId)
  window.location.href = redirectUrl.toString()
}

export function redirectAdminToOrgById(orgId: string, path?: string) {
  const redirectUrl = new URL(
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
      ? `http://auth.fbasedev.com/api/v1/auth/admin-redirect`
      : `https://auth.featurebase.app/api/v1/auth/admin-redirect`
  )

  if (path) {
    redirectUrl.searchParams.set('path', path)
  }
  redirectUrl.searchParams.set('organizationId', orgId)
  window.location.href = redirectUrl.toString()
}

export function redirectAdminToOrgByName(orgName: string, path?: string) {
  const redirectUrl = new URL(
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
      ? `http://auth.fbasedev.com/api/v1/auth/admin-redirect`
      : `https://auth.featurebase.app/api/v1/auth/admin-redirect`
  )

  if (path) {
    redirectUrl.searchParams.set('path', path)
  }
  redirectUrl.searchParams.set('subdomain', orgName)
  window.location.href = redirectUrl.toString()
}
