import computeCRC from '@/scripts/si/CRC'

export const SECONDS_IN_12_HOURS = 60 * 60 * 12

export const checkUndefined = bytes => combineBytes(bytes) === 0xeeee

export const checkEmptyPunch = (data, position = 0) =>
  checkUndefined(data.slice(position + 1, position + 3))

export const shortByte = byte => {
  if (byte.toString(16).length < 2) return `0${byte.toString(16)}`
  else return byte.toString(16)
}

export const combineBytes = bytes => {
  const arrayOfBytes = [...bytes]
  const fullBytes = arrayOfBytes.map(byte => shortByte(byte).toString())
  const string = fullBytes.reduce(
    (result, byte) => result + byte.toString(),
    ''
  )
  return parseInt(string, 16)
}

export const validityCheck = data => {
  const length = data.length
  return (
    computeCRC(data.slice(1, length - 3)) ===
    combineBytes(data.slice(length - 3, length - 1))
  )
}

export const calculateSIID = (byte1, byte2, byte3, byte4) => {
  let siid = combineBytes([byte1, byte2, byte3, byte4])

  let card5Result = calculateSIIDCard5(siid, byte1, byte2)
  if (card5Result) return card5Result
  else return calculateSIIDOtherCards(siid)
}

export const calculateSIIDCard5 = (siid, byte1, byte2) => {
  if (parseInt(byte1) === 0 && parseInt(byte2) === 1) return siid - 65536
  else if (parseInt(byte1) === 0 && parseInt(byte2) === 2) return siid + 68928
  else if (parseInt(byte1) === 0 && parseInt(byte2) === 3) return siid + 103392
  else if (parseInt(byte1) === 0 && parseInt(byte2) === 4) return siid + 137856
  else if (siid >= 3000000 && siid <= 3999999) return siid

  return null
}

export const calculateSIIDOtherCards = siid => {
  // SI Card 6
  if (siid >= 500000 && siid <= 999999) return siid
  // SI Card 8 + comCard Up
  else if (siid >= 35554432 && siid <= 36554431) return siid - 33554432
  // SI Card 9
  else if (siid >= 17777216 && siid <= 18777216) return siid - 16777216
  // SI pCard
  else if (siid >= 71180864 && siid <= 72108863) return siid - 67108864
  // SI tCard
  else if (siid >= 106663296 && siid <= 107663295) return siid - 100663296
  // SI fCard
  else if (siid >= 248881024 && siid <= 249881023) return siid - 234881024
  // SI Card 10+
  else if (siid >= 258658240 && siid <= 261658239) return siid - 251658240

  return siid
}
