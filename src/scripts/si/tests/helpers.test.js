import * as helpers from '@/scripts/si/helpers'

test('Short Byte', () => {
  expect(helpers.shortByte(0x02)).toBe('02')
  expect(helpers.shortByte(0xff)).toBe('ff')
  expect(helpers.shortByte(0x00)).toBe('00')
  expect(helpers.shortByte(0xb4)).toBe('b4')
  expect(helpers.shortByte(0x36)).toBe('36')
})

test('Combine Bytes', () => {
  expect(helpers.combineBytes([0x00, 0x00, 0x00])).toBe(0)
  expect(helpers.combineBytes([0x00, 0x00, 0x01])).toBe(1)
  expect(helpers.combineBytes([0xff, 0xff, 0xff])).toBe(16777215)
  expect(helpers.combineBytes([0x00])).toBe(0)
  expect(helpers.combineBytes([0xff])).toBe(255)
  expect(helpers.combineBytes([0x36])).toBe(54)
  expect(helpers.combineBytes([0xc3])).toBe(195)
  expect(helpers.combineBytes([0x12, 0x54])).toBe(4692)
  expect(helpers.combineBytes([0xf3, 0xc2])).toBe(62402)
  expect(helpers.combineBytes([136, 193])).toBe(35009)
})

test('Check Undefined', () => {
  expect(helpers.checkUndefined([0x12, 0x54])).toBeFalsy()
  expect(helpers.checkUndefined([0xf3, 0xc2])).toBeFalsy()
  expect(helpers.checkUndefined([0xff, 0xff, 0xff])).toBeFalsy()
  expect(helpers.checkUndefined([0x00])).toBeFalsy()
  expect(helpers.checkUndefined([0xff])).toBeFalsy()
  expect(helpers.checkUndefined([0x36])).toBeFalsy()
  expect(helpers.checkUndefined([0xc3])).toBeFalsy()
  expect(helpers.checkUndefined([0xee])).toBeFalsy()
  expect(helpers.checkUndefined([0xee, 0xee])).toBeTruthy()
})

test('Validity Check', () => {
  expect(
    helpers.validityCheck([2, 229, 6, 0, 10, 0, 4, 171, 95, 44, 177, 3])
  ).toBeTruthy()
  expect(
    helpers.validityCheck([2, 231, 6, 0, 10, 0, 4, 171, 95, 12, 189, 3])
  ).toBeTruthy()
  expect(
    helpers.validityCheck([2, 229, 6, 0, 10, 0, 4, 88, 222, 133, 184, 3])
  ).toBeTruthy()
  expect(
    helpers.validityCheck([2, 231, 6, 0, 10, 0, 4, 88, 222, 165, 180, 3])
  ).toBeTruthy()
  expect(
    helpers.validityCheck([2, 231, 6, 0, 10, 0, 4, 88, 221, 165, 190, 3])
  ).toBeTruthy()
  expect(
    helpers.validityCheck([2, 230, 6, 0, 10, 0, 4, 171, 95, 44, 177, 3])
  ).toBeFalsy()
  expect(
    helpers.validityCheck([2, 231, 6, 1, 10, 0, 4, 171, 95, 12, 189, 3])
  ).toBeFalsy()
  expect(helpers.validityCheck([1, 2, 3, 4, 5, 6, 7, 8])).toBeFalsy()
  expect(helpers.validityCheck([2, 231, 6, 0, 1, 165, 180, 3])).toBeFalsy()
  expect(
    helpers.validityCheck([2, 229, 6, 51, 110, 0, 4, 825, 2214, 133, 178, 3])
  ).toBeFalsy()
  expect(helpers.validityCheck([2, 231, 6, 0, 10, 0])).toBeFalsy()
})

test('Calculate SIID', () => {
  expect(helpers.calculateSIID(0x00, 0x01, 0x00, 0x01)).toBe(1)
  expect(helpers.calculateSIID(0x00, 0x02, 0x34, 0x56)).toBe(213398)
  expect(helpers.calculateSIID(0x00, 0x03, 0x34, 0x56)).toBe(313398)
  expect(helpers.calculateSIID(0x00, 0x04, 0x34, 0x5f)).toBe(413407)
  expect(helpers.calculateSIID(0x00, 0x35, 0x67, 0xe0)).toBe(3500000)
  expect(helpers.calculateSIID(0x00, 0x52, 0xb7, 0xc8)).toBe(5421000)
  expect(helpers.calculateSIID(0x00, 0x08, 0x45, 0x94)).toBe(542100)
  expect(helpers.calculateSIID(0x04, 0x4a, 0xa2, 0x00)).toBe(4891136)
  expect(helpers.calculateSIID(0x04, 0x3e, 0x22, 0x41)).toBe(4072001)
  expect(helpers.calculateSIID(0x06, 0x5b, 0x8d, 0x84)).toBe(6000004)
  expect(helpers.calculateSIID(0x0e, 0xd5, 0x9f, 0xa9)).toBe(14000041)
  expect(helpers.calculateSIID(0x0f, 0x6a, 0xcf, 0xc7)).toBe(7000007)
  expect(helpers.calculateSIID(0x02, 0x1e, 0x84, 0x81)).toBe(2000001)
  expect(helpers.calculateSIID(0x01, 0x0f, 0x42, 0x40)).toBe(1000000)
})

test('Check Empty Punch', () => {
  expect(helpers.checkEmptyPunch([0x12, 0x54])).toBeFalsy()
  expect(helpers.checkEmptyPunch([0xf3, 0xc2])).toBeFalsy()
  expect(helpers.checkEmptyPunch([0xff, 0xff, 0xff])).toBeFalsy()
  expect(helpers.checkEmptyPunch([0xff])).toBeFalsy()
  expect(helpers.checkEmptyPunch([0x36])).toBeFalsy()
  expect(helpers.checkEmptyPunch([0xc3])).toBeFalsy()
  expect(helpers.checkEmptyPunch([0xee])).toBeFalsy()
  expect(helpers.checkEmptyPunch([111, 91, 238])).toBeFalsy()
  expect(helpers.checkEmptyPunch([0x00, 0xee, 0xee])).toBeTruthy()
})
