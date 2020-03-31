import * as packetAnalysers from '@/scripts/si/packetAnalysers'

test('Packet Analysers', () => {
  expect(packetAnalysers.card5.inserted([])).toBeFalsy()
  expect(packetAnalysers.card5.inserted([0, 0xe5, 0x06])).toBeFalsy()
  expect(
    packetAnalysers.card5.inserted([
      0,
      0xe5,
      0x06,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
    ])
  ).toBeTruthy()

  expect(packetAnalysers.card10.inserted([])).toBeFalsy()
  expect(packetAnalysers.card10.inserted([0, 0xe8, 0x06])).toBeFalsy()
  expect(
    packetAnalysers.card10.inserted([
      0,
      0xe8,
      0x06,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
    ])
  ).toBeTruthy()

  const array = [0, 0xb1, 0x82]
  expect(packetAnalysers.card5.data([])).toBeFalsy()
  expect(packetAnalysers.card5.data(array)).toBeFalsy()
  array.length = 136
  expect(packetAnalysers.card5.data(array)).toBeTruthy()

  const array2 = [0, 0xef, 0x83]
  expect(packetAnalysers.card10.data([])).toBeFalsy()
  expect(packetAnalysers.card10.data(array2)).toBeFalsy()
  array2.length = 137
  expect(packetAnalysers.card10.data(array2)).toBeTruthy()
})
