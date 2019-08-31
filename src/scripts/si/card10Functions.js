import instructionSets from '@/scripts/si/instructionSets'
import helperFunctions from '@/scripts/si/helperFunctions'

const SECONDS_IN_12_HOURS = 60 * 60 * 12

export default {
  cardType (siid) {
    if (siid >= 7000000) return 10
    else if (siid >= 2000000 && siid <= 2999999) return 8
    else if (siid >= 1000000 && siid <= 1999999) return 9
    else if (siid >= 4000000 && siid <= 4999999) return 'p'
  },

  getPersonalData (data) { return data.map(byte => String.fromCharCode(byte)).join('').split(';') },

  checkEmptyPunch: (data, position) => !(data[position + 1] === 0xEE && data[position + 2] === 0xEE),

  processPunch (data) {
    const time = helperFunctions.combineBytes(data.slice(2, 5))
    const timeOfDay = parseInt((data[0] >>> 0).toString(2).substr(-1))
    return time + timeOfDay * SECONDS_IN_12_HOURS
  },

  getPunchData (data) {
    const endOfPunches = data.length - 1
    let currentPosition = 0
    let currentControls = []

    while (currentPosition + 4 <= endOfPunches && this.checkEmptyPunch(data, currentPosition)) {
      currentControls.push({
        controlCode: helperFunctions.combineBytes([data[currentPosition + 1]]),
        time: this.processPunch(data.slice(currentPosition, currentPosition + 4)),
      })
      currentPosition = currentPosition + 4
    }

    return currentControls
  },

  processBlock0 (data, port) {
    const punches = []
    const siid = helperFunctions.calculateSIID(...data.slice(30, 34))

    if (!helperFunctions.checkUndefined(data.slice(20, 22))) {
      punches.push({
        controlCode: 'S',
        time: this.processPunch(data.slice(18, 22)),
      })
    }
    if (!helperFunctions.checkUndefined(data.slice(24, 26))) {
      punches.push({
        controlCode: 'F',
        time: this.processPunch(data.slice(22, 26)),
      })
    }

    const cardType = this.cardType(siid)
    let personalData = ''

    if (cardType === 9) {
      personalData = this.getPersonalData(data.slice(38, 58))
      const controls = this.getPunchData(data.slice(59, 133))
      punches.push(...controls)
      if (controls.length >= 18) instructionSets.card10.getData1(port)
      else return { siid, punches, personalData }
    }
    else if (cardType === 8) {
      personalData = this.getPersonalData(data.slice(38, 133))
      instructionSets.card10.getData1(port)
    }
    else {
      personalData = this.getPersonalData(data.slice(38, 133))
      instructionSets.card10.getData4(port)
    }

    return { siid, punches, personalData }
  },

  processBlockNext (data, port, currentCard) {
    if (currentCard) {
      const blockNumber = data[5]
      const type = this.cardType(currentCard.siid)
      let controls = []

      if (type === 8) controls = this.getPunchData(data.slice(14, 135))
      else if (type === 'p') controls = this.getPunchData(data.slice(54, 135))
      else controls = this.getPunchData(data.slice(6, 135))

      currentCard.punches.push(...controls)
      if (controls.length < 32 || blockNumber === 1 || blockNumber === 7) {
        instructionSets.beep(port)
        return currentCard
      }
      else if (blockNumber === 4) instructionSets.card10.getData5(port)
      else if (blockNumber === 5) instructionSets.card10.getData6(port)
      else if (blockNumber === 6) instructionSets.card10.getData7(port)
      else return undefined
    }
  },
}
