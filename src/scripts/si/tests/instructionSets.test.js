import * as instructionSets from '@/scripts/si/instructionSets'

test('Instruction Sets', () => {
  const port = { write: jest.fn() }
  instructionSets.beep(port)
  expect(port.write).toHaveBeenLastCalledWith(Buffer.from([0xFF, 0x06]))
  instructionSets.card5.getData(port)
  expect(port.write).toHaveBeenLastCalledWith(Buffer.from([0xFF, 0x2, 0xB1, 0X00, 0xB1, 0x00, 0x03]))
  instructionSets.card10.getData0(port)
  expect(port.write).toHaveBeenLastCalledWith(Buffer.from([0xFF, 0x02, 0xEF, 0x01, 0x00, 0xE2, 0x09, 0x03]))
  instructionSets.card10.getData1(port)
  expect(port.write).toHaveBeenLastCalledWith(Buffer.from([0xFF, 0x02, 0xEF, 0x01, 0x01, 0xE3, 0x09, 0x03]))
  instructionSets.card10.getData4(port)
  expect(port.write).toHaveBeenLastCalledWith(Buffer.from([0xFF, 0x02, 0xEF, 0x01, 0x04, 0xE6, 0x09, 0x03]))
  instructionSets.card10.getData5(port)
  expect(port.write).toHaveBeenLastCalledWith(Buffer.from([0xFF, 0x02, 0xEF, 0x01, 0x05, 0xE7, 0x09, 0x03]))
  instructionSets.card10.getData6(port)
  expect(port.write).toHaveBeenLastCalledWith(Buffer.from([0xFF, 0x02, 0xEF, 0x01, 0x06, 0xE4, 0x09, 0x03]))
  instructionSets.card10.getData7(port)
  expect(port.write).toHaveBeenLastCalledWith(Buffer.from([0xFF, 0x02, 0xEF, 0x01, 0x07, 0xE5, 0x09, 0x03]))
  instructionSets.card10.getData8(port)
  expect(port.write).toHaveBeenLastCalledWith(Buffer.from([0xFF, 0x02, 0xEF, 0x01, 0x08, 0xEA, 0x09, 0x03]))
  expect(port.write).toHaveBeenCalledTimes(9)
})
