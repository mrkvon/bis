export const basicPurposes = {
  'action-with-attendee-list': 'Víkendovka nebo pravidelná akce s adresářem',
  action: 'Jednorázová nebo pravidelná akce bez povinného adresáře',
  camp: 'Vícedenní akce (tábory)',
}

export const eventTypes = {
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

export const programs = {
  monuments: 'Akce památky',
  nature: 'Akce příroda',
  children_section: 'BRĎO',
  eco_consulting: 'Ekostan',
  PsB: 'PsB (Prázdniny s Brontosaurem = vícedenní letní akce)',
  education: 'Vzdělávání',
  international: 'International',
  '': 'Žádný',
}

export const audiences = {
  everyone: 'Pro všechny',
  adolescents_and_adults: 'Pro mládež a dospělé',
  children: 'Pro děti',
  parents_and_children: 'Pro rodiče s dětmi',
  newcomers: 'Pro prvoúčastníky',
}

export const diets = {
  non_vegetarian: 's masem',
  vegetarian: 'vegetariánska',
  vegan: 'veganská',
  kosher: 'košer',
  halal: 'halal',
  gluten_free: 'bezlepková',
}

export const registrationMethods = {
  standard: {
    label: 'Standardní přihláška na brontowebu (doporučujeme!)',
    help: 'Je jednotná pro celé HB. Do této přihlášky si můžete přidat 4 vlastní otázky. Vyplněné údaje se pak rovnou zobrazí v BIS, což tobě i kanceláři ulehčí práci.',
  },
  other_electronic: {
    label: 'Jiná elektronická přihláška',
    help: 'Přesměruje zájemce na vaši přihlášku.',
  },
  by_email: {
    label: 'Účastníci se přihlašují na mail organizátora',
    help: 'Přesměruje zájemce na outlook s kontaktním emailem.',
  },
  not_required: {
    label: 'Registrace není potřeba, stačí přijít',
    help: 'Zobrazí se jako text u vaší akce.',
  },
  full: {
    label: 'Máme bohužel plno, zkuste jinou z našich akcí',
    help: 'Zobrazí se jako text u vaší akce.',
  },
}

export type BeforeEventProps = {
  basicPurpose: keyof typeof basicPurposes
  eventType: keyof typeof eventTypes // does not work
  name: string
  dateFrom: string
  dateTo: string
  startTime: string // maybe a startDate instead?
  repetitions: number
  program: keyof typeof programs // children_section unexpected trailing slash
  intendedFor: keyof typeof audiences
  newcomerText1: string
  newcomerText2: string
  newcomerText3: string
  administrativeUnit: number // does not work
  location: [number, number] // different type, doesn't work with props
  locationInfo: string
  targetMembers: boolean
  advertiseInRoverskyKmen: boolean
  advertiseInBrontoWeb: boolean
  registrationMethod: keyof typeof registrationMethods
  entryFormUrl: string
  registrationMethodEmail: string
  additionalQuestion1: string
  additionalQuestion2: string
  additionalQuestion3: string
  additionalQuestion4: string
  participationFee: string
  ageFrom: number
  ageTo: number
  accommodation: string
  diet: (keyof typeof diets)[] // array doesn't work with props
  workingHours: number
  workingDays: number
  contactPersonName: string
  contactPersonEmail: string
  contactPersonTelephone: string
  webUrl: string
  note: string
  responsiblePerson: number // doesn't save relationship, but a string
  team: number[]
  invitationText1: string
  invitationText2: string
  invitationText3: string
  invitationText4: string
  mainPhoto: string
  additionalPhotos: string[] // there are six additionalPhoto1,2,3,4,5,6
  // lookingForwardToYou: string missing
  // invitationTextShort: string missing
  // publicOnWebDateFrom: date missing
  // publicOnWebDateTo: date missing
  // publicOnWeb: boolean missing
}

export type AfterEventProps = {
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

export type EventProps = BeforeEventProps & AfterEventProps & { id: number }

export type Participant = {
  id: number
  participated: boolean
}

export type EventWithParticipantsProps = EventProps & {
  participants: Participant[]
}
