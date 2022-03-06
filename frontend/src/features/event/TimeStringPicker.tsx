import { TimePicker } from 'antd'
import moment from 'moment'
import { forwardRef } from 'react'

interface TimeStringPickerProps {
  value?: string | null
  onChange?: (range: string | null) => void
}

const TimeStringPicker = forwardRef<typeof TimePicker, TimeStringPickerProps>(
  ({ value = null, onChange = () => null }, ref) => {
    return (
      <TimePicker
        ref={ref}
        format="HH:mm"
        value={value ? moment(value, 'HH:mm') : null}
        onChange={time => onChange(time ? time.format('HH:mm') : null)}
      />
    )
  },
)

TimeStringPicker.displayName = 'TimeStringPicker'

export default TimeStringPicker
