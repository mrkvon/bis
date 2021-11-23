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
} from 'antd'
import React, { ReactElement, useState } from 'react'
import { Event } from '../../types'

const { Option } = Select

const basicPurposeOptions: {
  name: string
  value: Event['basic_purpose']
}[] = [
  {
    name: 'Víkendovka nebo pravidelná akce s adresářem',
    value: 'action-with-attendee-list',
  },
  {
    name: 'Jednorázová nebo pravidelná akce bez povinného adresáře',
    value: 'action',
  },
  { name: 'Vícedenní akce (tábory)', value: 'camp' },
]

/*
change to name: name, value: slug
*/
const eventTypes = [
  'Dobrovolnická',
  'Zážitková',
  'Sportovní',
  'Vzdělávací – přednášky',
  'Vzdělávací – kurzy, školení',
  'Vzdělávací – kurz OHB',
  'Výukový program',
  'Pobytový výukový program',
  'Klub – setkání',
  'Klub – přednáška',
  'Akce pro veřejnost (velká)',
  'Ekostan',
  'Výstava',
  'Schůzka dobrovolníků/týmovka',
  'Interní akce (VH a jiné)',
  'Oddílová, družinová schůzka',
]

const programs: {
  name: string
  value: Event['program']
}[] = [
  { name: 'Akce památky', value: 'monuments' },
  { name: 'Akce příroda', value: 'nature' },
  { name: 'BRĎO', value: 'children_section' },
  { name: 'Ekostan', value: 'eco_consulting' },
  {
    name: 'PsB (Prázdniny s Brontosaurem = vícedenní letní akce)',
    value: 'PsB',
  },
  { name: 'Vzdělávání', value: 'education' },
  { name: 'International', value: 'international' },
  { name: 'Žádný', value: '' },
]

const audiences: {
  name: string
  value: Event['intended_for']
}[] = [
  { name: 'Pro všechny', value: 'everyone' },
  { name: 'Pro mládež a dospělé', value: 'adolescents_and_adults' },
  { name: 'Pro děti', value: 'children' },
  { name: 'Pro rodiče s dětmi', value: 'parents_and_children' },
  { name: 'Pro prvoúčastníky', value: 'newcomers' },
]

const diets: {
  name: string
  value: Event['diet']
}[] = [
  { name: 's masem', value: 'non_vegetarian' },
  { name: 'vegetariánska', value: 'vegetarian' },
  { name: 'veganská', value: 'vegan' },
  { name: 'košer', value: 'kosher' },
  { name: 'halal', value: 'halal' },
  { name: 'bezlepková', value: 'gluten_free' },
]

const { Step } = Steps

type FormItemConfig = {
  element: ReactElement
  label?: string
  required?: boolean
  help?: string
}

