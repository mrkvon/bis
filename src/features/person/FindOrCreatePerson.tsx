import { Button, DatePicker, Form, Input } from 'antd'
import moment from 'moment'
import { findPerson } from './personAPI'
import { Person } from './types'
interface PersonData {
  givenName: string
  familyName: string
  birthdate: moment.Moment
}

interface FindOrCreatePersonProps {
  onPerson: (person: Person) => void
}

export const FindOrCreatePerson = ({ onPerson }: FindOrCreatePersonProps) => {
  const handleFinish = async ({
    givenName,
    familyName,
    birthdate: momentBirthdate,
  }: PersonData) => {
    const birthdate = momentBirthdate.format('YYYY-MM-DD')
    /** TODO figure out if we should put this whole thing to redux */
    const person = await findPerson({ givenName, familyName, birthdate })

    if (person) {
      onPerson(person)
    }
  }

  return (
    <Form className="flex" onFinish={handleFinish}>
      <Form.Item name="givenName" rules={[{ required: true }]}>
        <Input placeholder="Jméno" />
      </Form.Item>
      <Form.Item name="familyName" rules={[{ required: true }]}>
        <Input placeholder="Příjmení" />
      </Form.Item>
      <Form.Item name="birthdate" rules={[{ required: true }]}>
        <DatePicker placeholder="Datum narození" />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">Přidat</Button>
      </Form.Item>
    </Form>
  )
}
/**{{ display: 'inline-block', width: 'calc(50% - 8px)' }}*/
export default FindOrCreatePerson
