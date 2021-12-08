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