const formItems: { [name: string]: FormItemConfig } = {
  basic_purpose: {
    element: (
      <Radio.Group>
        <Space direction="vertical">
          {basicPurposeOptions.map(({ name, value }) => (
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
  date_from_to: {
    label: 'Od - Do',
    required: true,
    element: <DatePicker.RangePicker />,
  },
  start_date: {
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
  event_type: {
    label: 'Typ akce',
    required: true,
    element: (
      <Select>
        {eventTypes.map(type => (
          <Option key={type} value={type}>
            {type}
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
        {programs.map(({ name, value }) => (
          <Option key={value} value={value}>
            {name}
          </Option>
        ))}
      </Select>
    ),
  },
  intended_for: {
    label: 'Pro koho',
    required: true,
    element: (
      <Select>
        {audiences.map(({ name, value }) => (
          <Option key={value} value={value}>
            {name}
          </Option>
        ))}
      </Select>
    ),
  },
  administrative_unit: {
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
  participation_fee: {
    label: 'Účastnický poplatek (CZK)',
    required: true,
    element: <InputNumber />,
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
    element: <Input />,
  },
  diet: {
    label: 'Strava',
    required: true,
    element: (
      <Select mode="multiple">
        {diets.map(({ name, value }) => (
          <Option key={value} value={value}>
            {name}
          </Option>
        ))}
      </Select>
    ),
  },
  working_hours: {
    label: 'Pracovní doba',
    element: <InputNumber />,
  },
  working_days: {
    label: 'Počet pracovních dní na akci',
    element: <InputNumber />,
  },
  contact_person_name: {
    label: 'Jméno kontaktní osoby',
    required: true,
    element: <Input />,
  },
  contact_person_email: {
    label: 'Kontaktní email',
    required: true,
    element: <Input />,
  },
  contact_person_telephone: {
    label: 'Kontaktní telefon',
    element: <Input />,
  },
  web_url: {
    label: 'Web o akci',
    help: 'Web akce (v případě že nějaký existuje)',
    element: <Input />,
  },
  note: {
    label: 'Poznámka',
    help: 'vidí jenom lidé s přístupem do BISu, kteří si akci prohlížejí přímo v systému',
    element: <Input.TextArea />,
  },
  team: {
    label: 'Organizační tým',
    element: (
      <Select mode="multiple">
        <Option value="a">Fine</Option>
      </Select>
    ),
  },
  invitation_text_1: {
    label: 'Zvací text: Co nás čeká',
    required: true,
    element: <Input.TextArea />,
  },
  invitation_text_2: {
    label: 'Zvací text: Co, kde a jak',
    required: true,
    element: <Input.TextArea />,
  },
  invitation_text_3: {
    label: 'Zvací text: dobrovolnická pomoc',
    required: true,
    element: <Input.TextArea />,
  },
  invitation_text_4: {
    label: 'Zvací text: Malá ochutnávka',
    required: true,
    element: <Input.TextArea />,
  },
  main_photo: {
    label: 'Hlavní fotka',
    help: 'Foto se zobrazí v rámečku akce, jako hlavní fotka',
    required: true,
    element: <Upload listType="picture-card">+</Upload>,
    // @TODO or allow adding url to a picture
  },
  additional_photos: {
    label: 'Fotky k malé ochutnávce',
    help: 'Zobrazí se pod textem „Zvací text: Malá ochutnávka“',
    element: <Upload listType="picture-card">+</Upload>,
    // @TODO or allow adding url to a picture
  },
}

const stepConfig: { title: string; items: string[] }[] = [
  { title: 'Druh', items: ['basic_purpose'] },
  {
    title: 'Info',
    items: ['name', 'date_from_to', 'start_date', 'repetitions'],
  },
  { title: 'Tým', items: ['team'] },
  {
    title: 'Typ',
    items: ['event_type', 'program', 'intended_for', 'administrative_unit'],
  },
  {
    title: 'Podrobnosti',
    items: [
      'participation_fee',
      'age',
      'diet',
      'working_hours',
      'working_days',
    ],
  },
  {
    title: 'Kontakt',
    items: [
      'contact_person_name',
      'contact_person_email',
      'contact_person_telephone',
      'web_url',
      'note',
    ],
  },
  {
    title: 'Pozvánka',
    items: [
      'invitation_text_1',
      'invitation_text_2',
      'invitation_text_3',
      'invitation_text_4',
      'main_photo',
      'additional_photos',
    ],
  },
]
const CreateEvent = () => {
  const [step, setStep] = useState(0)
  const [form] = Form.useForm()

  const steps = stepConfig.map(({ items }) =>
    items.map(name => {
      const item = formItems[name]
      return (
        <Form.Item
          key={name}
          name={name}
          label={item?.label}
          tooltip={item?.help}
          required={item?.required ?? false}
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
        layout="vertical"
        onFieldsChange={a => console.log(a)}
        onValuesChange={b => console.log(b)}
      >
        <Steps size="small" current={step} className="mb-8">
          {stepConfig.map(({ title }, index) => (
            <Step title={title} key={index} />
          ))}
        </Steps>
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
      </Form>
    </>
  )
}

export default CreateEvent

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
