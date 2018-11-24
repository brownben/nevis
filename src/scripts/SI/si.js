import computeCRC from './CRC.js'
import card5 from './card5'
import card10 from './card10'

export default {
  port: false,
  currentBuffer: false,
  currentCompetitor: false,

  getInfo (data, port) {
    this.port = port
    return this.packetData(data)
      .then(data => this.processData(data))
  },

  processData: function (data) {
    if (this.validityCheck(data)) {
      if (this.card5Inserted(data)) this.card5GetData(this.port)
      else if (this.card5Data(data)) return this.card5ProcessData(data)
      else if (this.card10Inserted(data)) this.card10GetData0(this.port)
      else if (this.card10Data(data)) return this.card10ProcessData(data)
    }
  },

  beep: function () {
    this.port.write(Buffer.from([0xFF, 0x06]))
  },

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

  cardType: function (siid) {
    if (siid >= 7000000) return 10
    else if (siid >= 2000000 && siid <= 2999999) return 8
    else if (siid >= 1000000 && siid <= 1999999) return 9
    else if (siid >= 4000000 && siid <= 4999999) return 'p'
  },

  packetData: function (incomingData) {
    return new Promise(resolve => {
      if (this.currentBuffer === false) this.currentBuffer = incomingData
      else this.currentBuffer = Buffer.concat([this.currentBuffer, incomingData])

      const correctDelimiters = this.currentBuffer[this.currentBuffer.length - 1] === parseInt(0x03) && this.currentBuffer[0] === parseInt(0x02)
      const correctLength = (this.currentBuffer.length === 12 || this.currentBuffer.length === 136 || this.currentBuffer.length === 137)

      if (correctDelimiters && correctLength) {
        resolve(this.currentBuffer)
        this.currentBuffer = false
      }
    })
  },

  validityCheck: function (data) {
    const length = data.length
    return computeCRC(data.slice(1, length - 3)) === parseInt(this.shortByte(data[length - 3]) + this.shortByte(data[length - 2]), 16)
  },

  shortByte: function (byte) {
    if (byte.toString(16).length < 2) return '0' + byte.toString(16)
    else return byte.toString(16)
  },

  combineBytes (bytes) {
    const fullBytes = bytes.map(byte => this.shortByte(byte).toString())
    const string = fullBytes.reduce((result, byte) => result + byte.toString())
    return parseInt(string, 16)
  },

  getName (data) {
    const colonCode = parseInt(0x3B)
    let name = ''
    let colonCounter = 0
    for (let character of data) {
      if (parseInt(character) !== colonCode && colonCounter <= 1) name = name + String.fromCharCode(character)
      else if (parseInt(character) === colonCode && colonCounter <= 1) {
        name = name + ' '
        colonCounter += 1
      }
      else return name
    }
  },

  getStartFinish (data) {
    const time = this.combineBytes(data)
    if (time === 61166) return undefined
    else return time
  },

  // Import Card Processing Functions
  ...card5,
  ...card10,
}
