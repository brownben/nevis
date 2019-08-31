import helperFunctions from '@/scripts/si/helperFunctions'

const SECONDS_IN_12_HOURS = 60 * 60 * 12

export default {
  checkEmptyPunch: (data) => !(data[0] === 0x00 && data[1] === 0xEE && data[2] === 0xEE),

  getPunchData (data, startTime = 0) {
    let currentPosition = 38
    let currentPositionInBlock = 0
    let controls = []

    while (this.checkEmptyPunch(data.slice(currentPosition, currentPosition + 3)) && currentPosition < 133) {
      controls.push({
        controlCode: parseInt(data[currentPosition]),
        time: helperFunctions.combineBytes([data[currentPosition + 1], data[currentPosition + 2]]),
      })
      if (currentPositionInBlock < 4) {
        currentPosition += 3
        currentPositionInBlock += 1
      }
      else {
        currentPosition += 4
        currentPositionInBlock = 0
      }
    }

    if (currentPosition === 134) {
      currentPosition = 37
      while (data[currentPosition] !== 0 && currentPosition < 133) {
        controls.push({
          controlCode: parseInt(data[currentPosition]),
        })
        currentPosition += 16
      }
    }

    let lastPunchTime = startTime
    for (const control of controls) {
      if (control.time < lastPunchTime) control.time += SECONDS_IN_12_HOURS
      lastPunchTime = control.time
    }

    return controls
  },
}
