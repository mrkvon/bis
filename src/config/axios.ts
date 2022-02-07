import axios from 'axios'
import { refreshAccessToken } from '../features/login/loginAPI'
import { props2camelCaseRecursive, props2snakeCaseRecursive } from '../helpers'

const instance = axios.create({
  baseURL: 'https://brontosaurus.klub-pratel.cz/api',
})

// turn all camelCase keys in request body into snake_case
instance.interceptors.request.use(
  config => {
    if ('data' in config && typeof config.data === 'object') {
      config.data = props2snakeCaseRecursive(config.data)
    }
    return config
  },
  error => Promise.reject(error),
)

// turn all snake_case keys in response body to camelCase
instance.interceptors.response.use(
  response => {
    if ('data' in response && typeof response.data === 'object') {
      response.data = props2camelCaseRecursive(response.data)
    }
    return response
  },
  error => Promise.reject(error),
)

// if request fails, try to refresh access token and fetch again
instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true
      const accessToken = await refreshAccessToken()
      // this line is sort of duplicate, but before we didn't have the authorization header updated
      instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`
      return instance.request(originalRequest)
    } else {
      throw error
    }
  },
)

export default instance
