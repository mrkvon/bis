import { EventProps } from '../types'
import { jsPDF, CellConfig } from 'jspdf'
import { Roboto, RobotoBlack } from './fonts'
import { Person } from '../../person/types'
import {
  conditions,
  conditionsTitle,
  declaration,
  declarationTitle,
  safety,
  safetyTitle,
} from './text'

const BLANK_CELLS_FOR_PARTICIPANTS = 30

export const generatePdf = (participants: Person[], event: EventProps) => {
  const doc = new jsPDF({ putOnlyUsedFonts: true, orientation: 'landscape' })

  const { name, dateFromTo } = event

  /** For using UTF-8 in generated pdf it is necessary
   *  to import a font that supports UTF-8 encoding
   *
   * To add a new font you can follow the following steps that we used here
   * or find info here: https://github.com/parallax/jsPDF#use-of-unicode-characters--utf-8
   * 1. const myFont = ... // load the *.ttf font file as binary string (file fonts.ts)
   * 2. doc.addFileToVFS("MyFont.ttf", myFont);
   * 3. doc.addFont("MyFont.ttf", "MyFont", "normal");
   * doc.setFont("MyFont");
   *  */
  doc.addFileToVFS('Roboto.ttf', Roboto)
  doc.addFont('Roboto.ttf', 'Roboto', 'normal')
  doc.addFileToVFS('RobotoBlack.ttf', RobotoBlack)
  doc.addFont('RobotoBlack.ttf', 'RobotoBlack', 'normal')

  /** Title */
  doc.setFont('RobotoBlack')
  doc.setFontSize(24)
  doc.text('Prezenční listina ', 50, 15)

  /** Left Data */
  doc.setFont('RobotoBlack')
  doc.setFontSize(14)
  doc.text('Akce: ', 20, 30)
  doc.setFont('Roboto')
  doc.text(`${name}`, 40, 30)
  /** TODO: Get location in readable form */
  doc.setFont('RobotoBlack')
  doc.text('Místo: ', 20, 38)
  doc.setFont('Roboto')
  doc.text(' ', 42, 38)
  doc.setFont('RobotoBlack')
  if (dateFromTo[0] === dateFromTo[1] || !dateFromTo[1]) {
    doc.text('Datum: ', 20, 46)
    doc.setFont('Roboto')
    doc.text(`${dateFromTo[0]}`, 40, 46)
  } else {
    doc.text('Datum: ', 20, 46)
    doc.setFont('Roboto')
    doc.text(`${dateFromTo[0]} - ${dateFromTo[1]}`, 40, 46)
  }
  /** Logo */
  doc.addImage(
    'https://i.ibb.co/NL1Gsdt/GDPR-PREZENCNI-LISTINA-000.png',
    'JPEG',
    170,
    10,
    110,
    28,
  )

  /** Right Data */
  doc.setFont('RobotoBlack')
  doc.text('ZČ, RC klub HB: ', 180, 46)
  doc.setFont('Roboto')
  doc.text(`${name}`, 220, 46)

  /** GDPR */

  doc.setFontSize(10)
  doc.setFont('RobotoBlack')
  doc.text(conditionsTitle, 20, 54)
  doc.setFont('Roboto')

  const conditionsPrint = doc.splitTextToSize(conditions, 250)
  doc.text(conditionsPrint, 20, 60)
  doc.setFont('RobotoBlack')
  doc.text(safetyTitle, 20, 108)
  doc.setFont('Roboto')
  const safetyToPrint = doc.splitTextToSize(safety, 250)
  doc.text(safetyToPrint, 20, 113)
  doc.setFont('RobotoBlack')
  doc.text(declarationTitle, 20, 122)
  doc.setFont('Roboto')
  doc.text(declaration, 40, 122)

  /** Table */
  doc.setFont('Roboto')

  const participantsToPrint = participants.map(
    (
      {
        givenName,
        familyName,
        birthdate,
        permanentAddressStreet,
        permanentAddressCity,
        permanentAddressPostCode,
        phone,
        email,
      },
      index,
    ) => ({
      id: `${index + 1}.`,
      givenName,
      familyName,
      birthdate: birthdate || ' ',
      address: `${permanentAddressStreet} ${permanentAddressCity}`,
      postalCode: permanentAddressPostCode || ' ',
      phone: phone || ' ',
      email: email || ' ',
      signature: ' ',
    }),
  )
  let index = participants.length
  const maxIndex = index + BLANK_CELLS_FOR_PARTICIPANTS
  while (index < maxIndex) {
    participantsToPrint.push({
      id: `${index + 1}.`,
      givenName: ' ',
      familyName: ' ',
      birthdate: ' ',
      address: ' ',
      postalCode: ' ',
      signature: ' ',
      phone: ' ',
      email: ' ',
    })
    index += 1
  }
  const headers: CellConfig[] = [
    {
      name: 'id',
      prompt: ' ',
      width: 15,
      align: 'center',
      padding: 0,
    },
    {
      name: 'givenName',
      prompt: 'Jméno',
      width: 40,
      align: 'center',
      padding: 0,
    },
    {
      name: 'familyName',
      prompt: 'Príjmení',
      width: 55,
      align: 'center',
      padding: 0,
    },
    {
      name: 'birthdate',
      prompt: 'Datum\nnarození',
      width: 30,
      align: 'center',
      padding: 0,
    },
    {
      name: 'address',
      prompt: 'Bydlište',
      width: 60,
      align: 'center',
      padding: 0,
    },
    {
      name: 'postalCode',
      prompt: 'PSC',
      width: 25,
      align: 'center',
      padding: 0,
    },
    {
      name: 'phone',
      prompt: 'Telefon',
      width: 35,
      align: 'center',
      padding: 0,
    },
    {
      name: 'email',
      prompt: 'E-mail',
      width: 55,
      align: 'center',
      padding: 0,
    },
    {
      name: 'signature',
      prompt: 'Podpis',
      width: 35,
      align: 'center',
      padding: 20,
    },
  ]
  const margins = {
    top: 10,
    bottom: 10,
    left: 0,
    width: 1000,
  }

  const config = {
    padding: 1,
    /** TODO:  
    margins
    when this PR is accepted: https://github.com/parallax/jsPDF/pull/3351
    */
    margins,
    // this seems necessary to set font properties in the table
    rowStart: () => {
      doc.setFont('Roboto')
      doc.setFontSize(10)
    },
    printHeaders: true,
    headerBackgroundColor: '#fff',
  }
  doc.setFont('Roboto')
  /** TODO:  
    remove those comments
    when this PR is accepted: https://github.com/parallax/jsPDF/pull/3351
  */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  doc.table(20, 125, participantsToPrint, headers, config)
  return doc
}
