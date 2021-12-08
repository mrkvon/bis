import { Select, Spin } from 'antd'
import debounce from 'lodash/debounce'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import {
  searchPeople,
  selectInProgress,
  selectSearchUsers,
} from '../person/personSlice'

type SelectProps = Parameters<typeof Select>[0]

interface SelectPersonProps extends SelectProps {
  multiple?: boolean
}

const SelectPerson = forwardRef<HTMLSelectElement, SelectPersonProps>(
  ({ multiple, ...props }, ref) => {
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
            : {}
          : { notFoundContent: null })}
        {...props}
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
