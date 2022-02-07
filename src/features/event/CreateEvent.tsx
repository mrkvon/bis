import { QuestionCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Space,
  Steps,
  Tooltip,
  Upload,
} from 'antd'
import { FormInstance } from 'antd/es/form/Form'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { store } from '../../app/store'
import { html2plaintext } from '../../helpers'
import { selectPerson } from '../person/personSlice'
import { Person } from '../person/types'
import DateRangeStringPicker from './DateRangeStringPicker'
import EditLocation from './EditLocation'
import { createEvent, readEvent, selectEvent, updateEvent } from './eventSlice'
import { QualifiedPersonLabel } from './PersonOptionLabel'
import { getIsQualified } from './qualifications'
import RichTextEditor from './RichTextEditor'
import SelectAdministrativeUnit from './SelectAdministrativeUnit'
import SelectPerson from './SelectPerson'
import TimeStringPicker from './TimeStringPicker'
import {
  audiences,
  basicPurposes,
  diets,
  EventProps,
  eventTypes,
  programs,
  registrationMethods,
} from './types'

const getStepStatus = (
  form: FormInstance<FormEventProps>,
  items: string[],
): 'finish' | 'error' | 'wait' => {
  const states = items.map(name => {
    if (!form.getFieldInstance(name)) return 'none'
    else if (form.getFieldError(name).length > 0) return 'error'
    else if (form.isFieldTouched(name)) return 'touched'
  })
  if (states.every(state => state === 'touched')) return 'finish'
  if (states.includes('error')) return 'error'
  else return 'finish'
}
/*
const isItemValid = function (
  name: string,
  form: FormInstance<BeforeEventProps>,
  initialData: unknown,
) {
  const itemExists = !!form.getFieldInstance(name)
  const isItemTouched = form.isFieldTouched(name)
  const hasItemErrors = form.getFieldError(name).length > 0

  // success
  // item doesn't exist (nothing to validate)
  // OR
  // item exists and doesn't have errors AND (is touched OR is not required)
  // because we want every required field touched
  const isValid = !itemExists || (!hasItemErrors && isItemTouched)

  return isValid
}

const isStepValid = function <T>(
  step: Extract<keyof T, string>[],
  formConfig: FormConfig<T, never>,
  form: FormInstance<T>,
  initialData: unknown,
) {
  return step.every(name => isItemValid(name, formConfig, form, initialData))
}
*/

type Reshape<A, B> = {
  forward: (a: A) => B
  reverse: (b: B) => A
}

type FormEventProps = Omit<
  EventProps,
  'dateFrom' | 'dateTo' | 'ageFrom' | 'ageTo' | 'location'
> & {
  dateFromTo: [string, string]
  age: [number, number]
  location: [number | undefined, number | undefined] | undefined
}

const reshape: Reshape<EventProps, FormEventProps> = {
  forward: ({
    dateFrom,
    dateTo,
    ageFrom,
    ageTo,
    location,
    ...event
  }: EventProps) => {
    return {
      dateFromTo: [dateFrom, dateTo],
      age: [ageFrom, ageTo],
      location:
        location && location.gpsLatitude && location.gpsLongitude
          ? [location.gpsLatitude, location.gpsLongitude]
          : undefined,
      ...event,
    }
  },
  reverse: ({
    dateFromTo: [dateFrom, dateTo],
    age: [ageFrom, ageTo],
    location: [gpsLatitude, gpsLongitude] = [undefined, undefined],
    ...event
  }: ReturnType<typeof reshape.forward>): EventProps => {
    return {
      dateFrom,
      dateTo,
      ageFrom,
      ageTo,
      location: { gpsLatitude, gpsLongitude },
      ...event,
    }
  },
}

