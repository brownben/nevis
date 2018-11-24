export default {
  card10Inserted: data => parseInt(data[1]) === 0xE8 && parseInt(data[2]) === parseInt(0x06) && data.length === 12,
  card10Data: data => parseInt(data[1]) === parseInt(0xEF) && data[2] === parseInt(0x83) && data.length === 137,

  card10GetData0: port => port.write(Buffer.from([0xFF, 0x02, 0xEF, 0x01, 0x00, 0xE2, 0x09, 0x03])),
  card10GetData1: port => port.write(Buffer.from([0xFF, 0x02, 0xEF, 0x01, 0x01, 0xE3, 0x09, 0x03])),
  card10GetData4: port => port.write(Buffer.from([0xFF, 0x02, 0xEF, 0x01, 0x04, 0xE6, 0x09, 0x03])),
  card10GetData5: port => port.write(Buffer.from([0xFF, 0x02, 0xEF, 0x01, 0x05, 0xE7, 0x09, 0x03])),
  card10GetData6: port => port.write(Buffer.from([0xFF, 0x02, 0xEF, 0x01, 0x06, 0xE4, 0x09, 0x03])),
  card10GetData7: port => port.write(Buffer.from([0xFF, 0x02, 0xEF, 0x01, 0x07, 0xE5, 0x09, 0x03])),
  card10GetData8: port => port.write(Buffer.from([0xFF, 0x02, 0xEF, 0x01, 0x08, 0xEA, 0x09, 0x03])),

  card10ProcessData: function (data) {
    data = [...data]
    const blockNumber = data[5]

    if (blockNumber === 0) return this.card10ProcessBlock0(data)
    else return this.card10ProcessBlockNext(data)
  },

  card10ProcessBlock0: function (data) {
    let other = ''
    const siid = this.calculateSIID(data[30], data[31], data[32], data[33])

    const start = this.getStartFinish(data.slice(20, 22))
    if (start === undefined) other = other + 'MS'

    const finish = this.getStartFinish(data.slice(24, 26))
    if (finish === undefined) other = other + 'MF'

    const type = this.cardType(siid)
    let controls = []
    let name = ''

    if (type === 9) {
      name = this.getName(data.slice(38, 58))
      controls = this.card10GetPunchData(data.slice(59, 133))
      if (controls.length >= 18) this.card10GetData1(this.port)
    }
    else if (type === 8) {
      name = this.getName(data.slice(38, 133))
      this.card10GetData1(this.port)
    }
    else {
      name = this.getName(data.slice(38, 133))
      this.card10GetData4(this.port)
    }

    this.currentCompetitor = {
      siid: siid,
      start: start,
      finish: finish,
      time: finish - start,
      controls: controls,
      other: other,
    }
    if (name) this.currentCompetitor.name = name
    if (other) this.currentCompetitor.time = other
    if (type === 9 && controls.length < 18) return Promise.resolve(this.currentCompetitor)
  },

  card10ProcessBlockNext: function (data) {
    if (this.currentCompetitor) {
      const blockNumber = data[5]
      const type = this.cardType(this.currentCompetitor.siid)
      let controls = []

      if (type === 8) controls = this.card10GetPunchData(data.slice(14, 134))
      else if (type === 'p') controls = this.card10GetPunchData(data.slice(54, 134))
      else controls = this.card10GetPunchData(data.slice(6, 134))

      if (controls) this.currentCompetitor.controls.push(controls)
      else this.currentCompetitor.controls = controls

      if (controls.length < 32 || blockNumber === 1 || blockNumber === 7) {
        this.beep()
        return Promise.resolve(this.currentCompetitor)
      }
      else if (blockNumber === 4) this.card10GetData5(this.port)
      else if (blockNumber === 5) this.card10GetData6(this.port)
      else if (blockNumber === 6) this.card10GetData7(this.port)
    }
  },

  card10PunchNotEmpty: (data, position) => parseInt(data[position + 1]) !== parseInt(0xEE) && parseInt(data[position + 2]) !== parseInt(0xEE),

  card10GetPunchData: function (data) {
    const endOfPunches = data.length - 1
    let currentPosition = 0
    let currentControls = []
    while (currentPosition !== endOfPunches && this.card10PunchNotEmpty(data, currentPosition)) {
      const control = {
        code: this.combineBytes([data[currentPosition + 1]]),
        time: this.combineBytes([data[currentPosition + 2], data[currentPosition + 3]]),
      }
      currentControls.push(control)
      currentPosition = currentPosition + 4
    }
    return currentControls
  },
}
