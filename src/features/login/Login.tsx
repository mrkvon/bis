import { Button, Form, Input } from 'antd'
import { ValidateErrorEntity } from 'rc-field-form/lib/interface'
import { useLoginMutation } from '../../app/services/bronto'
import { Credentials } from './types'

const Login = () => {
  const [signIn] = useLoginMutation()
  const [form] = Form.useForm<Credentials>()

  const onFinish = (credentials: Credentials) => signIn(credentials)

  const onFinishFailed = (errorInfo: ValidateErrorEntity<Credentials>) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div className="flex flex-col items-center">
      <Form
        name="basic"
        form={form}
        layout="vertical"
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

        <Form.Item shouldUpdate>
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
    </div>
  )
}

export default Login
