import { Button } from 'antd'
import { useAppDispatch } from '../../app/hooks'
import { useGetCurrentUserQuery } from '../../app/services/bronto'
import { chooseRole } from './loginSlice'
import { existingRoles } from '../login/types'

const RoleSwitch = () => {
  const dispatch = useAppDispatch()
  const { data, isLoading } = useGetCurrentUserQuery()
  if (isLoading || !data) return null
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-lg">Přihlásit se jako</h2>
      {data.roles.map(role => (
        <Button
          className="w-32"
          key={role}
          onClick={() => dispatch(chooseRole(role))}
        >
          {existingRoles?.[role] ?? role.toUpperCase()}
        </Button>
      ))}
    </div>
  )
}

export default RoleSwitch
