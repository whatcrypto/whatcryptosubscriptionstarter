import { Redirect } from 'next'
import absoluteUrl from 'next-absolute-url'
import { NextIncomingMessage } from 'next/dist/server/request-meta'

export const getSubdomain = (context: any) => {
  let subdomain = context.req.headers.host.split('.')[0]
  return { props: { subdomain } }
}

export const getOrganizationUrl = (subdomain: string) => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
    ? `http://${subdomain}.localhost:3000`
    : `https://${subdomain}.featurebase.app`
}

export const getHTTPProtocol = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ? 'http://' : 'https://'
}

export const redirectToLogin: { redirect: Redirect } = {
  redirect: { destination: '/login', permanent: false },
}

export const redirectToRefresh = (
  req: NextIncomingMessage & { cookies: Partial<{ [key: string]: string }> },
  path: string = ''
): { redirect: Redirect } => {
  // @ts-ignore
  const { host, origin, protocol } = absoluteUrl(req)
  return {
    redirect: {
      destination:
        '/loading?onSuccessRedirectUrl=' +
        `${process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ? 'http:' : 'https:'}//${host}` +
        path,
      permanent: false,
    },
  }
}
