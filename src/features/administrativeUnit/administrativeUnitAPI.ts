import { wait } from '../../helpers'
import { AdministrativeUnit } from './types'

export const readAdministrativeUnits = async (): Promise<
  AdministrativeUnit[]
> => {
  await wait(500)
  return [
    {
      id: 0,
      name: 'Vlkani',
      level: 'basic_section',
    },
    {
      id: 1,
      name: 'Baobab',
      level: 'basic_section',
    },
    {
      id: 2,
      name: 'Modrý Kámen',
      level: 'basic_section',
    },
  ]
}
