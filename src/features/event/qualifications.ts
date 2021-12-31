import { Person, Qualification } from '../person/types'
import { audiences, basicPurposes, BeforeEventProps, eventTypes } from './types'

type QualificationRule = {
  intendedFor: (keyof typeof audiences)[] | 'all'
  eventType: (keyof typeof eventTypes)[] | 'all'
  notEventType: (keyof typeof eventTypes)[]
  basicPurpose: (keyof typeof basicPurposes)[] | 'all'
  qualification: Qualification[]
}

const qualificationRules: QualificationRule[] = [
  {
    intendedFor: ['everyone', 'adolescents_and_adults', 'newcomers'],
    eventType: ['dobrovolnicka', 'zazitkova', 'sportovni'],
    notEventType: [],
    basicPurpose: ['action-with-attendee-list'],
    qualification: ['OvHB', 'OHB', 'Instruktor', 'Konzultant'],
  },
  {
    intendedFor: ['everyone', 'adolescents_and_adults', 'newcomers'],
    eventType: 'all',
    notEventType: ['vystava'],
    basicPurpose: ['camp'],
    qualification: ['OHB', 'Instruktor', 'Konzultant'],
  },
  {
    intendedFor: ['everyone', 'adolescents_and_adults', 'newcomers'],
    eventType: ['vzdelavaci_ohb'],
    notEventType: [],
    basicPurpose: 'all',
    qualification: ['Instruktor', 'Konzultant'],
  },
  {
    intendedFor: ['parents_and_children'],
    eventType: [
      'dobrovolnicka',
      'zazitkova',
      'sportovni',
      'pobytovy_vyukovy_program',
    ],
    notEventType: [],
    basicPurpose: ['action-with-attendee-list'],
    qualification: [
      'OvHB',
      'OHB-BRĎO-P',
      'OHB',
      'OHB-BRĎO',
      'Instruktor',
      'Konzultant',
    ],
  },
  {
    intendedFor: ['parents_and_children'],
    eventType: [
      'dobrovolnicka',
      'zazitkova',
      'sportovni',
      'pobytovy_vyukovy_program',
    ],
    notEventType: [],
    basicPurpose: ['camp'],
    qualification: ['OHB', 'OHB-BRĎO', 'Instruktor', 'Konzultant'],
  },
  {
    intendedFor: ['children'],
    eventType: [
      'dobrovolnicka',
      'zazitkova',
      'sportovni',
      'vzdelavaci_kurzy_skoleni',
      'akce_verejnost',
      'interni',
    ],
    notEventType: [],
    basicPurpose: ['action', 'action-with-attendee-list'],
    qualification: ['OHB-BRĎO-P', 'OHB-BRĎO', 'Instruktor', 'Konzultant'],
  },
  {
    intendedFor: ['children'],
    eventType: ['oddilovka'],
    notEventType: [],
    basicPurpose: ['action'],
    qualification: ['OHB-BRĎO-P', 'OHB-BRĎO', 'Instruktor', 'Konzultant'],
  },
  {
    intendedFor: ['children'],
    eventType: [
      'dobrovolnicka',
      'zazitkova',
      'sportovni',
      'vzdelavaci_kurzy_skoleni',
      'akce_verejnost',
      'interni',
      'pobytovy_vyukovy_program',
    ],
    notEventType: [],
    basicPurpose: ['camp'],
    qualification: ['OHB-BRĎO', 'Instruktor', 'Konzultant'],
  },
  {
    intendedFor: ['children'],
    eventType: ['oddilovka'],
    notEventType: [],
    basicPurpose: ['action-with-attendee-list'],
    qualification: ['OHB-BRĎO', 'Instruktor', 'Konzultant'],
  },
]

export const getIsQualified = (
  event: Pick<BeforeEventProps, 'intendedFor' | 'basicPurpose' | 'eventType'>,
  qualifications: Person['qualifications'],
): boolean => {
  if (!(event.intendedFor && event.basicPurpose && event.eventType))
    return false
  const rule = qualificationRules.find(rule => {
    const isBasicPurpose =
      rule.basicPurpose === 'all' ||
      rule.basicPurpose.includes(event.basicPurpose)
    const isIntendedFor =
      rule.intendedFor === 'all' || rule.intendedFor.includes(event.intendedFor)
    const isEventType =
      rule.eventType === 'all' || rule.eventType.includes(event.eventType)
    const isNotEventType = !rule.notEventType.includes(event.eventType)
    return isBasicPurpose && isIntendedFor && isEventType && isNotEventType
  })

  if (!rule) return true

  return qualifications.some(qualification =>
    rule.qualification.includes(qualification),
  )
}
