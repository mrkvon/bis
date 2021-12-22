export type Qualification =
  | 'OHB'
  | 'OHB-BRĎO'
  | 'OvHB'
  | 'OHB-BRĎO-P'
  | 'Konzultant'
  | 'Instruktor'

export type Person = {
  id: number
  nickname: string
  givenName: string
  familyName: string
  qualifications: Qualification[]
}

export interface NewPerson extends Omit<Person, 'id' | 'qualifications'> {
  birthdate: string
  nationalIdentificationNumber: string
  permanentAddressStreet: string
  permanentAddressCity: string
  permanentAddressPostCode: string
  contactAddressStreet: string
  contactAddressCity: string
  contactAddressPostCode: string
  phone: string
  email: string
  sendNewsletter: boolean
}
