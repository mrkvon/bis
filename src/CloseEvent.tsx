import { Button, Form, Input, InputNumber, Steps, Upload } from 'antd'
import { Rule } from 'rc-field-form/lib/interface'
import { ReactElement, useState } from 'react'

type FormItemConfig = {
  element: ReactElement
  label?: string
  required?: boolean
  help?: string | ReactElement
}

const formItems: { [name: string]: FormItemConfig } = {
  photos: {
    label: 'Fotky z akce',
    element: <Upload listType="picture-card">+</Upload>,
  },
  feedback_link: {
    label: 'Odkaz na zpětnou vazbu',
    help: (
      <i>
        TODO
        <br />
        napsat univerzální heslo a postup přihlášení
      </i>
    ),
    element: <Input />,
  },
  participant_list_scan: {
    label: 'Nahrát sken prezenční listiny',
    element: <Upload listType="picture-card">Nahrát</Upload>,
  },
  documents_scan: {
    label: 'Nahrát sken dokladů',
    element: <Upload listType="picture-card">Nahrát</Upload>,
  },
  bank_account: {
    label: 'číslo účtu k proplacení dokladů',
    element: <Input />,
  },
  work_done_hours: {
    label: 'Odpracováno člověkohodin',
    element: <InputNumber />,
    required: true, // @TODO only required when working event
  },
  work_done_note: {
    label: 'Komentáře k vykonané práci',
    element: <Input.TextArea />,
  },
  participant_list: {
    label: 'Účastnická listina',
    element: (
      <div>
        TODO Here we need a list of registered participants to select those who
        participated
      </div>
    ),
  },
  participant_number_total: {
    label: 'Počet účastníků celkem',
    required: true, // @TODO only at events without attendee list
    element: <InputNumber />,
  },
  participant_number_below_26: {
    label: 'Z toho počet účastníků do 26 let',
    required: true, // @TODO only at events without attendee list
    element: <InputNumber />,
  },
}

const stepConfig: { items: string[] }[] = [
  {
    items: [
      'photos',
      'feedback_link',
      'participant_list_scan',
      'documents_scan',
      'bank_account',
    ],
  },
  {
    items: ['work_done_hours', 'work_done_note'],
  },
  {
    items: [
      'participant_list',
      'participant_number_total',
      'participant_number_below_26',
    ],
  },
]

const CloseEvent = () => {
  const [step, setStep] = useState(0)
  const [form] = Form.useForm()

  const steps = stepConfig.map(({ items }) =>
    items.map(name => {
      const item = formItems[name]
      const required = item.required
        ? [
            {
              required: true,
              message: 'Pole je povinné',
            },
          ]
        : []
      const rules: Rule[] = [...required]
      return (
        <Form.Item
          key={name}
          name={name}
          label={item?.label}
          tooltip={item?.help}
          rules={rules}
        >
          {item.element}
        </Form.Item>
      )
    }),
  )

  return (
    <>
      <Form
        form={form}
        onFieldsChange={a => console.log(a)}
        onValuesChange={b => console.log(b)}
      >
        {steps.map((children, index) => (
          <div
            style={{
              display: step === index ? 'block' : 'none',
            }}
            key={index}
          >
            {children}
          </div>
        ))}
        <div className="steps-action">
          {step > 0 && (
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => setStep(step => step - 1)}
            >
              Zpět
            </Button>
          )}
          {step < steps.length - 1 && (
            <Button type="primary" onClick={() => setStep(step => step + 1)}>
              Dál
            </Button>
          )}
          {step === steps.length - 1 && <Button type="primary">Hotovo</Button>}
        </div>
        <Steps current={step}>
          {steps.map((_, index) => (
            <Steps.Step key={index} />
          ))}
        </Steps>
      </Form>
    </>
  )
}

export default CloseEvent
/*
Údaje , které je třeba zadat po akci:
Fotky z akce
Odkaz na zpětnou vazbu
Nahrát sken prezenční listiny
Nahrát sken dokladů
číslo účtu k proplacení dokladů

Evidence práce
Odpracováno člověkohodin (*)
Číslo 
Fce: propíše se do statistik základních článků – kolik který článek odpracoval na akcích
Komentáře k vykonané práci
Počet účastníků celkem *
Z toho počet účastníků do 26 let *
Jooo, tak na tohle jsem se přesně ptal předminule, ale nějak jsme se k tomu nedopracovali, teď si vzpomínám...tohle jde taky do nějakých vašich statistik a chtěli jste to takto:

Aby tam byl jednak 1) počet user profiles si interakcí "účast na akci" a vedle toho ještě 2) NumField, kam se dá ručně napsat počet účastníků (když nejsou evidováni)

A to samé pak ještě jednou pro ty mladší 26 let (tam by to bylo počet userů s interakcí "účast na akci", kteří jsou navíc mladší 26 let + NumField pro ruční zadání).

*/
