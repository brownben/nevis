import * as helpers from '@/scripts/si/helpers'
import * as card5 from '@/scripts/si/card5'
import * as card10 from '@/scripts/si/card10'

let currentCard = {}

export default {
  parseData: function(data, port) {
    if (helpers.validityCheck(data)) {
      if (card5.packetAnalyser.inserted(data))
        card5.instructionSets.getData(port)
      else if (card10.packetAnalyser.inserted(data))
        card10.instructionSets.getData0(port)
      else if (card5.packetAnalyser.data(data))
        return card5.processData(data, port)
      else if (card10.packetAnalyser.data(data)) {
        currentCard = card10.processData(data, port, currentCard)
        return currentCard
      }
    } else port.flush()
  },
}
