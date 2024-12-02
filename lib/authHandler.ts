import { AxiosError, AxiosResponse } from 'axios'
import { TFunction } from 'react-i18next'
import isEmail from 'validator/lib/isEmail'
import { loginWithPassword, loginWithToken, registerWithPassword } from '../../network/lib/user'
import { IOrganization } from '../interfaces/IOrganization'
import { IAuthErrors, IRegisterUser, IAdmin, ILogin, ICustomer } from '../interfaces/IUser'
import { isMember } from './acl'

export const signInGoogle = (
  type: 'admin' | 'customer',
  organizationId: string | null,
  callback: (user: IAdmin | ICustomer) => void
) => {
  const url = new URL(
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
      ? 'https://auth.fbasedev.com'
      : 'https://auth.featurebase.app'
  )
  url.pathname = '/oauth/google'
  url.searchParams.set('returnTo', window.location.origin + '/oauth/loading')
  url.searchParams.set('type', type) // Type "admin" for doing global admin sign in
  organizationId && url.searchParams.set('oid', organizationId)

  const newWindow = window.open(url.toString(), 'Google Authentication', 'height=800,width=500')

  const checkCookie = setInterval(() => {
    try {
      if (newWindow?.location.href) {
        const urlParams = new URLSearchParams(newWindow.location.search)
        const token = urlParams.get('token')
        const error = urlParams.get('error')

        if (token || error) {
          // @ts-ignore
          newWindow.close()
          clearInterval(checkCookie)
          if (token) {
            loginWithToken({ token }).then((resp: AxiosResponse) => {
              if (resp.data.success) callback(resp.data.user as IAdmin | ICustomer)
            })
          }
        }
      }
    } catch (exeception) {}
  }, 500)
}

export const safariAuth = (callback: (param: boolean) => void, isSSO: boolean) => {
  const newWindow = window.open(
    'https://featurebase.app/confirm?returnTo=' +
      window.location.origin +
      '/oauth/loading' +
      (isSSO ? '&sso=true' : ''),
    'Confirm account',
    'height=700,width=460'
  )

  // Listen for post message
  // Listen for messages from the new window
  window.addEventListener('message', function (event) {
    // Check the origin of the data!
    if (event.origin !== 'https://www.featurebase.app') {
      console.log('Origin does not match', event.data)
      console.log('Event origin', event.origin)

      return // Not the expected origin: Reject the message!
    }

    // Handle the message
    const receivedData = event.data
    console.log(receivedData)

    // You can also use the receivedData to call your callback if needed
    // For example:
    if (receivedData.success) {
      callback(true)
    } else {
      callback(false)
    }
  })

  const checkIfFinished = setInterval(() => {
    try {
      if (newWindow?.location.href) {
        const urlParams = new URLSearchParams(newWindow.location.search)
        const finished = urlParams.get('finished')
        if (finished) {
          newWindow.close()
          clearInterval(checkIfFinished)
          callback(true)
        }
      }
    } catch (exeception) {
      console.log('did not get finished')
      console.log(exeception)
    }
  }, 400)
}

export const signInDiscord = (
  type: 'admin' | 'customer',
  organizationId: string | null,
  callback: (user: IAdmin | ICustomer) => void
) => {
  const url = new URL(
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
      ? 'https://auth.fbasedev.com'
      : 'https://auth.featurebase.app'
  )
  url.pathname = '/oauth/discord'
  url.searchParams.set('returnTo', window.location.origin + '/oauth/loading')
  url.searchParams.set('type', type)
  organizationId && url.searchParams.set('oid', organizationId)

  const newWindow = window.open(url.toString(), 'Discord Authentication', 'height=800,width=500')

  const checkCookie = setInterval(() => {
    try {
      if (newWindow?.location.href) {
        const urlParams = new URLSearchParams(newWindow.location.search)
        const token = urlParams.get('token')
        const error = urlParams.get('error')

        if (token || error) {
          // @ts-ignore
          newWindow.close()
          clearInterval(checkCookie)
          if (token) {
            loginWithToken({ token }).then((resp: AxiosResponse) => {
              if (resp.data.success) callback(resp.data.user as IAdmin | ICustomer)
            })
          }
        }
      }
    } catch (exeception) {}
  }, 500)
}

export const signInSteam = (callback: (user: IAdmin | ICustomer) => void) => {
  const newWindow = window.open(
    'https://auth.featurebase.app/oauth/steam?returnTo=' +
      window.location.origin +
      '/oauth/loading',
    'Steam Authentication',
    'height=800,width=500'
  )

  const checkCookie = setInterval(() => {
    try {
      if (newWindow?.location.href) {
        const urlParams = new URLSearchParams(newWindow.location.search)
        const token = urlParams.get('token')
        const error = urlParams.get('error')

        if (token || error) {
          // @ts-ignore
          newWindow.close()
          clearInterval(checkCookie)
          if (token) {
            loginWithToken({ token }).then((resp: AxiosResponse) => {
              if (resp.data.success) callback(resp.data.user as IAdmin | ICustomer)
            })
          }
        }
      }
    } catch (exeception) {}
  }, 500)
}

