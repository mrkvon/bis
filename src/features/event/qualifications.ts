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
    eventType: ['pracovni', 'prozitkova', 'sportovni'],
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
    eventType: ['ohb'],
    notEventType: [],
    basicPurpose: 'all',
    qualification: ['Instruktor', 'Konzultant'],
  },
  {
    intendedFor: ['parents_and_children'],
    eventType: ['pracovni', 'prozitkova', 'sportovni', 'pobyt'],
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
    eventType: ['pracovni', 'prozitkova', 'sportovni', 'pobyt'],
    notEventType: [],
    basicPurpose: ['camp'],
    qualification: ['OHB', 'OHB-BRĎO', 'Instruktor', 'Konzultant'],
  },
  {
    intendedFor: ['children'],
    eventType: [
      'pracovni',
      'prozitkova',
      'sportovni',
      'vzdelavaci',
      'verejnost',
      'jina',
    ],
    notEventType: [],
    basicPurpose: ['action', 'action-with-attendee-list'],
    qualification: ['OHB-BRĎO-P', 'OHB-BRĎO', 'Instruktor', 'Konzultant'],
  },
  {
    intendedFor: ['children'],
    eventType: ['schuzka'],
    notEventType: [],
    basicPurpose: ['action'],
    qualification: ['OHB-BRĎO-P', 'OHB-BRĎO', 'Instruktor', 'Konzultant'],
  },
  {
    intendedFor: ['children'],
    eventType: [
      'pracovni',
      'prozitkova',
      'sportovni',
      'vzdelavaci',
      'verejnost',
      'jina',
      'pobyt',
    ],
    notEventType: [],
    basicPurpose: ['camp'],
    qualification: ['OHB-BRĎO', 'Instruktor', 'Konzultant'],
  },
  {
    intendedFor: ['children'],
    eventType: ['schuzka'],
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
