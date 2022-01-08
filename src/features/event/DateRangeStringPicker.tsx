import { DatePicker } from 'antd'
import moment from 'moment'
import { FC } from 'react'

const DateRangeStringPicker: FC<{
  value?: [string, string] | null
  onChange?: (range: [string, string] | null) => void
}> = ({ value = null, onChange = () => null }) => {
  return (
    <DatePicker.RangePicker
      value={value ? [moment(value[0]), moment(value[1])] : null}
      onChange={range =>
        onChange(
          range && range[0] && range[1]
            ? [range[0].format('YYYY-MM-DD'), range[1].format('YYYY-MM-DD')]
            : null,
        )
      }
    />
  )
}

export default DateRangeStringPicker
