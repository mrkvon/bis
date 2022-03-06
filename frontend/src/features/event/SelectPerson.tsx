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
import {
  useGetPersonsQuery,
  useSearchPeopleQuery,
} from '../../app/services/bronto'
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
    const [debouncedQuery, setDebouncedQuery] = useState('')

    const { isFetching, data: persons = [] } =
      useSearchPeopleQuery(debouncedQuery)

    const { data: selectedPersons = [] } = useGetPersonsQuery(
      [value].flat().filter(a => Boolean(a)) as number[],
    )

    const debounceQuery = useMemo(() => {
      return debounce(setDebouncedQuery, 500)
    }, [])

    useEffect(() => {
      debounceQuery(query)
    }, [query, debounceQuery])

    const getFormattedValue = (value: number) => ({
      value,
      label: (
        <LabelComponent
          person={
            (selectedPersons.find(person => person.id === value) ?? {
              id: value,
              qualifications: [],
            }) as Person
          }
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
          ? isFetching || query !== debouncedQuery
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
