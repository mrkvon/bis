import { Form, Input, DatePicker, Checkbox, Button } from 'antd'
import { NewPerson } from './types'

interface CreatePersonProps {
  onSubmit: (data: NewPerson) => void
}

const CreatePerson = ({ onSubmit }: CreatePersonProps) => (
  <Form onFinish={onSubmit}>
    <Form.Item name="nickname" label="Přezdívka">
      <Input />
    </Form.Item>
    <Form.Item name="academicDegree" label="Titul">
      <Input />
    </Form.Item>
    <Form.Item
      name="givenName"
      label="Křestní jméno"
      rules={[{ required: true }]}
    >
      <Input />
    </Form.Item>
    <Form.Item name="familyName" label="Příjmení" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="birthName" label="Rodné Příjmení">
      <Input />
    </Form.Item>
    <Form.Item name="birthdate" label="Datum narození">
      <DatePicker />
    </Form.Item>
    <Form.Item name="nationalIdentificationNumber" label={'Rodné číslo'}>
      <Input />
    </Form.Item>
    <Form.Item
      name="permanentAddressStreet"
      label={'Trvalé bydliště - ulice a číslo'}
      rules={[{ required: true }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name="permanentAddressCity"
      label={'Trvalé bydliště - město'}
      rules={[{ required: true }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name="permanentAddressPostCode"
      label={'Trvalé bydliště - PSČ'}
      rules={[{ required: true }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name="contactAddressStreet"
      label={'Kontaktní adresa - ulice a číslo'}
    >
      <Input />
    </Form.Item>
    <Form.Item name="contactAddressCity" label={'Kontaktní adresa - město'}>
      <Input />
    </Form.Item>
    <Form.Item name="contactAddressPostCode" label={'Kontaktní adresa - PSČ'}>
      <Input />
    </Form.Item>
    <Form.Item name="phone" label={'Telefon'}>
      <Input />
    </Form.Item>
    <Form.Item name="email" label={'Email'}>
      <Input />
    </Form.Item>
    <Form.Item name="sendNewsletter" label={'Zasílat informačník?'}>
      <Checkbox />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit">Přidat</Button>
    </Form.Item>
  </Form>
)

export default CreatePerson
