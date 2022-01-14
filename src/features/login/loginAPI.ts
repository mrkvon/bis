import axios from '../../config/axios'
import { LoginState } from './loginSlice'
import { Credentials } from './types'

const REFRESH_TOKEN_KEY = 'refreshToken'

export const login = async (credentials: Credentials) => {
  const response = await axios.request<{ access: string; refresh: string }>({
    method: 'post',
    url: 'token/',
    data: credentials,
  })
  const { access, refresh } = response.data

  // TODO save refresh token to local storage
  globalThis.localStorage.setItem(REFRESH_TOKEN_KEY, refresh)

  axios.defaults.headers.common.Authorization = `Bearer ${access}`
}

export const logout = async () => {
  // delete refresh token from local storage
  globalThis.localStorage.removeItem(REFRESH_TOKEN_KEY)
  // clear Authorization header with access token
  delete axios.defaults.headers.common.Authorization
  return
}

export const init = async () => {
  // get whoami
  const responseWho = await axios.request<{
    firstName: string
    lastName: string
    nickname: string
    isStaff: boolean
    isSuperuser: boolean
    isEventOrganizer: boolean
  }>({
    method: 'get',
    url: 'frontend/whoami',
  })

  const me = responseWho.data

  // get userId from refresh token
  const refreshData =
    globalThis.localStorage.getItem(REFRESH_TOKEN_KEY)?.split('.')[1] ?? ''
  const userId = JSON.parse(window.atob(refreshData)).user_id as number

  const roles: LoginState['roles'] = ['mem']
  if (me.isEventOrganizer) {
    roles.unshift('org')
  }

  return {
    isLoggedIn: true,
    userId,
    givenName: me.firstName,
    familyName: me.lastName,
    nickname: me.nickname,
    roles,
  }
}

export const refreshAccessToken = async () => {
  // get refresh token from local storage
  const refresh = globalThis.localStorage.getItem(REFRESH_TOKEN_KEY)

  if (!refresh) throw new Error('refresh token not found')

  // get access token from api
  const response = await axios.request<{ access: string }>({
    method: 'post',
    data: { refresh },
    url: 'token/refresh/',
  })

  const { access } = response.data

  axios.defaults.headers.common.Authorization = `Bearer ${access}`
}
