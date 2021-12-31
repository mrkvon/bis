import { Select, Spin } from 'antd'
import debounce from 'lodash/debounce'
import {
  FC,
  forwardRef,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import {
  searchPeople,
  selectInProgress,
  selectPeople,
  selectSearchUsers,
} from '../person/personSlice'
import { Person } from '../person/types'
import { DefaultPersonLabel } from './PersonOptionLabel'

type SelectProps = Parameters<typeof Select>[0]

/** TODO figure out why onSelect has to be explicitly defined
 * https://stackoverflow.com/questions/41385059/possible-to-extend-types-in-typescript */
interface SelectPersonProps
  extends Omit<SelectProps, 'value' | 'onChange' | 'defaultValue'> {
  multiple?: boolean
  onPerson?: (person: Person) => void
  onSelect?: SelectProps['onSelect']
  defaultOption?: ReactElement
  LabelComponent?: FC<{ person: Person }>
  getDisabled?: (person: Person) => boolean
  value?: number | number[]
  onChange?: (value: number | number[]) => void
}

const SelectPerson = forwardRef<HTMLSelectElement, SelectPersonProps>(
  (
    {
      multiple,
      defaultOption,
      onPerson,
      onSelect,
      LabelComponent = DefaultPersonLabel,
      getDisabled = () => false,
      value,
      onChange = () => {
        return
      },
      ...props
    },
    ref,
  ) => {
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

    const selectedPeople = useAppSelector((state: RootState) =>
      selectPeople(
        state,
        typeof value === 'number' ? [value] : Array.isArray(value) ? value : [],
      ),
    )

    const getFormattedValue = (value: number) => ({
      value,
      label: (
        <LabelComponent
          person={selectedPeople.find(person => person.id === value) as Person}
        />
      ),
    })

    const formattedValue =
      typeof value === 'number'
        ? getFormattedValue(value)
        : Array.isArray(value)
        ? value.map(value => getFormattedValue(value))
        : value

    return (
      <Select<
        | { value: number; label: ReactElement }
        | { value: number; label: ReactElement }[]
      >
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
        labelInValue
        onSelect={({ value: personId }, ...props) => {
          const person = persons.find(({ id }) => id === personId)
          if (person && onPerson) onPerson(person)
          if (onSelect) onSelect(personId, ...props)
        }}
        value={formattedValue}
        onChange={value => {
          Array.isArray(value)
            ? onChange(value.map(({ value }) => value))
            : onChange(value.value)
        }}
      >
        {persons.map(person => (
          <Select.Option
            key={person.id}
            value={person.id}
            disabled={getDisabled(person)}
          >
            <LabelComponent person={person} />
          </Select.Option>
        ))}
      </Select>
    )
  },
)

SelectPerson.displayName = 'SelectPerson'

export default SelectPerson
