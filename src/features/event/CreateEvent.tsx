import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Space,
  Steps,
  TimePicker,
  Upload,
  FormInstance,
} from 'antd'
import { Rule } from 'rc-field-form/lib/interface'
import React, { ReactElement, useState } from 'react'
import Location from './Location'

const { Option } = Select

const basicPurposes = {
  'action-with-attendee-list': 'Víkendovka nebo pravidelná akce s adresářem',
  action: 'Jednorázová nebo pravidelná akce bez povinného adresáře',
  camp: 'Vícedenní akce (tábory)',
}

/*
change to name: name, value: slug
*/
const eventTypes = {
  dobrovolnicka: 'Dobrovolnická',
  zazitkova: 'Zážitková',
  sportovni: 'Sportovní',
  vzdelavaci_prednasky: 'Vzdělávací – přednášky',
  vzdelavaci_kurzy_skoleni: 'Vzdělávací – kurzy, školení',
  vzdelavaci_ohb: 'Vzdělávací – kurz OHB',
  vyukovy_program: 'Výukový program',
  pobytovy_vyukovy_program: 'Pobytový výukový program',
  klub_setkani: 'Klub – setkání',
  klub_prednaska: 'Klub – přednáška',
  akce_verejnost: 'Akce pro veřejnost (velká)',
  ekostan: 'Ekostan',
  vystava: 'Výstava',
  tymovka: 'Schůzka dobrovolníků/týmovka',
  interni: 'Interní akce (VH a jiné)',
  oddilovka: 'Oddílová, družinová schůzka',
}

const programs = {
  monuments: 'Akce památky',
  nature: 'Akce příroda',
  children_section: 'BRĎO',
  eco_consulting: 'Ekostan',
  PsB: 'PsB (Prázdniny s Brontosaurem = vícedenní letní akce)',
  education: 'Vzdělávání',
  international: 'International',
  '': 'Žádný',
}

const audiences = {
  everyone: 'Pro všechny',
  adolescents_and_adults: 'Pro mládež a dospělé',
  children: 'Pro děti',
  parents_and_children: 'Pro rodiče s dětmi',
  newcomers: 'Pro prvoúčastníky',
}

const diets = {
  non_vegetarian: 's masem',
  vegetarian: 'vegetariánska',
  vegan: 'veganská',
  kosher: 'košer',
  halal: 'halal',
  gluten_free: 'bezlepková',
}

const registrationMethods = {
  standard: 'Standardní přihláška na brontowebu',
  other_electronic: 'Jiná elektronická přihláška',
  by_email: 'Účastníci se přihlašují na mail organizátora',
  not_required: 'Registrace není potřeba, stačí přijít',
  full: 'Máme bohužel plno, zkuste jinou z našich akcí',
}

const { Step } = Steps

type FormItemConfig<Form> = {
  element: ReactElement
  label?: string
  required?: boolean | ((form: Form) => boolean)
  display?: (form: Form) => boolean
  help?: string
  rules?: Rule[]
  excluded?: boolean
}

interface CreateEventForm {
  basicPurpose: keyof typeof basicPurposes
  eventType: keyof typeof eventTypes
  name: string
  dateFromTo: [string, string]
  startTime: string
  repetitions: number
  program: keyof typeof programs
  intendedFor: keyof typeof audiences
  newcomerText1: string
  newcomerText2: string
  newcomerText3: string
  administrativeUnit: string
  location: [number, number]
  locationInfo: string
  targetMembers: boolean
  advertiseInRoverskyKmen: boolean
  advertiseInBrontoWeb: boolean
  registrationMethod: keyof typeof registrationMethods
  registrationMethodFormUrl: string
  registrationMethodEmail: string
  additionalQuestion1: string
  additionalQuestion2: string
  additionalQuestion3: string
  additionalQuestion4: string
  additionalQuestion5: string
  additionalQuestion6: string
  additionalQuestion7: string
  additionalQuestion8: string
  participationFee: string
  age: [number, number]
  accommodation: string
  diet: keyof typeof diets
  workingHours: number
  workingDays: number
  contactPersonName: string
  contactPersonEmail: string
  contactPersonTelephone: string
  webUrl: string
  note: string
  responsiblePerson: string
  team: [string]
  invitationText1: string
  invitationText2: string
  invitationText3: string
  invitationText4: string
  mainPhoto: string
  additionalPhotos: string[]
}

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
  [name in AdditionalQuestionType]: FormItemConfig<CreateEventForm>
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
  [name in AdditionalQuestionType]: FormItemConfig<CreateEventForm>
}

