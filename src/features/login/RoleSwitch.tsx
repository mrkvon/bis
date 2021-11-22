import { Button } from 'antd'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { chooseRole, selectLogin } from './loginSlice'

export const existingRoles = {
  org: 'Organizátor',
  mem: 'Člen',
}

const RoleSwitch = () => {
  const dispatch = useAppDispatch()
  const { roles: availableRoles } = useAppSelector(selectLogin)
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-lg">Přihlásit se jako</h2>
      {availableRoles.map(role => (
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
