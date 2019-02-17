export default {
  card5Inserted: data => data[1] === parseInt(0xE5) && data[2] === parseInt(0x06) && data.length === 12,
  card5Data: data => data[1] === parseInt(0xB1) && data[2] === parseInt(0x82) && data.length === 136,

  card5GetData: port => port.write(Buffer.from([255, 2, 177, 0, 177, 0, 3])),

  card5ProcessData: function (data) {
    data = [...data]
    this.currentCompetitor = false
    let other = ''
    const siid = this.calculateSIID(0x00, data[11], data[9], data[10])

    const start = this.getStartFinishCard5(data.slice(24, 26))
    if (start === undefined) other = other + 'MS'

    let finish = this.getStartFinishCard5(data.slice(26, 28))
    if (finish === undefined) other = other + 'MF'
    else if (finish < start) finish += this.SECONDS_IN_12_HOURS

    const controls = this.card5GetPunchData(data, start)

    this.beep()
    return Promise.resolve({
      siid: siid,
      start: start,
      finish: finish,
      controls: controls,
      other: other,
    })
  },

  card5PunchNotEmpty: (data, position) => data[position] !== 0x00 && data[position + 1] !== 0xEE && data[position + 2] !== 0xEE,

  card5SavePunch: function (data, position) {
    const currentControlCode = parseInt(data[position])
    const currentControlTime = this.combineBytes([data[position + 1], data[position + 2]])
    return {
      code: currentControlCode,
      time: currentControlTime,
    }
  },

  card5GetPunchData: function (data, startTime) {
    let currentPosition = 38
    let currentPositionInBlock = 0
    let controls = []
    while (this.card5PunchNotEmpty(data, currentPosition) && currentPosition < 133) {
      controls.push(this.card5SavePunch(data, currentPosition))
      if (currentPositionInBlock < 4) {
        currentPosition += 3
        currentPositionInBlock += 1
      }
      else {
        currentPosition += 4
        currentPositionInBlock = 0
      }
    }
    if (currentPosition === 131) {
      currentPosition = 32
      while (this.card5PunchNotEmpty(data, currentPosition) && currentPosition < 133) {
        controls.push(this.card5SavePunch(data, currentPosition))
        currentPosition += 16
      }
    }

    let lastPunchTime = startTime
    for (const control of controls) {
      if (control.time < lastPunchTime) control.time += this.SECONDS_IN_12_HOURS
      lastPunchTime = control.time
    }

    return controls
  },

  getStartFinishCard5 (data) {
    const time = this.combineBytes(data)
    if (time === 61166) return undefined
    else return time
  },
}
