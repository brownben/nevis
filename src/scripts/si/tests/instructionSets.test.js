import * as instructionSets from '@/scripts/si/instructionSets'

test('Instruction Sets', () => {
  const port = { write: jest.fn() }
  instructionSets.beep(port)
  expect(port.write).toHaveBeenLastCalledWith(Buffer.from([0xff, 0x06]))
  instructionSets.card5.getData(port)
  expect(port.write).toHaveBeenLastCalledWith(
    Buffer.from([0xff, 0x2, 0xb1, 0x00, 0xb1, 0x00, 0x03])
  )
  instructionSets.card10.getData0(port)
  expect(port.write).toHaveBeenLastCalledWith(
    Buffer.from([0xff, 0x02, 0xef, 0x01, 0x00, 0xe2, 0x09, 0x03])
  )
  instructionSets.card10.getData1(port)
  expect(port.write).toHaveBeenLastCalledWith(
    Buffer.from([0xff, 0x02, 0xef, 0x01, 0x01, 0xe3, 0x09, 0x03])
  )
  instructionSets.card10.getData4(port)
  expect(port.write).toHaveBeenLastCalledWith(
    Buffer.from([0xff, 0x02, 0xef, 0x01, 0x04, 0xe6, 0x09, 0x03])
  )
  instructionSets.card10.getData5(port)
  expect(port.write).toHaveBeenLastCalledWith(
    Buffer.from([0xff, 0x02, 0xef, 0x01, 0x05, 0xe7, 0x09, 0x03])
  )
  instructionSets.card10.getData6(port)
  expect(port.write).toHaveBeenLastCalledWith(
    Buffer.from([0xff, 0x02, 0xef, 0x01, 0x06, 0xe4, 0x09, 0x03])
  )
  instructionSets.card10.getData7(port)
  expect(port.write).toHaveBeenLastCalledWith(
    Buffer.from([0xff, 0x02, 0xef, 0x01, 0x07, 0xe5, 0x09, 0x03])
  )
  instructionSets.card10.getData8(port)
  expect(port.write).toHaveBeenLastCalledWith(
    Buffer.from([0xff, 0x02, 0xef, 0x01, 0x08, 0xea, 0x09, 0x03])
  )
  expect(port.write).toHaveBeenCalledTimes(9)
})
