import * as helpers from '@/scripts/si/helpers'
import {
  beep as beepStation,
  card10 as instructionSet,
} from '@/scripts/si/instructionSets'

export { card10 as instructionSets } from '@/scripts/si/instructionSets'
export { card10 as packetAnalyser } from '@/scripts/si/packetAnalysers'

export const processData = (rawData, port, currentCard) => {
  let data = [...rawData]
  const blockNumber = data[5]

  if (blockNumber === 0) return processBlock0(data, port)
  else if (currentCard.siid) return processBlockNext(data, port, currentCard)
}

export const getCardType = (siid) => {
  if (siid >= 7000000) return 10
  else if (siid >= 2000000 && siid <= 2999999) return 8
  else if (siid >= 1000000 && siid <= 1999999) return 9
  else if (siid >= 4000000 && siid <= 4999999) return 'p'
}

export const processTime = (data) => {
  const time = helpers.combineBytes(data.slice(2, 5))
  const timeOfDay = parseInt((data[0] >>> 0).toString(2).substr(-1))
  return time + timeOfDay * helpers.SECONDS_IN_12_HOURS
}

export const getPunches = (data, cardType) => {
  if (cardType === 8) return getPunchData(data.slice(14, 135))
  else if (cardType === 'p') return getPunchData(data.slice(54, 135))
  else return getPunchData(data.slice(6, 135))
}

export const getPunchData = (data, position = 0, controls = []) => {
  if (position + 4 > data.length - 1 || helpers.checkEmptyPunch(data, position))
    return controls
  else {
    controls.push(processPunch(data, position))
    return getPunchData(data, position + 4, controls)
  }
}

export const processPunch = (data, position, code) => ({
  controlCode: code || parseInt(data[position + 1]),
  time: processTime(data.slice(position, position + 4)),
})

export const getPersonalData = (data, cardType) => {
  if (cardType === 9) return processPersonalData(data.slice(38, 58))
  else return processPersonalData(data.slice(38, 133))
}

export const processPersonalData = (data) =>
  data
    .map((byte) => String.fromCharCode(byte))
    .join('')
    .split(';')

export const processBlock0 = (data, port) => {
  const punches = []
  const siid = helpers.calculateSIID(...data.slice(30, 34))

  if (!helpers.checkUndefined(data.slice(20, 22)))
    punches.push(processPunch(data, 18, 'S'))
  if (!helpers.checkUndefined(data.slice(24, 26)))
    punches.push(processPunch(data, 22, 'F'))

  const cardType = getCardType(siid)
  const personalData = getPersonalData(data, cardType)

  if (cardType === 9) {
    const controls = getPunchData(data.slice(59, 133))
    punches.push(...controls)
    if (controls.length >= 18) instructionSet.getData1(port)
  } else if (cardType === 8) instructionSet.getData1(port)
  else instructionSet.getData4(port)
  return { siid, punches, personalData }
}

export const processBlockNext = (data, port, currentCard) => {
  if (currentCard) {
    const blockNumber = data[5]
    const cardType = getCardType(currentCard.siid)
    const punches = getPunches(data, cardType)

    currentCard.punches.push(...punches)

    if (punches.length < 32 || blockNumber === 1 || blockNumber === 7) {
      beepStation(port)
      return currentCard
    } else if (blockNumber === 4) instructionSet.getData5(port)
    else if (blockNumber === 5) instructionSet.getData6(port)
    else if (blockNumber === 6) instructionSet.getData7(port)
  }
}