const CreateEvent = () => {
  const [step, setStep] = useState(0)
  const [form] = Form.useForm<ReturnType<typeof reshape.forward>>()
  const dispatch = useAppDispatch()
  const eventId = Number(useParams()?.eventId ?? -1)
  const cloneEventId = Number(useSearchParams()[0].get('cloneEvent') ?? -1)

  const event = useAppSelector(state =>
    selectEvent(state, eventId >= 0 ? eventId : cloneEventId),
  )

  const isUpdating = eventId > 0

  useEffect(() => {
    if (event) {
      form.setFieldsValue(reshape.forward(event))
      form.validateFields()
    }
  }, [event, form])

  const status = useAppSelector(state => state.event.loadingStatus)

  useEffect(() => {
    if (eventId >= 0) dispatch(readEvent(eventId))
    if (cloneEventId >= 0) dispatch(readEvent(cloneEventId))
  }, [eventId, cloneEventId, dispatch])

  if (status === 'loading') return <div>Loading</div>

  /* TODO when we're updating, we need to dispatch update, not create. */

  const steps = [
    {
      title: 'Druh',
      element: (
        <Form.Item name="basicPurpose" rules={[{ required: true }]}>
          <Radio.Group>
            <Space direction="vertical">
              {Object.entries(basicPurposes).map(([value, name]) => (
                <Radio.Button value={value} key={value}>
                  {name}
                </Radio.Button>
              ))}
            </Space>
          </Radio.Group>
        </Form.Item>
      ),
      items: ['basicPurpose'],
    },
    {
      title: 'Typ',
      element: (
        <>
          <Form.Item
            name="eventType"
            label="Typ akce"
            rules={[{ required: true }]}
          >
            <Select>
              {Object.entries(eventTypes).map(([value, label]) => (
                <Select.Option key={value} value={value}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="program"
            label="Program"
            rules={[{ required: true }]}
          >
            <Select>
              {Object.entries(programs).map(([value, name]) => (
                <Select.Option key={value} value={value}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="administrativeUnit"
            label="Pořádající ZČ/Klub/RC/ústředí"
            rules={[{ required: true }]}
          >
            <SelectAdministrativeUnit />
          </Form.Item>
          <Form.Item
            name="intendedFor"
            label="Pro koho"
            tooltip="vyberte na koho je akce zaměřená"
            rules={[{ required: true }]}
          >
            <Select>
              {Object.entries(audiences).map(([value, name]) => (
                <Select.Option key={value} value={value}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item shouldUpdate>
            {() =>
              form.getFieldValue('intendedFor') === 'newcomers' ? (
                <>
                  <small>
                    <p className="mb-4">
                      Hnutí Brontosaurus pravidelně vytváří nabídku výběrových
                      dobrovolnických akcí, kterými oslovujeme nové účastníky,
                      zejména středoškolskou mládež a začínající vysokoškoláky
                      (15 - 26 let). Cílem akce je oslovit tyto prvoúčastníky a
                      mít jich nejlépe polovinu, (min. třetinu) z celkového
                      počtu účastníků.
                    </p>
                    <p className="mb-4">
                      Zadáním akce pro prvoúčastníky získáte:
                    </p>
                    <p className="mb-4">
                      <ul className="list-disc ml-6">
                        <li>
                          Širší propagaci skrze letáky, osobní kontakty apod.
                          Zveřejnění na letáku VIP propagace.
                        </li>
                        <li>
                          Propagaci na programech pro střední školy - lektoři
                          budou osobně na akce zvát.
                        </li>
                        <li>
                          Zveřejnění na Facebooku a Instagramu HB a reklamu na
                          Facebooku
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

                  <Form.Item
                    name="newcomerText1"
                    label="Cíle akce a přínos pro prvoúčastníky"
                    tooltip="Jaké je hlavní téma vaší akce? Jaké jsou hlavní cíle akce? Co nejvýstižněji popište, co akce přináší účastníkům, co zajímavého si zkusí, co se dozví, naučí, v čem se rozvinou…"
                  >
                    <Input.TextArea />
                  </Form.Item>

                  <Form.Item
                    name="newcomerText2"
                    label="Programové pojetí akce pro prvoúčastníky"
                    tooltip="V základu uveďte, jak bude vaše akce programově a dramaturgicky koncipována (motivační příběh, zaměření programu – hry, diskuse, řemesla,...). Uveďte, jak náplň a program akce reflektují potřeby vaší cílové skupiny prvoúčastníků."
                  >
                    <Input.TextArea />
                  </Form.Item>

                  <Form.Item
                    name="newcomerText3"
                    label="Krátký zvací text do propagace"
                    tooltip="Ve 2-4 větách nalákejte na vaši akci a zdůrazněte osobní přínos pro účastníky (max. 200 znaků)"
                    rules={[
                      {
                        max: 200,
                        message: 'max 200 znaků',
                      },
                    ]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                </>
              ) : null
            }
          </Form.Item>
        </>
      ),
      items: [
        'eventType',
        'program',
        'administrativeUnit',
        'intendedFor',
        'newcomerText1',
        'newcomerText2',
        'newcomerText3',
      ],
    },
    {
      title: 'Info',
      element: (
        <>
          <Form.Item name="name" label="Název" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="dateFromTo"
            label="Od - Do"
            rules={[{ required: true }]}
          >
            <DateRangeStringPicker />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="Začátek akce"
            rules={[{ required: true }]}
          >
            <TimeStringPicker />
          </Form.Item>
          <Form.Item
            name="repetitions"
            label="Počet akcí v uvedeném období"
            tooltip="Používá se u opakovaných akcí (např. oddílové schůzky). U klasické jednorázové akce zde nechte jedničku."
            rules={[{ required: true }]}
          >
            <InputNumber />
          </Form.Item>
        </>
      ),
      items: ['name', 'dateFromTo', 'startTime', 'repetitions'],
    },
    {
      title: 'Místo',
      element: (
        <>
          <Form.Item shouldUpdate>
            {() => (
              <Form.Item
                name="location"
                label="Vybrat místo akce na mapě"
                required={form.getFieldValue('basicPurpose') === 'camp'}
              >
                <EditLocation className="h-56 w-56" />
              </Form.Item>
            )}
          </Form.Item>
          <Form.Item
            name="locationInfo"
            label="Místo konání akce"
            tooltip="název/popis místa, kde se akce koná"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
        </>
      ),
      items: ['location', 'locationInfo'],
    },

    {
      title: 'Tým',
      element: (
        <>
          <Form.Item shouldUpdate>
            {() => (
              <Form.Item
                name="responsiblePerson"
                label="Hlavní organizátor/ka"
                tooltip="Hlavní organizátor musí mít náležité kvalifikace a za celou akci zodpovídá. Je nutné zadávat hlavního organizátora do BIS před akcí, aby měl automaticky sjednané pojištění odpovědnosti za škodu a úrazové pojištění."
                rules={[
                  { required: true },
                  ({ getFieldValue }) => ({
                    validator: async (_, personId) => {
                      const intendedFor = getFieldValue('intendedFor')
                      const eventType = getFieldValue('eventType')
                      const basicPurpose = getFieldValue('basicPurpose')
                      if (!basicPurpose)
                        throw new Error('Vyplňte nejdřív Druh akce')
                      if (!eventType)
                        throw new Error('Vyplňte nejdřív Typ akce')
                      if (!intendedFor)
                        throw new Error(
                          'Vyplňte nejdřív Pro koho je akce určena',
                        )
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
                ]}
              >
                <SelectPerson
                  LabelComponent={QualifiedPersonLabel}
                  getDisabled={(person: Person) =>
                    !getIsQualified(
                      {
                        basicPurpose: form.getFieldValue('basicPurpose'),
                        eventType: form.getFieldValue('eventType'),
                        intendedFor: form.getFieldValue('intendedFor'),
                      },
                      person.qualifications,
                    )
                  }
                />
              </Form.Item>
            )}
          </Form.Item>
          <Form.Item
            name="team"
            label="Organizační tým"
            tooltip="Vyberte jména dalších organizátorů. Organizátory je možné ještě připojistit na úrazové pojištění a pojištění odpovědnosti za škodu."
          >
            <SelectPerson multiple />
          </Form.Item>
        </>
      ),
      items: ['responsiblePerson', 'team'],
    },
    {
      title: 'Registrace',
      element: (
        <>
          <Form.Item
            name="registrationMethod"
            label="Způsob přihlášení"
            tooltip="Způsoby přihlášení na vaši akci na www.brontosaurus.cz, které se zobrazí po kliknutí na tlačítko “chci jet”"
            rules={[{ required: true }]}
          >
            <Select>
              {Object.entries(registrationMethods).map(
                ([value, { label, help }]) => (
                  <Select.Option key={value} value={value} tooltip={help}>
                    <span className="flex items-center gap-1">
                      {label}{' '}
                      <Tooltip title={help}>
                        <QuestionCircleOutlined className="cursor-help" />
                      </Tooltip>
                    </span>
                  </Select.Option>
                ),
              )}
            </Select>
          </Form.Item>
          <Form.Item shouldUpdate>
            {() => {
              switch (form.getFieldValue('registrationMethod')) {
                case 'other_electronic':
                  return (
                    <Form.Item
                      name="entryFormUrl"
                      label="Odkaz na elektronickou přihlášku"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                  )
                case 'by_email':
                  return (
                    <Form.Item
                      name="registrationMethodEmail"
                      label="Přihlašovací email"
                      rules={[{ required: true }]}
                    >
                      <Input type="email" />
                    </Form.Item>
                  )
                case 'standard':
                  return [1, 2, 3, 4].map(i => (
                    <Form.Item
                      key={i}
                      name={`additionalQuestion${i}`}
                      label={`Otázka ${i}`}
                      tooltip="Zde můžeš připsat svoje doplňující otázky pro účastníky, které se zobrazí u standardní přihlášky na brontowebu"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                  ))
                default:
                  return null
              }
            }}
          </Form.Item>
        </>
      ),
      items: [
        'registrationMethod',
        'registrationMethodEmail',
        'entryFormUrl',
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
      element: (
        <>
          <Form.Item
            name="targetMembers"
            label="Na koho je akce zaměřená"
            tooltip="Akce zaměřená na členy jsou interní akce HB - valné hromady, týmovky atd."
            rules={[{ required: true }]}
          >
            <Radio.Group
              options={[
                { label: 'Na členy', value: true },
                { label: 'Na nečleny', value: false },
              ]}
              optionType="button"
            />
          </Form.Item>
          <Form.Item shouldUpdate>
            {() =>
              form.getFieldValue('basicPurpose') === 'camp' ? (
                <Form.Item
                  name="advertiseInRoverskyKmen"
                  label="Propagovat akci v Roverském kmeni"
                  tooltip="Placená propagace vaší vícedenní akce v časopisu Roverský kmen za poplatek 100 Kč."
                  rules={[{ required: true }]}
                >
                  <Radio.Group
                    options={[
                      { label: 'Ano', value: true },
                      { label: 'Ne', value: false },
                    ]}
                    optionType="button"
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>
          <Form.Item
            name="advertiseInBrontoWeb"
            label="Zveřejnit na brontosauřím webu"
            tooltip="Pokud zaškrtnete ano, akce se zobrazí na webu www. brontosaurus.cz. Volbu ne zaškrtněte pouze jedná-li se o interní akci HB nebo interní akci Brďa."
            rules={[{ required: true }]}
          >
            <Radio.Group
              options={[
                { label: 'Ano', value: true },
                { label: 'Ne', value: false },
              ]}
              optionType="button"
            />
          </Form.Item>
          <Form.Item
            name="participationFee"
            label="Účastnický poplatek (CZK)"
            tooltip="Napište pouze částku, znak Kč se na webu zobrazí automaticky. Pokud máte více druhů poplatků, jejich výši napište za lomítko např. 150/200/250"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="age" label="Věk" rules={[{ required: true }]}>
            <Slider range defaultValue={[0, 100]} marks={{ 0: 0, 100: 100 }} />
          </Form.Item>
          <Form.Item shouldUpdate>
            {() =>
              ['camp', 'action-with-attendee-list'].includes(
                form.getFieldValue('basicPurpose'),
              ) && (
                <>
                  <Form.Item
                    name="accommodation"
                    label="Ubytování"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="diet"
                    label="Strava"
                    rules={[{ required: true }]}
                  >
                    <Select mode="multiple">
                      {Object.entries(diets).map(([value, name]) => (
                        <Select.Option key={value} value={value}>
                          {name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </>
              )
            }
          </Form.Item>
          <Form.Item shouldUpdate>
            {() =>
              form.getFieldValue('basicPurpose') === 'camp' && (
                <>
                  <Form.Item name="workingHours" label="Pracovní doba">
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                    name="workingDays"
                    label="Počet pracovních dní na akci"
                  >
                    <InputNumber />
                  </Form.Item>
                </>
              )
            }
          </Form.Item>
        </>
      ),
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
      element: (
        <>
          <Form.Item
            name="contactPersonName"
            label="Jméno kontaktní osoby"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contactPersonEmail"
            label="Kontaktní email"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="contactPersonTelephone" label="Kontaktní telefon">
            <Input />
          </Form.Item>
          <Form.Item
            name="webUrl"
            label="Web o akci"
            tooltip="Možnost přidat odkaz na webovou stránku vaší akce."
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="note"
            label="Poznámka"
            tooltip="vidí jenom lidé s přístupem do BISu, kteří si akci prohlížejí přímo v systému"
          >
            <Input.TextArea />
          </Form.Item>
        </>
      ),
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
      element: (
        <>
          <Form.Item
            name="invitationText1"
            label="Zvací text: Co nás čeká"
            tooltip="Prvních několik vět se zobrazí v přehledu akcí na webu. První věty jsou k upoutání pozornosti nejdůležitější, proto se na ně zaměřte a shrňte na co se účastníci mohou těšit."
            required
            rules={[
              {
                validator: async (_, html) => {
                  if (html2plaintext(html).trim().length === 0)
                    throw new Error('Pole je povinné')
                },
              },
            ]}
          >
            <RichTextEditor />
          </Form.Item>

          <Form.Item
            name="invitationText2"
            label="Zvací text: Co, kde a jak"
            required
            rules={[
              {
                validator: async (_, html) => {
                  if (html2plaintext(html).trim().length === 0)
                    throw new Error('Pole je povinné')
                },
              },
            ]}
          >
            <RichTextEditor />
          </Form.Item>

          <Form.Item shouldUpdate>
            {() => (
              <Form.Item
                name="invitationText3"
                label="Zvací text: dobrovolnická pomoc"
                required={form.getFieldValue('eventType') === 'dobrovolnicka'}
                rules={[
                  ({ getFieldValue }) => ({
                    validator: async (_, html) => {
                      if (getFieldValue('eventType') !== 'dobrovolnicka') return
                      if (html2plaintext(html).trim().length === 0)
                        throw new Error('Pole je povinné')
                    },
                  }),
                ]}
              >
                <RichTextEditor />
              </Form.Item>
            )}
          </Form.Item>

          <Form.Item
            name="invitationText4"
            label="Zvací text: Malá ochutnávka"
            required
            tooltip="Malá ochutnávka uvádí fotky, které k akci přiložíte"
            rules={[
              {
                validator: async (_, html) => {
                  if (html2plaintext(html).trim().length === 0)
                    throw new Error('Pole je povinné')
                },
              },
            ]}
          >
            <RichTextEditor />
          </Form.Item>

          <Form.Item
            name="mainPhoto"
            label="Hlavní foto"
            tooltip="Hlavní foto se zobrazí v náhledu akce na webu"
            rules={[{ required: true }]}
          >
            <Upload listType="picture-card">+</Upload>
          </Form.Item>
          {
            // @TODO or allow adding url to a picture
          }
          <Form.Item
            name="additionalPhotos"
            label="Fotky k malé ochutnávce"
            tooltip="Další fotky, které se zobrazí u akce."
          >
            <Upload listType="picture-card">+</Upload>
          </Form.Item>
          {
            // @TODO or allow adding url to a picture
          }
        </>
      ),
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

  const validateMessages = {
    required: "Pole '${label}' je povinné!",
  }

  const handleFinish = (formValues: FormEventProps) => {
    const values = reshape.reverse(formValues)
    if (isUpdating) {
      dispatch(updateEvent({ ...values, id: eventId }))
    } else {
      dispatch(createEvent(values))
    }
  }

  return (
    <Form<FormEventProps>
      onFinish={handleFinish}
      form={form}
      layout="vertical"
      validateMessages={validateMessages}
      onValuesChange={value => {
        // if any of the following fields change
        // (intendedFor, eventType, basicPurpose)
        // validate responsiblePerson again
        // because their qualification requirements may have changed
        if (
          ['intendedFor', 'eventType', 'basicPurpose'].some(key =>
            Object.keys(value).includes(key),
          )
        )
          form.validateFields(['responsiblePerson'])
      }}
      initialValues={event}
    >
      <Form.Item shouldUpdate>
        {() => (
          <Steps size="small" current={step} className="mb-8">
            {steps.map(({ title, items }, index) => (
              <>
                <Steps.Step
                  title={title}
                  key={index}
                  onStepClick={i => setStep(i)}
                  status={
                    index === step ? 'process' : getStepStatus(form, items)
                  }
                />
              </>
            ))}
          </Steps>
        )}
      </Form.Item>
      {steps.map(({ element }, index) => (
        <div key={index} className={index !== step ? 'hidden' : undefined}>
          {element}
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
        {step === steps.length - 1 && (
          <Button type="primary" htmlType="submit">
            Hotovo
          </Button>
        )}
      </div>
    </Form>
  )
}

export default CreateEvent
