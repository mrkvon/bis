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
import EditLocation from './EditLocation'
import StepForm, { FormConfig, FormItemConfig, StepConfig } from './StepForm'

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

export interface CreateEventForm {
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

const stepConfig: StepConfig<CreateEventForm, 'newcomerInfo'>[] = [
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

const CreateEvent = () => <StepForm steps={stepConfig} formItems={formItems} />

export default CreateEvent
