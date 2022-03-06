import { match, wait } from '../../helpers'
import { Person, NewPerson } from './types'

export const searchPeople = async (query: string): Promise<Person[]> => {
  if (query.length === 0) return []

  await wait(700)

  return fakePeople.filter(
    ({ givenName, familyName, nickname }) =>
      match(givenName, query) ||
      match(familyName, query) ||
      match(nickname, query) ||
      match(`${givenName} ${familyName}`, query),
  )
}

export const findPerson = async ({
  givenName,
  familyName,
  birthdate,
}: {
  givenName: string
  familyName: string
  birthdate: string
}): Promise<Person | null> => {
  await wait(800)
  return birthdate === '2021-01-01'
    ? null
    : {
        id: Math.random(),
        givenName,
        familyName,
        nickname: '',
        qualifications: [],
        birthdate: '',
        nationalIdentificationNumber: '',
        permanentAddressStreet: '',
        permanentAddressCity: '',
        permanentAddressPostCode: '',
        contactAddressStreet: '',
        contactAddressCity: '',
        contactAddressPostCode: '',
        phone: '',
        email: '',
      }
}

export const createPerson = async (
  personData: NewPerson,
): Promise<Person | null> => {
  await wait(800)
  const { nickname, givenName, familyName } = personData

  const person = {
    id: Math.random(),
    nickname,
    givenName,
    familyName,
    qualifications: [],
    birthdate: '',
    nationalIdentificationNumber: '',
    permanentAddressStreet: '',
    permanentAddressCity: '',
    permanentAddressPostCode: '',
    contactAddressStreet: '',
    contactAddressCity: '',
    contactAddressPostCode: '',
    phone: '',
    email: '',
  }
  return personData.birthdate === '2021-01-01' ? null : person
}

export const readPerson = async (id: number): Promise<Person> => {
  await wait(500)
  return fakePeople.find(person => person.id === id) as Person
}

export const fakePeople: Person[] = [
  {
    id: 1,
    nickname: 'Kos',
    givenName: 'Jana',
    familyName: 'Nováková',
    qualifications: ['OHB'],
    birthdate: '',
    nationalIdentificationNumber: '',
    permanentAddressStreet: '',
    permanentAddressCity: '',
    permanentAddressPostCode: '',
    contactAddressStreet: '',
    contactAddressCity: '',
    contactAddressPostCode: '',
    phone: '',
    email: '',
  },
  {
    id: 2,
    nickname: 'Pavouk',
    givenName: 'Pavel',
    familyName: 'Němec',
    qualifications: [],
    birthdate: '',
    nationalIdentificationNumber: '',
    permanentAddressStreet: '',
    permanentAddressCity: '',
    permanentAddressPostCode: '',
    contactAddressStreet: '',
    contactAddressCity: '',
    contactAddressPostCode: '',
    phone: '',
    email: '',
  },
  {
    id: 3,
    nickname: 'Květen',
    givenName: 'Hynek',
    familyName: 'Máj',
    qualifications: ['OvHB', 'OHB-BRĎO'],
    birthdate: '',
    nationalIdentificationNumber: '',
    permanentAddressStreet: '',
    permanentAddressCity: '',
    permanentAddressPostCode: '',
    contactAddressStreet: '',
    contactAddressCity: '',
    contactAddressPostCode: '',
    phone: '',
    email: '',
  },
  {
    id: 4,
    nickname: 'Tráva',
    givenName: 'Vilém',
    familyName: 'Máchal',
    qualifications: ['OHB-BRĎO-P', 'Instruktor'],
    birthdate: '',
    nationalIdentificationNumber: '',
    permanentAddressStreet: '',
    permanentAddressCity: '',
    permanentAddressPostCode: '',
    contactAddressStreet: '',
    contactAddressCity: '',
    contactAddressPostCode: '',
    phone: '',
    email: '',
  },
  {
    id: 5,
    nickname: '',
    givenName: 'Jarmila',
    familyName: 'Kotrbová',
    qualifications: ['OHB-BRĎO-P'],
    birthdate: '',
    nationalIdentificationNumber: '',
    permanentAddressStreet: '',
    permanentAddressCity: '',
    permanentAddressPostCode: '',
    contactAddressStreet: '',
    contactAddressCity: '',
    contactAddressPostCode: '',
    phone: '',
    email: '',
  },
]
