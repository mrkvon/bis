import { Input, InputNumber, Upload } from 'antd'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  readEvent,
  selectEvent,
  selectStatus,
  setStatus,
  updateEvent,
} from './eventSlice'
import StepForm, { FormConfig, StepConfig } from './StepForm'
import { AfterEventProps, BeforeEventProps, EventProps } from './types'

const formItems: FormConfig<AfterEventProps, never> = {
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
      (initialData as EventProps).eventType === 'dobrovolnicka',
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
      (initialData as BeforeEventProps).basicPurpose === 'action',
    element: <InputNumber />,
  },
  participantNumberBelow26: {
    label: 'Z toho počet účastníků do 26 let',
    required: true,
    display: (form, initialData) =>
      (initialData as BeforeEventProps).basicPurpose === 'action',
    element: <InputNumber />,
  },
}

const stepConfig: StepConfig<AfterEventProps, never>[] = [
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

const CloseEvent = () => {
  const dispatch = useAppDispatch()
  const eventId = Number(useParams().eventId)
  const eventData = useAppSelector(state => selectEvent(state, eventId))
  const status = useAppSelector(selectStatus)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(readEvent(eventId))
  }, [eventId, dispatch])

  useEffect(() => {
    if (status === 'finished') {
      dispatch(setStatus('input'))
      navigate('/events')
    }
  }, [status, eventId, dispatch, navigate])

  if (!eventData) return <div>Event Not Found</div>

  return (
    <>
      <h2 className="mb-8 text-xl font-bold">Uzavřít akci {eventData.name}</h2>
      <StepForm
        steps={stepConfig}
        formItems={formItems}
        initialData={eventData}
        onFinish={(values: AfterEventProps) =>
          dispatch(updateEvent({ id: eventId, ...values }))
        }
      />
    </>
  )
}

export default CloseEvent
