import { FC } from 'react'
import { Person } from '../person/types'
import './PersonOptionLabel.css'

export const DefaultPersonLabel: FC<{ person: Person }> = ({ person }) => (
  <div className="person-option-label">
    <span>
      {person.givenName} <i>{person.nickname}</i> {person.familyName}
    </span>
  </div>
)

export const QualifiedPersonLabel: FC<{ person: Person }> = ({ person }) => (
  <div className="person-option-label">
    <span>
      {person.givenName} <i>{person.nickname}</i> {person.familyName}
    </span>
    <span>{person.qualifications.join(', ')}</span>
  </div>
)
