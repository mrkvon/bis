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
    <div className="flex w-screen h-screen items-center justify-center bg-yellow-200">
      <h2>Přihlásit se jako</h2>
      <div className="grid gap-4">
        {availableRoles.map(role => (
          <Button key={role} onClick={() => dispatch(chooseRole(role))}>
            {existingRoles?.[role] ?? role.toUpperCase()}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default RoleSwitch
