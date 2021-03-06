export const beep = (port) => port.write(Buffer.from([0xff, 0x06]))

export const card5 = {
  getData: (port) =>
    port.write(Buffer.from([0xff, 0x2, 0xb1, 0x00, 0xb1, 0x00, 0x03])),
}

export const card10 = {
  getData0: (port) =>
    port.write(Buffer.from([0xff, 0x02, 0xef, 0x01, 0x00, 0xe2, 0x09, 0x03])),
  getData1: (port) =>
    port.write(Buffer.from([0xff, 0x02, 0xef, 0x01, 0x01, 0xe3, 0x09, 0x03])),
  getData4: (port) =>
    port.write(Buffer.from([0xff, 0x02, 0xef, 0x01, 0x04, 0xe6, 0x09, 0x03])),
  getData5: (port) =>
    port.write(Buffer.from([0xff, 0x02, 0xef, 0x01, 0x05, 0xe7, 0x09, 0x03])),
  getData6: (port) =>
    port.write(Buffer.from([0xff, 0x02, 0xef, 0x01, 0x06, 0xe4, 0x09, 0x03])),
  getData7: (port) =>
    port.write(Buffer.from([0xff, 0x02, 0xef, 0x01, 0x07, 0xe5, 0x09, 0x03])),
  getData8: (port) =>
    port.write(Buffer.from([0xff, 0x02, 0xef, 0x01, 0x08, 0xea, 0x09, 0x03])),
}
