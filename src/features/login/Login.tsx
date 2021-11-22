import { Button, Form, Input } from 'antd'
import { ValidateErrorEntity } from 'rc-field-form/lib/interface'
import { useAppDispatch } from '../../app/hooks'
import { Credentials } from './types'
import { login } from './loginSlice'

const Login = () => {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm<Credentials>()
  const onFinish = (credentials: Credentials) => {
    dispatch(login(credentials))
  }

  const onFinishFailed = (errorInfo: ValidateErrorEntity<Credentials>) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <>
      {' '}
      <h1>Brontosaurus Panel uživatele</h1>
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Uživatelské jméno"
          name="username"
          rules={[
            { required: true, message: 'Zadejte své uživatelské jméno!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Heslo"
          name="password"
          rules={[{ required: true, message: 'Zadejte své heslo!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item shouldUpdate wrapperCol={{ offset: 8, span: 16 }}>
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                !form.isFieldsTouched(true) ||
                form.getFieldsError().filter(({ errors }) => errors.length)
                  .length > 0
              }
            >
              Přihlásit
            </Button>
          )}
        </Form.Item>
      </Form>
    </>
  )
}

export default Login
