const SerialPort = window.require('serialport')

export default {
  port: undefined,

  open: () => { },
  data: () => { },
  error: () => { },
  close: () => { },

  connect: function (comPort, baud) {
    this.port = new SerialPort(comPort, {
      baudRate: baud,
      dataBits: 8,
      stopBits: 1,
      parity: 'none',
    })
    this.port.on('open', this.open)
    this.port.on('data', this.data)
    this.port.on('error', this.error)
    this.port.on('close', this.close)
  },

  disconnect: function () {
    if (this.port && this.port.isOpen === true) this.port.close()
  },

  listPorts: function () {
    return SerialPort.list().then((ports, error) => {
      if (error) return error
      if (ports.length === 0) return ['No Ports Found']
      else return ports.map(port => port.comName)
    })
  },
}
