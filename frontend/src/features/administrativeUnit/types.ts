export const administrativeUnitLevel = {
  regional_center: 'RC',
  basic_section: 'ZČ',
  headquarter: 'ústředí',
  club: 'Klub',
}

export type AdministrativeUnitLevel = keyof typeof administrativeUnitLevel

export interface AdministrativeUnit {
  id: number
  name: string
  city: string
  level: AdministrativeUnitLevel
}
