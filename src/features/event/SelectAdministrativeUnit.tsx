import { Select } from 'antd'
import { forwardRef, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  readAdministrativeUnits,
  selectAdministrativeUnits,
} from '../administrativeUnit/administrativeUnitSlice'
import deburr from 'lodash/deburr'

type SelectProps = Parameters<typeof Select>[0]

const SelectAdministrativeUnit = forwardRef<HTMLSelectElement, SelectProps>(
  (props, ref) => {
    const dispatch = useAppDispatch()
    const administrativeUnits = useAppSelector(selectAdministrativeUnits)

    useEffect(() => {
      dispatch(readAdministrativeUnits())
    }, [dispatch])

    return (
      <Select
        ref={ref}
        showSearch
        {...props}
        options={administrativeUnits.map(unit => ({
          label: unit.name,
          title: unit.name,
          value: unit.id,
        }))}
        filterOption={(inputValue, option) => {
          return deburr(option?.title)
            .toLowerCase()
            .includes(deburr(inputValue).toLowerCase())
        }}
      ></Select>
    )
  },
)

SelectAdministrativeUnit.displayName = 'SelectAdministrativeUnit'

export default SelectAdministrativeUnit
