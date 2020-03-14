import computeCRC from '@/scripts/si/CRC'
import card5Functions from '@/scripts/si/card5Functions'
import card10Functions from '@/scripts/si/card10Functions'

export default {

  card5: card5Functions,
  card10: card10Functions,

  calculateSIID (byte1, byte2, byte3, byte4) {
    let siid = this.combineBytes([byte1, byte2, byte3, byte4])

    // SI Card 5
    if ((parseInt(byte1) === 0) && (parseInt(byte2) === 1)) siid -= 65536
    else if ((parseInt(byte1) === 0) && (parseInt(byte2) === 2)) siid += 68928
    else if ((parseInt(byte1) === 0) && (parseInt(byte2) === 3)) siid += 103392
    else if ((parseInt(byte1) === 0) && (parseInt(byte2) === 4)) siid += 137856
    else if ((siid >= 3000000) && (siid <= 3999999)) siid -= 0

    // SI Card 6
    else if ((siid >= 500000) && (siid <= 999999)) siid -= 0

    // SI Card 8 + comCard Up
    else if ((siid >= 35554432) && (siid <= 36554431)) siid -= 33554432

    // SI Card 9
    else if ((siid >= 17777216) && (siid <= 18777216)) siid -= 16777216

    // SI pCard
    else if ((siid >= 71180864) && (siid <= 72108863)) siid -= 67108864

    // SI tCard
    else if ((siid >= 106663296) && (siid <= 107663295)) siid -= 100663296

    // SI fCard
    else if ((siid >= 248881024) && (siid <= 249881023)) siid -= 234881024

    // SI Card 10+
    else if ((siid >= 258658240) && (siid <= 261658239)) siid -= 251658240

    return siid
  },

  checkUndefined (bytes) { return this.combineBytes(bytes) === 0xEEEE },

  shortByte (byte) {
    if (byte.toString(16).length < 2) return '0' + byte.toString(16)
    else return byte.toString(16)
  },

  combineBytes (bytes) {
    const fullBytes = bytes.map(byte => this.shortByte(byte).toString())
    const string = fullBytes.reduce((result, byte) => result + byte.toString())
    return parseInt(string, 16)
  },

  validityCheck: function (data) {
    const length = data.length
    return computeCRC(data.slice(1, length - 3)) === this.combineBytes([...data.slice(length - 3, length - 1)])
  },
}