type FormConfig<FormType, AdditionalFields extends string> = {
  [name in keyof FormType | AdditionalFields]: FormItemConfig<FormType>
}

const formItems: FormConfig<CreateEventForm, 'newcomerInfo'> = {
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
    element: <DatePicker.RangePicker />,
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
    element: (
      <Select>
        <Option value="a">moznost 1</Option>
        <Option value="b">here we need api that would download</Option>
        <Option value="c">all of this for</Option>
        <Option value="d">us</Option>
      </Select>
    ),
  },
  location: {
    required: form => form.basicPurpose === 'camp',
    element: <Location />,
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
    element: (
      <Select>
        <Option value="id">Dana &bdquo;Darko&ldquo; Horáková</Option>
        <Option disabled value="id2">
          Johann &bdquo;Bach&ldquo; Basovník <i>nedostatečná kvalifikace</i>
        </Option>
      </Select>
    ),
  },
  team: {
    label: 'Organizační tým',
    element: (
      <Select mode="multiple">
        <Option value="a">Jana Nováková</Option>
      </Select>
    ),
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

const stepConfig: {
  title: string
  items: (keyof CreateEventForm | 'newcomerInfo')[]
}[] = [
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

const CreateEvent = () => {
  const [step, setStep] = useState(0)
  const [form] = Form.useForm<CreateEventForm>()

  const steps = stepConfig.map(({ items }) =>
    items.map(name => {
      const item = formItems[name]
      const shouldUpdate =
        typeof item.display === 'function' ||
        typeof item.required === 'function'
      const required = item.required
        ? [
            {
              required: true,
              message: 'Povinné pole',
            },
          ]
        : []
      // @TODO Format the wrapper Form.Item in a way that it doesn't have margin bottom and min-height (so it is invisible when not displayed)

      type FormType = typeof form

      const getFormItem = (form: FormType) =>
        item.excluded ? (
          item.element
        ) : (
          <Form.Item
            name={name}
            label={item?.label}
            tooltip={item?.help}
            required={isRequired(item.required, form)}
            rules={[...required, ...(item?.rules ?? [])]}
          >
            {item.element}
          </Form.Item>
        )

      return (
        <Form.Item key={name} shouldUpdate={shouldUpdate} className="mb-0">
          {shouldUpdate
            ? () =>
                (typeof item.display === 'function'
                  ? item.display(form.getFieldsValue())
                  : item?.display ?? true) && getFormItem(form)
            : getFormItem(form)}
        </Form.Item>
      )
    }),
  )

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFieldsChange={a => console.log(a)}
        onValuesChange={b => console.log(b)}
        onFinish={form => console.log(form)}
      >
        <Form.Item shouldUpdate>
          {() => (
            <Steps size="small" current={step} className="mb-8">
              {stepConfig.map(({ title, items }, index) => (
                <Step
                  title={title}
                  key={index}
                  onStepClick={i => setStep(i)}
                  status={
                    index === step
                      ? 'process'
                      : isStepValid<CreateEventForm>(
                          items as (keyof CreateEventForm)[],
                          formItems,
                          form,
                        )
                      ? 'finish'
                      : 'error'
                  }
                />
              ))}
            </Steps>
          )}
        </Form.Item>
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
          {step === steps.length - 1 && (
            <Button type="primary" htmlType="submit">
              Hotovo
            </Button>
          )}
        </div>
      </Form>
    </>
  )
}

export default CreateEvent
const isRequired = function <T>(
  required: FormItemConfig<T>['required'],
  form: FormInstance<T>,
) {
  return typeof required === 'function'
    ? required(form.getFieldsValue())
    : required ?? false
}

const isItemValid = function <T>(
  name: keyof T,
  formConfig: FormConfig<T, never>,
  form: FormInstance<T>,
) {
  const itemExists = !!form.getFieldInstance(name as string)
  const isItemTouched = form.isFieldTouched(name as string)
  const isItemRequired = isRequired(formConfig[name].required, form)
  const hasItemErrors = form.getFieldError(name as string).length > 0

  // success
  // item doesn't exist (nothing to validate)
  // OR
  // item exists and doesn't have errors AND (is touched OR is not required)
  // because we want every required field touched
  const isValid =
    !itemExists || (!hasItemErrors && (isItemTouched || !isItemRequired))

  return isValid
}
const isStepValid = function <T>(
  step: (keyof T)[],
  formConfig: FormConfig<T, never>,
  form: FormInstance<T>,
) {
  return step.every(name => isItemValid(name, formConfig, form))
}

/*
Zadání Nové akce_17.4.

Při zadávání akce mít tlačítko „NOVÁ AKCE“, 
a jako první krok při zadávání akce vybrat ze tří kategorie:
Podle toho, jaká by byla vybrána akce, se vyberou i kolonky k vyplnění. (tzn. že vyberu kategorii akce a podle kategorie akce se mi objeví kolonky, které jsou třeba vyplnit. ) Je třeba aby se to dalo vyplňovat i zpětně, takže po tom, co se akce reálně konala vlastně můžu změnit kategorii akce a podle toho i příslušné kolonky

Obecně:
- u rozbalovacích možností nesmí být žádná volba předvolená! Uživatel musí vybrat některou z možností.
u všech položek nutné přidat tlačítko Help? s vysvětlivkami
 vše (kromě poznámky) by se mělo propsat na web
 povinné položky označeny *
 položky, které se zobrazí pouze pro určitou kategorii akce (viz. výše) jsou označeny modře a popsány v komentáři
k nové akce je možné připojit soubor

Kolonky pro zapisování akcí do BISu 2.0.
Název *
Od *
Do *
Začátek akce - čas *
výběr času
Počet akcí v uvedeném období * (do Help? = Používá se u opakovaných akcí (typicky oddílové schůzky). U klasické jednorázové akce zde nechte jedničku.)
Typ *
Dobrovolnická
Zážitková
Sportovní
Vzdělávací – přednášky
Vzdělávací – kurzy, školení
Vzdělávací – kurz OHB
Výukový program
Pobytový výukový program
Klub – setkání
Klub – přednáška
Akce pro veřejnost (velká)
Ekostan
Výstava
Schůzka dobrovolníků/týmovka
Interní akce (VH a jiné)
Oddílová, družinová schůzka
Program *
Akce památky
Akce příroda
BRĎO
Ekostan
PsB (Prázdniny s Brontosaurem = vícedenní letní akce)
Vzdělávání
International
Žádný
Pro koho *
Pro všechny
Pro mládež a dospělé
Pro děti
Pro rodiče s dětmi
Pro prvoúčastníky

V případě, že je vybrána možnost “Pro koho - Pro prvoúčastníky” rozbalí se následující text a otázky související s VIP propagací:
“Hnutí Brontosaurus pravidelně vytváří nabídku výběrových dobrovolnických akcí, kterými oslovujeme nové účastníky, zejména středoškolskou mládež a začínající vysokoškoláky (15 - 26 let). Cílem akce je oslovit tyto prvoúčastníky a mít jich nejlépe polovinu, (min. třetinu) z celkového počtu účastníků.

Zadáním akce pro prvoúčastníky získáte:

- Širší propagaci skrze letáky, osobní kontakty apod. Zveřejnění na letáku VIP propagace.
- Propagaci na programech pro střední školy - lektoři budou osobně na akce zvát.
- Zveřejnění na Facebooku a Instagramu HB a reklamu na Facebooku
- Reklamu v Google vyhledávání
- Služby grafika HB (dle dohodnutého rozsahu)
- Přidání do webových katalogů akcí 
- Slevu na inzerci v Roverském kmenu (pro tábory)
- Zpětnou vazbu k webu a Facebooku akce
- Metodickou pomoc a pomoc s agendou akce
- Propagace na novém webu HB v sekci Jedu poprvé”

Cíle akce a přínos pro prvoúčastníky: 
Text - (Jaké je hlavní téma vaší akce? Jaké jsou hlavní cíle akce? Co nejvýstižněji popište, co akce přináší účastníkům, co zajímavého si zkusí, co se dozví, naučí, v čem se rozvinou…)
Programové pojetí akce pro prvoúčastníky:
Text - (V základu uveďte, jak bude vaše akce programově a dramaturgicky koncipována (motivační příběh, zaměření programu – hry, diskuse, řemesla,...). Uveďte, jak náplň a program akce reflektují potřeby vaší cílové skupiny prvoúčastníků.)
Krátký zvací text do propagace
 Text (max 200 znaků) -. Ve 2-4 větách nalákejte na vaši akci a zdůrazněte osobní přínos pro účastníky (max. 200 znaků).

  
Pořádající ZČ/Klub/RC/ústředí *
Výběr možností z objektů „základní články“ a „kluby“ a “regionální centra” a “ústředí”
Lokace- seznam jak je ted v Django, pouze skryt "misto" a "organizacni jednotka"

V budoucnu GPS/lokace na mapce/vyhledaání lokace na mapy.cz (*)

Kraj (*) - je soucasti zadavani Lokaci?
výběr ze všech krajů
online
ČR
zahraničí

Místo konání akce *
Text – název/popis místa, kde se akce koná
Na koho je akce zaměřená *
Na členy
Na nečleny
Propagovat akci v Roverském kmeni *
ano
ne
Zveřejnit na brontosauřím webu *
Ano
Ne
Způsob přihlášení *
Standardní přihláška na brontowebu
Fce: tlačítko chci jet odkáže na: vyplnit předdefinovaný brontosauří formulář
Jiná elektronická přihláška
Fce: tlačítko chci jet = proklik na jinou elektronickou přihlášku
Účastníci se přihlašují na mail organizátora
Fce: tlačítko chci jet = otevření outlook, kde je příjemce mail organizátora
Registrace není potřeba, stačí přijít
FCE: propíše se na web, že není třeba se hlásit
Máme bohužel plno, zkuste jinou z našich akcí
Fce: propíše se to na web

při vybrání možnosti “Standardní příhláška na brontowebu” se objeví tyto položky
Otázka 1
Otázka 2
Otázka 3
Otázka 5
Otázka 6
Otázka 7
Otázka 8

URL příhlášky 
URL
Fce: proklik na přihlášky vytvořenou externě
Účastnický poplatek *
Částka v CZK 
Věk od *
Věk do *
Ubytování (*)
Text
Strava (*)
Výběr z možností, možnost vybrat více možností současně
s masem
vegetariánska
veganská
Pracovní doba *
Počet pracovních dní na akci *
Kontaktní osoba (možnost: Kontaktní osoba stejná jako hlavní organizátor)
Jméno kontaktní osoby *
Kontaktní email *
Kontaktní telefon
Web o akci
Web akce (v případě že nějaký existuje)
Poznámka
Text (vidí jenom lidé s přístupem do BISu, kteří si akci prohlížejí přímo v systému)
Zvací text: Co nás čeká *
Text
FCE: Prvních několik slov/vět se propíše zároveň do rámečku akce v přehledu akcí
Zvací text: Co, kde a jak *
Text
Zvací text: dobrovolnická pomoc (*)
Text
Zvací text: Malá ochutnávka (*)
Text (který uvádí fotky)
Hlavní foto (*)
Foto se zobrazí v rámečku akce, jako hlavní fotka
Fotka k malé ochutnávce
Zobrazí se pod textem „Zvací text: Malá ochutnávka“ 

Pobíráte na akci dotaci? *
Nedotováno
Z MŠMT
Z jiných projektů

Hlavní organizátor *
Organizační tým 
Jména ostatních organizátorů




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
