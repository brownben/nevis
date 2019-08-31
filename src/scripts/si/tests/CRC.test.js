import CRC from '@/scripts/si/CRC'

test('CRC', () => {
  expect(CRC([229, 6, 0, 10, 0, 4, 88, 221])).toEqual(34226)
  expect(CRC([231, 6, 0, 10, 0, 4, 88, 221])).toEqual(42430)
  expect(CRC([229, 6, 0, 10, 0, 4, 88, 222])).toEqual(34232)
  expect(CRC([231, 6, 0, 10, 0, 4, 88, 222])).toEqual(42420)
  expect(CRC([229, 6, 0, 10, 0, 4, 171, 95])).toEqual(11441)
  expect(CRC([231, 6, 0, 10, 0, 4, 171, 95])).toEqual(3261)
  expect(CRC([229, 6, 0, 10, 0, 4, 171])).toEqual(45675)
  expect(CRC([231, 6, 0, 10, 0, 4, 171])).toEqual(49768)
  expect(CRC([])).toEqual(0)
  expect(CRC([231])).toEqual(0)
})
