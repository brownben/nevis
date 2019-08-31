import instructionSets from '@/scripts/si/instructionSets'
import packetAnalysers from '@/scripts/si/packetAnalysers'
import helperFunctions from '@/scripts/si/helperFunctions'

const SECONDS_IN_12_HOURS = 60 * 60 * 12

export default {
  parseData: function (data, port) {
    if (helperFunctions.validityCheck(data)) {
      if (packetAnalysers.card5.inserted(data)) instructionSets.card5.getData(port)
      else if (packetAnalysers.card10.inserted(data)) instructionSets.card10.getData0(port)
      else if (packetAnalysers.card5.data(data)) return processData.card5(data, port)
      else if (packetAnalysers.card10.data(data)) return processData.card10(data, port)
      else return undefined
    }
    else port.flush()
  },
}

let currentCard = {}

const processData = {
  card5 (data, port) {
    currentCard = {}
    const punches = []
    const siid = helperFunctions.calculateSIID(0x00, data[11], data[9], data[10])

    let startTime
    if (!helperFunctions.checkUndefined(data.slice(24, 26))) {
      startTime = helperFunctions.combineBytes([...data.slice(24, 26)])
      punches.push({ controlCode: 'S', time: startTime })
    }

    if (!helperFunctions.checkUndefined(data.slice(26, 28))) {
      let finishTime = helperFunctions.combineBytes([...data.slice(26, 28)])
      if (finishTime < startTime) finishTime += SECONDS_IN_12_HOURS
      punches.push({ controlCode: 'F', time: finishTime })
    }

    punches.push(...helperFunctions.card5.getPunchData(data, startTime))

    instructionSets.beep(port)
    return { siid, punches }
  },

  card10 (data, port) {
    data = [...data]
    const blockNumber = data[5]

    if (blockNumber === 0) currentCard = helperFunctions.card10.processBlock0(data, port)
    else if (currentCard.siid) return helperFunctions.card10.processBlockNext(data, port, currentCard)
    else return undefined
  },
}
