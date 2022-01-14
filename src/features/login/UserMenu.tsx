import { DownOutlined, UserOutlined } from '@ant-design/icons'
import { Dropdown, Menu } from 'antd'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectLoggedUser } from '../person/personSlice'
import { chooseRole, logoutEffect as logout } from './loginSlice'

const UserMenu = () => {
  const user = useAppSelector(selectLoggedUser)
  const dispatch = useAppDispatch()

  const menu = (
    <Menu>
      <Menu.Item key="change-role" onClick={() => dispatch(chooseRole(''))}>
        Změnit roli
      </Menu.Item>
      <Menu.Item key="change-password" disabled>
        Změnit heslo (TODO)
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={() => dispatch(logout)}>
        Odhlásit
      </Menu.Item>
    </Menu>
  )
  return (
    <Dropdown overlay={menu} className="flex items-center gap-1">
      <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
        <UserOutlined /> {user.givenName} {user.familyName} <DownOutlined />
      </a>
    </Dropdown>
  )
}

export default UserMenu