export const signInGithub = (
  type: 'admin' | 'customer',
  organizationId: string | null,
  callback: (user: IAdmin | ICustomer) => void
) => {
  const url = new URL(
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
      ? 'https://auth.fbasedev.com'
      : 'https://auth.featurebase.app'
  )
  url.pathname = '/oauth/github'
  url.searchParams.set('returnTo', window.location.origin + '/oauth/loading')
  url.searchParams.set('type', type)
  organizationId && url.searchParams.set('oid', organizationId)

  const newWindow = window.open(url.toString(), 'Github Authentication', 'height=800,width=500')

  const checkCookie = setInterval(() => {
    try {
      if (newWindow?.location.href) {
        const urlParams = new URLSearchParams(newWindow.location.search)
        const token = urlParams.get('token')
        const error = urlParams.get('error')

        if (token || error) {
          // @ts-ignore
          newWindow.close()
          clearInterval(checkCookie)
          if (token) {
            loginWithToken({ token }).then((resp: AxiosResponse) => {
              if (resp.data.success) callback(resp.data.user as IAdmin | ICustomer)
            })
          }
        }
      }
    } catch (exeception) {}
  }, 500)
}

export const handleLogin = async (
  loginData: { email: string; password: string; type: 'admin' | 'customer' },
  recaptchaToken: string,
  setErrors: (prevErrors: any) => void,
  callback: (user: IAdmin | ICustomer) => void,
  t?: TFunction<'translation', undefined>
) => {
  const loginFunction = loginWithPassword
  loginFunction({
    email: loginData.email,
    password: loginData.password,
    recaptchaToken,
    type: loginData.type,
  })
    .then((resp: AxiosResponse) => {
      if (resp.status === 200) callback(resp.data.user)
    })
    .catch((error: AxiosError) => {
      const errorResp = error.response
      if (errorResp?.status === 401)
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          response: t ? t('incorrect-password-or-email') : 'Incorrect password or email',
        }))
      else {
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          response: t ? t('unknown-error-has-occurred') : 'Unknown error has occurred',
        }))
      }
    })
}

export const handleRegister = async (
  registerData: {
    email: string
    password: string
    name: string
    type: 'admin' | 'customer'
  },
  recaptchaToken: string,
  callback: (user: IAdmin | ICustomer) => void,
  setErrors: (prevErrors: any) => void,
  t: TFunction<'translation', undefined>
) => {
  registerWithPassword({
    name: registerData.name,
    password: registerData.password,
    email: registerData.email,
    recaptchaToken,
    type: registerData.type,
  })
    .then((resp: AxiosResponse) => {
      if (resp.data?.success) {
        // Now create organization
        callback(resp.data.user)
      }
    })
    .catch((errorRes: AxiosError) => {
      const res = errorRes.response?.data
      if (!res) return
      if (res.message === 'User already exists')
        setErrors((prevErrors: any) => ({ ...prevErrors, response: t('email-already-taken') }))
      else if (res.message.includes('must be a valid email')) {
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          response: t('please-enter-a-valid-email'),
        }))
      }
    })
}

export const getRecaptchaToken = async (
  recaptchaRef: any,
  org?: IOrganization,
  user?: IAdmin | ICustomer | undefined,
  isTestingEnv?: any
) => {
  if (isTestingEnv === true) return 'test'
  if (user && org && isMember(user.id, org)) {
    return 'admin'
  } else {
    try {
      const token = await recaptchaRef?.current?.executeAsync()
      recaptchaRef?.current?.reset()
      return token
    } catch (error) {
      console.log('token error', error)
      return ''
    }
  }
}

export const hasInvalidInputsRegister = (
  registerData: IRegisterUser,
  setErrors: React.Dispatch<React.SetStateAction<IAuthErrors>>,
  t: TFunction<'translation', undefined>
) => {
  let hasErrors = false
  if (registerData.email === '') {
    setErrors((prevErrors) => ({ ...prevErrors, email: t('email-can-not-be-empty') }))
    hasErrors = true
  } else if (!isEmail(registerData.email)) {
    setErrors((prevErrors) => ({ ...prevErrors, email: t('please-enter-a-valid-email') }))
    hasErrors = true
  }
  if (registerData.name === '') {
    setErrors((prevErrors) => ({ ...prevErrors, name: t('name-can-not-be-empty') }))
    hasErrors = true
  }
  if (registerData.password === '') {
    setErrors((prevErrors) => ({ ...prevErrors, password: t('password-can-not-be-empty') }))
    hasErrors = true
  } else if (registerData.password.length < 6) {
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: t('password-must-at-least-6-characters-long'),
    }))
    hasErrors = true
  }
  return hasErrors
}

export const hasInvalidInputsLogin = (
  loginData: ILogin,
  setErrors: React.Dispatch<React.SetStateAction<IAuthErrors>>,
  t?: TFunction<'translation', undefined>
) => {
  let newErrors = {
    email: '',
    password: '',
    response: '',
  }
  let hasError = false
  if (loginData.email === '') {
    newErrors.email = t ? t('email-can-not-be-empty') : 'Email can not be empty'
    hasError = true
  }
  if (loginData.password === '') {
    newErrors.password = t ? t('password-can-not-be-empty') : 'Password can not be empty'
    hasError = true
  }
  setErrors(newErrors)
  return hasError
}
