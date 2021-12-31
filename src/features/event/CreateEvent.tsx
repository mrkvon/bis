import {
  DatePicker,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Space,
  TimePicker,
  Upload,
} from 'antd'
import moment from 'moment'
import { FC, useEffect } from 'react'
import { useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { store } from '../../app/store'
import { selectPerson } from '../person/personSlice'
import { Person } from '../person/types'
import EditLocation from './EditLocation'
import { createEvent, readEvent, selectEvent } from './eventSlice'
import { QualifiedPersonLabel } from './PersonOptionLabel'
import { getIsQualified } from './qualifications'
import SelectAdministrativeUnit from './SelectAdministrativeUnit'
import SelectPerson from './SelectPerson'
import StepForm, { FormConfig, FormItemConfig, StepConfig } from './StepForm'
import {
  audiences,
  basicPurposes,
  BeforeEventProps,
  diets,
  eventTypes,
  programs,
  registrationMethods,
} from './types'

const DateRangeStringPicker: FC<{
  value?: [string, string] | null
  onChange?: (range: [string, string] | null) => void
}> = ({ value = null, onChange = () => null }) => {
  return (
    <DatePicker.RangePicker
      value={value ? [moment(value[0]), moment(value[1])] : null}
      onChange={range =>
        onChange(
          range && range[0] && range[1]
            ? [range[0].format('YYYY-MM-DD'), range[1].format('YYYY-MM-DD')]
            : null,
        )
      }
    />
  )
}

const { Option } = Select

type AdditionalQuestionType =
  | 'additionalQuestion1'
  | 'additionalQuestion2'
  | 'additionalQuestion3'
  | 'additionalQuestion4'
  | 'additionalQuestion5'
  | 'additionalQuestion6'
  | 'additionalQuestion7'
  | 'additionalQuestion8'

const additionalQuestions: {
  [name in AdditionalQuestionType]: FormItemConfig<BeforeEventProps>
} = Object.fromEntries(
  [1, 2, 3, 4, 5, 6, 7, 8].map(i => [
    `additionalQuestion${i}` as AdditionalQuestionType,
    {
      label: `Otázka ${i}`,
      required: true,
      display: form => form.registrationMethod === 'standard',
      element: <Input />,
    },
  ]),
) as {
  [name in AdditionalQuestionType]: FormItemConfig<BeforeEventProps>
}

const formItems: FormConfig<BeforeEventProps, 'newcomerInfo'> = {
  basicPurpose: {
    required: true,
    element: (
      <Radio.Group>
        <Space direction="vertical">
          {Object.entries(basicPurposes).map(([value, name]) => (
            <Radio.Button value={value} key={value}>
              {name}
            </Radio.Button>
          ))}
        </Space>
      </Radio.Group>
    ),
  },
  name: {
    label: 'Název',
    required: true,
    element: <Input />,
  },
  dateFromTo: {
    label: 'Od - Do',
    required: true,
    element: <DateRangeStringPicker />,
  },
  startTime: {
    label: 'Začátek akce',
    required: true,
    element: <TimePicker format="HH:mm" />,
  },
  repetitions: {
    // @TODO not defined in API
    label: 'Počet akcí v uvedeném období',
    required: true,
    help: 'Používá se u opakovaných akcí (typicky oddílové schůzky). U klasické jednorázové akce zde nechte jedničku.',
    element: <InputNumber />,
  },
  eventType: {
    label: 'Typ akce',
    required: true,
    element: (
      <Select>
        {Object.entries(eventTypes).map(([value, label]) => (
          <Option key={value} value={value}>
            {label}
          </Option>
        ))}
      </Select>
    ),
  },
  program: {
    label: 'Program',
    required: true,
    element: (
      <Select>
        {Object.entries(programs).map(([value, name]) => (
          <Option key={value} value={value}>
            {name}
          </Option>
        ))}
      </Select>
    ),
  },
  intendedFor: {
    label: 'Pro koho',
    required: true,
    element: (
      <Select>
        {Object.entries(audiences).map(([value, name]) => (
          <Option key={value} value={value}>
            {name}
          </Option>
        ))}
      </Select>
    ),
  },
  // the exluded stuff doesn't become a part of the form
  newcomerInfo: {
    excluded: true,
    display: form => form.intendedFor === 'newcomers',
    element: (
      <small>
        <p className="mb-4">
          Hnutí Brontosaurus pravidelně vytváří nabídku výběrových
          dobrovolnických akcí, kterými oslovujeme nové účastníky, zejména
          středoškolskou mládež a začínající vysokoškoláky (15 - 26 let). Cílem
          akce je oslovit tyto prvoúčastníky a mít jich nejlépe polovinu, (min.
          třetinu) z celkového počtu účastníků.
        </p>
        <p className="mb-4">Zadáním akce pro prvoúčastníky získáte:</p>
        <p className="mb-4">
          <ul className="list-disc ml-6">
            <li>
              Širší propagaci skrze letáky, osobní kontakty apod. Zveřejnění na
              letáku VIP propagace.
            </li>
            <li>
              Propagaci na programech pro střední školy - lektoři budou osobně
              na akce zvát.
            </li>
            <li>
              Zveřejnění na Facebooku a Instagramu HB a reklamu na Facebooku
            </li>
            <li>Reklamu v Google vyhledávání</li>
            <li>Služby grafika HB (dle dohodnutého rozsahu)</li>
            <li>Přidání do webových katalogů akcí </li>
            <li>Slevu na inzerci v Roverském kmenu (pro tábory)</li>
            <li>Zpětnou vazbu k webu a Facebooku akce</li>
            <li>Metodickou pomoc a pomoc s agendou akce</li>
            <li>Propagace na novém webu HB v sekci Jedu poprvé</li>
          </ul>
        </p>
      </small>
    ),
  },
  newcomerText1: {
    label: 'Cíle akce a přínos pro prvoúčastníky',
    help: 'Jaké je hlavní téma vaší akce? Jaké jsou hlavní cíle akce? Co nejvýstižněji popište, co akce přináší účastníkům, co zajímavého si zkusí, co se dozví, naučí, v čem se rozvinou…',
    display: form => form.intendedFor === 'newcomers',
    element: <Input.TextArea />,
  },
  newcomerText2: {
    label: 'Programové pojetí akce pro prvoúčastníky',
    help: 'V základu uveďte, jak bude vaše akce programově a dramaturgicky koncipována (motivační příběh, zaměření programu – hry, diskuse, řemesla,...). Uveďte, jak náplň a program akce reflektují potřeby vaší cílové skupiny prvoúčastníků.',
    display: form => form.intendedFor === 'newcomers',
    element: <Input.TextArea />,
  },
  newcomerText3: {
    label: 'Krátký zvací text do propagace',
    help: 'Ve 2-4 větách nalákejte na vaši akci a zdůrazněte osobní přínos pro účastníky (max. 200 znaků)',
    display: form => form.intendedFor === 'newcomers',
    element: <Input.TextArea />,
    rules: [
      {
        max: 200,
        message: 'max 200 znaků',
      },
    ],
  },
  administrativeUnit: {
    label: 'Pořádající ZČ/Klub/RC/ústředí',
    required: true,
    element: <SelectAdministrativeUnit />,
  },
  location: {
    label: 'Vybrat místo akce na mapě',
    required: form => form.basicPurpose === 'camp',
    element: <EditLocation className="h-56 w-56" />,
  },
  locationInfo: {
    label: 'Místo konání akce',
    help: 'název/popis místa, kde se akce koná',
    required: true,
    element: <Input.TextArea />,
  },
  targetMembers: {
    label: 'Na koho je akce zaměřená',
    required: true,
    element: (
      <Radio.Group
        options={[
          { label: 'Na členy', value: true },
          { label: 'Na nečleny', value: false },
        ]}
        optionType="button"
      />
    ),
  },
  advertiseInRoverskyKmen: {
    label: 'Propagovat akci v Roverském kmeni',
    display: form => form.basicPurpose === 'camp',
    required: true,
    element: (
      <Radio.Group
        options={[
          { label: 'Ano', value: true },
          { label: 'Ne', value: false },
        ]}
        optionType="button"
      />
    ),
  },
  advertiseInBrontoWeb: {
    label: 'Zveřejnit na brontosauřím webu',
    required: true,
    element: (
      <Radio.Group
        options={[
          { label: 'Ano', value: true },
          { label: 'Ne', value: false },
        ]}
        optionType="button"
      />
    ),
  },
  registrationMethod: {
    label: 'Způsob přihlášení',
    required: true,
    element: (
      <Select>
        {Object.entries(registrationMethods).map(([value, label]) => (
          <Option key={value} value={value}>
            {label}
          </Option>
        ))}
      </Select>
    ),
  },
  registrationMethodFormUrl: {
    label: 'Odkaz na elektronickou přihlášku',
    required: true,
    display: form => form.registrationMethod === 'other_electronic',
    element: <Input />,
  },
  registrationMethodEmail: {
    label: 'Přihlašovací email',
    required: true,
    display: form => form.registrationMethod === 'by_email',
    element: <Input type="email" />,
  },
  ...additionalQuestions,
  participationFee: {
    label: 'Účastnický poplatek (CZK)',
    required: true,
    element: <Input />,
  },
  age: {
    label: 'Věk',
    required: true,
    element: (
      <Slider range defaultValue={[0, 100]} marks={{ 0: 0, 100: 100 }} />
    ),
  },
  accommodation: {
    label: 'Ubytování',
    required: true,
    display: form =>
      form.basicPurpose === 'camp' ||
      form.basicPurpose === 'action-with-attendee-list',
    element: <Input />,
  },
  diet: {
    label: 'Strava',
    required: true,
    display: form =>
      form.basicPurpose === 'camp' ||
      form.basicPurpose === 'action-with-attendee-list',
    element: (
      <Select mode="multiple">
        {Object.entries(diets).map(([value, name]) => (
          <Option key={value} value={value}>
            {name}
          </Option>
        ))}
      </Select>
    ),
  },
  workingHours: {
    label: 'Pracovní doba',
    display: form => form.basicPurpose === 'camp',
    element: <InputNumber />,
  },
  workingDays: {
    label: 'Počet pracovních dní na akci',
    display: form => form.basicPurpose === 'camp',
    element: <InputNumber />,
  },
  contactPersonName: {
    label: 'Jméno kontaktní osoby',
    required: true,
    element: <Input />,
  },
  contactPersonEmail: {
    label: 'Kontaktní email',
    required: true,
    element: <Input />,
  },
  contactPersonTelephone: {
    label: 'Kontaktní telefon',
    element: <Input />,
  },
  webUrl: {
    label: 'Web o akci',
    help: 'Web akce (v případě že nějaký existuje)',
    element: <Input />,
  },
  note: {
    label: 'Poznámka',
    help: 'vidí jenom lidé s přístupem do BISu, kteří si akci prohlížejí přímo v systému',
    element: <Input.TextArea />,
  },
  responsiblePerson: {
    label: 'Hlavní organizátor/ka',
    required: true,
    element: ({ basicPurpose, eventType, intendedFor }) => (
      <SelectPerson
        LabelComponent={QualifiedPersonLabel}
        getDisabled={(person: Person) =>
          !getIsQualified(
            { basicPurpose, eventType, intendedFor },
            person.qualifications,
          )
        }
      />
    ),
    rules: [
      ({ getFieldValue }) => ({
        validator: async (_, personId) => {
          const intendedFor = getFieldValue('intendedFor')
          const eventType = getFieldValue('eventType')
          const basicPurpose = getFieldValue('basicPurpose')
          if (!basicPurpose) throw new Error('Vyplňte nejdřív Druh akce')
          if (!eventType) throw new Error('Vyplňte nejdřív Typ akce')
          if (!intendedFor)
            throw new Error('Vyplňte nejdřív Pro koho je akce určena')
          // get the person from id
          const state = store.getState()
          const person = selectPerson(state, personId)
          if (!person) throw new Error('Člověk nenalezen')
          const isQualified = getIsQualified(
            { basicPurpose, eventType, intendedFor },
            person.qualifications,
          )
          if (!isQualified)
            throw new Error(
              `${person.givenName} ${person.familyName} nemá dostatečnou kvalifikaci`,
            )
        },
      }),
    ],
  },
  team: {
    label: 'Organizační tým',
    element: <SelectPerson multiple />,
  },
  invitationText1: {
    label: 'Zvací text: Co nás čeká',
    required: true,
    element: <Input.TextArea />,
  },
  invitationText2: {
    label: 'Zvací text: Co, kde a jak',
    required: true,
    element: <Input.TextArea />,
  },
  invitationText3: {
    label: 'Zvací text: dobrovolnická pomoc',
    required: form => form.eventType === 'dobrovolnicka',
    element: <Input.TextArea />,
  },
  invitationText4: {
    label: 'Zvací text: Malá ochutnávka',
    required: true,
    element: <Input.TextArea />,
  },
  mainPhoto: {
    label: 'Hlavní fotka',
    help: 'Foto se zobrazí v rámečku akce, jako hlavní fotka',
    required: true,
    element: <Upload listType="picture-card">+</Upload>,
    // @TODO or allow adding url to a picture
  },
  additionalPhotos: {
    label: 'Fotky k malé ochutnávce',
    help: 'Zobrazí se pod textem „Zvací text: Malá ochutnávka“',
    element: <Upload listType="picture-card">+</Upload>,
    // @TODO or allow adding url to a picture
  },
}

const stepConfig: StepConfig<BeforeEventProps, 'newcomerInfo'>[] = [
  { title: 'Druh', items: ['basicPurpose'] },
  {
    title: 'Typ',
    items: [
      'eventType',
      'program',
      'administrativeUnit',
      'intendedFor',
      'newcomerInfo',
      'newcomerText1',
      'newcomerText2',
      'newcomerText3',
    ],
  },
  {
    title: 'Info',
    items: ['name', 'dateFromTo', 'startTime', 'repetitions'],
  },
  { title: 'Místo', items: ['location', 'locationInfo'] },

  { title: 'Tým', items: ['responsiblePerson', 'team'] },
  {
    title: 'Registrace',
    items: [
      'registrationMethod',
      'registrationMethodEmail',
      'registrationMethodFormUrl',
      'additionalQuestion1',
      'additionalQuestion2',
      'additionalQuestion3',
      'additionalQuestion4',
      'additionalQuestion5',
      'additionalQuestion6',
      'additionalQuestion7',
      'additionalQuestion8',
    ],
  },
  {
    title: 'Podrobnosti',
    items: [
      'targetMembers',
      'advertiseInRoverskyKmen',
      'advertiseInBrontoWeb',
      'participationFee',
      'age',
      'accommodation',
      'diet',
      'workingHours',
      'workingDays',
    ],
  },
  {
    title: 'Kontakt',
    items: [
      'contactPersonName',
      'contactPersonEmail',
      'contactPersonTelephone',
      'webUrl',
      'note',
    ],
  },
  {
    title: 'Pozvánka',
    items: [
      'invitationText1',
      'invitationText2',
      'invitationText3',
      'invitationText4',
      'mainPhoto',
      'additionalPhotos',
    ],
  },
]

const findUnusedFields = () => {
  const defined = Object.keys(formItems) as (keyof typeof formItems)[]
  const used = stepConfig.map(({ items }) => items).flat()
  const unused = defined.filter(a => !used.includes(a))
  return unused
}

console.log(findUnusedFields())

/*  TODO this just needs more attention. The logic of updating seems a bit broken.
 */
const CreateEvent = () => {
  const dispatch = useAppDispatch()
  const eventId = Number(useParams()?.eventId ?? -1)
  const cloneEventId = Number(useSearchParams()[0].get('cloneEvent') ?? -1)

  const event = useAppSelector(state => selectEvent(state, eventId))
  /* TODO figure out which fields to clone */
  const cloneEvent = useAppSelector(state => selectEvent(state, cloneEventId))
  const status = useAppSelector(state => state.event.loadingStatus)

  useEffect(() => {
    if (eventId >= 0) dispatch(readEvent(eventId))
  }, [eventId, dispatch])

  if (status === 'loading') return <div>Loading</div>

  /* TODO when we're updating, we need to dispatch update, not create. */
  return (
    <StepForm
      steps={stepConfig}
      formItems={formItems}
      onFinish={values => dispatch(createEvent(values))}
      initialFormData={event ?? cloneEvent}
    />
  )
}

export default CreateEvent
