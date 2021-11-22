import { Credentials } from './types'
import { LoginState } from './loginSlice'

const wait = async (time: number) =>
  new Promise(resolve => setTimeout(resolve, time))

export const login = async (
  credentials: Credentials,
): Promise<Pick<LoginState, 'isLoggedIn' | 'username' | 'roles'>> => {
  await wait(1000)
  return {
    isLoggedIn: true,
    username: 'username' in credentials ? credentials.username : 'testuser',
    roles: ['org', 'mem'],
  }
}
