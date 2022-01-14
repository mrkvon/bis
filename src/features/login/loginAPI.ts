import axios from '../../config/axios'
import { LoginState } from './loginSlice'
import { Credentials, Role } from './types'

const REFRESH_TOKEN_KEY = 'refreshToken'

export const login = async (credentials: Credentials) => {
  // clear any leftover data
  logout()
  const response = await axios.request<{ access: string; refresh: string }>({
    method: 'post',
    url: 'token/',
    data: credentials,
  })
  const { access, refresh } = response.data

  // save refresh token to local storage
  globalThis.localStorage.setItem(REFRESH_TOKEN_KEY, refresh)

  // set authorization header to axios
  axios.defaults.headers.common.Authorization = `Bearer ${access}`
}

export const logout = () => {
  // clear local storage
  globalThis.localStorage.clear()
  // clear Authorization header with access token
  delete axios.defaults.headers.common.Authorization
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

  // get the role selected by user
  const savedRole = (globalThis.localStorage.getItem('role') as Role | '') ?? ''

  const currentRole: Role | '' =
    savedRole && roles.includes(savedRole)
      ? savedRole
      : roles.length === 1
      ? roles[0]
      : ''

  return {
    userId,
    givenName: me.firstName,
    familyName: me.lastName,
    nickname: me.nickname,
    roles,
    currentRole,
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
