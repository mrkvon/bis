import { wait } from '../../helpers'
import { Person } from './types'

export const searchPeople = async (query: string): Promise<Person[]> => {
  if (query.length === 0) return []

  await wait(700)

  return [
    {
      id: 1,
      nickname: 'Kos',
      givenName: 'Jana',
      familyName: 'Nováková',
      qualifications: ['OHB'],
    },
    {
      id: 2,
      nickname: 'Pavouk',
      givenName: 'Pavel',
      familyName: 'Němec',
      qualifications: [],
    },
    {
      id: 3,
      nickname: 'Květen',
      givenName: 'Hynek',
      familyName: 'Máj',
      qualifications: ['OvHB', 'OHB-BRĎO'],
    },
    {
      id: 4,
      nickname: 'Tráva',
      givenName: 'Vilém',
      familyName: 'Máchal',
      qualifications: ['OHB-BRĎO-P', 'Instruktor'],
    },
    {
      id: 5,
      nickname: '',
      givenName: 'Jarmila',
      familyName: 'Kotrbová',
      qualifications: ['OHB-BRĎO-P'],
    },
  ]
}
