import { Select, Spin } from 'antd'
import debounce from 'lodash/debounce'
import { forwardRef, ReactElement, useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import {
  searchPeople,
  selectInProgress,
  selectSearchUsers,
} from '../person/personSlice'
import { Person } from '../person/types'

type SelectProps = Parameters<typeof Select>[0]

/** TODO figure out why onSelect has to be explicitly defined
 * https://stackoverflow.com/questions/41385059/possible-to-extend-types-in-typescript */
interface SelectPersonProps extends SelectProps {
  multiple?: boolean
  onPerson?: (person: Person) => void
  onSelect?: SelectProps['onSelect']
  defaultOption?: ReactElement
}

const SelectPerson = forwardRef<HTMLSelectElement, SelectPersonProps>(
  ({ multiple, defaultOption, onPerson, onSelect, ...props }, ref) => {
    const [query, setQuery] = useState('')
    const dispatch = useAppDispatch()
    const persons = useAppSelector((state: RootState) =>
      selectSearchUsers(state, query),
    )
    const inProgress = useAppSelector(selectInProgress)

    const searchPeopleDebounced = useMemo(() => {
      const handleSearch = (query: string) => dispatch(searchPeople(query))

      return debounce(handleSearch, 500)
    }, [dispatch])

    const handleSelect: Parameters<typeof Select>[0]['onSelect'] = (
      personId,
      ...props
    ) => {
      if (typeof personId === 'number') {
        const person = persons.find(({ id }) => id === personId)
        if (person && onPerson) onPerson(person)
      }
      if (onSelect) onSelect(personId, ...props)
    }

    useEffect(() => {
      searchPeopleDebounced(query)
    }, [query, searchPeopleDebounced])

    return (
      <Select
        ref={ref}
        filterOption={false}
        showSearch
        {...(multiple ? { mode: 'multiple' } : {})}
        onSearch={query => setQuery(query)}
        {...(query
          ? inProgress
            ? { notFoundContent: <Spin size="small" /> }
            : { notFoundContent: defaultOption }
          : {
              notFoundContent: null,
            })}
        {...props}
        onSelect={handleSelect}
      >
        {persons.map(({ givenName, familyName, nickname, id }) => (
          <Select.Option key={id} value={id}>
            <span>
              {givenName} <i>{nickname}</i> {familyName}
            </span>
          </Select.Option>
        ))}
      </Select>
    )
  },
)

SelectPerson.displayName = 'SelectPerson'

export default SelectPerson
