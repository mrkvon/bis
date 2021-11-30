import { FC } from 'react'

const Location: FC<{
  value?: [number, number]
  onChange?: (e: { target: { value: [number, number] } }) => void
}> = ({ value = [50, 15], onChange = () => null }) => {
  return (
    <div>
      [
      <input
        value={value[0]}
        type="number"
        onChange={e =>
          onChange({ target: { value: [+e.target.value, value[1]] } })
        }
      />
      ,
      <input
        value={value[1]}
        type="number"
        onChange={e =>
          onChange({ target: { value: [value[0], +e.target.value] } })
        }
      />
    </div>
  )
}

export default Location
