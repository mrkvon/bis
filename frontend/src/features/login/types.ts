export type Credentials = { username: string; password: string }

export type Role = keyof typeof existingRoles

export const existingRoles = {
  org: 'Organizátor',
  mem: 'Člen',
}
