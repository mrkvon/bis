import { Input, InputNumber, Upload } from 'antd'
import { CreateEventForm } from './CreateEvent'
import StepForm, { FormConfig, StepConfig } from './StepForm'

interface CloseEventForm {
  photos: string[]
  feedbackLink: string
  participantListScan: string
  documentsScan: string[]
  bankAccount: string
  workDoneHours: number
  workDoneNote: string
  participantNumberTotal: number
  participantNumberBelow26: number
  participantList: string[]
}

const formItems: FormConfig<CloseEventForm, never> = {
  photos: {
    label: 'Fotky z akce',
    element: <Upload listType="picture-card">+</Upload>,
  },
  feedbackLink: {
    label: 'Odkaz na zpětnou vazbu',
    help: '@TODO napsat univerzální heslo a postup přihlášení',
    element: <Input />,
  },
  participantListScan: {
    label: 'Nahrát sken prezenční listiny',
    element: <Upload listType="picture-card">Nahrát</Upload>,
  },
  documentsScan: {
    label: 'Nahrát sken dokladů',
    element: <Upload listType="picture-card">Nahrát</Upload>,
  },
  bankAccount: {
    label: 'číslo účtu k proplacení dokladů',
    element: <Input />,
  },
  workDoneHours: {
    label: 'Odpracováno člověkohodin',
    element: <InputNumber />,
    required: (form, initialData) =>
      (initialData as CreateEventForm).eventType === 'dobrovolnicka',
  },
  workDoneNote: {
    label: 'Komentáře k vykonané práci',
    element: <Input.TextArea />,
  },
  participantList: {
    label: 'Účastnická listina',
    element: (
      <div>
        TODO Here we need a list of registered participants to select those who
        participated
      </div>
    ),
  },
  participantNumberTotal: {
    label: 'Počet účastníků celkem',
    required: true,
    display: (form, initialData) =>
      (initialData as CreateEventForm).basicPurpose === 'action',
    element: <InputNumber />,
  },
  participantNumberBelow26: {
    label: 'Z toho počet účastníků do 26 let',
    required: true,
    display: (form, initialData) =>
      (initialData as CreateEventForm).basicPurpose === 'action',
    element: <InputNumber />,
  },
}

const stepConfig: StepConfig<CloseEventForm, never>[] = [
  {
    title: 'Účastníci',
    items: [
      'participantList',
      'participantNumberTotal',
      'participantNumberBelow26',
    ],
  },
  {
    title: 'Práce',
    items: ['workDoneHours', 'workDoneNote'],
  },
  {
    title: 'Informace',
    items: [
      'photos',
      'feedbackLink',
      'participantListScan',
      'documentsScan',
      'bankAccount',
    ],
  },
]

const CloseEvent = () => (
  <StepForm
    steps={stepConfig}
    formItems={formItems}
    initialData={{ eventType: 'dobrovolnicka', basicPurpose: 'action' }}
  />
)

export default CloseEvent
