export const administrativeUnitLevel = {
  regional_center: 'RC',
  basic_section: 'ZČ',
  headquarter: 'ústředí',
  club: 'Klub',
}

type AdministrativeUnitLevel = keyof typeof administrativeUnitLevel

export type AdministrativeUnit = {
  id: number
  name: string
  city: string
  level: AdministrativeUnitLevel
}
