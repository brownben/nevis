import si from '@/scripts/si/si'
import instructionSets from '@/scripts/si/instructionSets'
import helperFunctions from '@/scripts/si/helperFunctions'

jest.mock('@/scripts/si/instructionSets')

test('SI Parse Data - Invalid Data', () => {
  const port = { write: jest.fn(), flush: jest.fn() }

  expect(si.parseData([229, 6, 0, 10, 0, 4, 88, 221], port)).toEqual(undefined)
  expect(si.parseData([231, 6, 0, 10, 0, 4, 88, 221], port)).toEqual(undefined)
  expect(si.parseData([229, 6, 0, 10, 0, 4, 88, 222], port)).toEqual(undefined)
  expect(si.parseData([231, 6, 0, 10, 0, 4, 88, 222], port)).toEqual(undefined)
  expect(si.parseData([229, 6, 0, 10, 0, 4, 171, 95], port)).toEqual(undefined)
  expect(si.parseData([231, 6, 0, 10, 0, 4, 171, 95], port)).toEqual(undefined)

  expect(port.flush).toHaveBeenCalledTimes(6)
})

test('Si Parse Data - Card 5 Inserted', () => {
  const port = { write: jest.fn(), flush: jest.fn() }

  expect(si.parseData([2, 229, 6, 0, 10, 0, 4, 88, 221, 133, 178, 3], port)).toEqual(undefined)
  expect(si.parseData([2, 229, 6, 0, 10, 0, 4, 171, 95, 44, 177, 3], port)).toEqual(undefined)
  expect(si.parseData([2, 229, 6, 0, 10, 0, 4, 88, 222, 133, 184, 3], port)).toEqual(undefined)
  expect(instructionSets.card5.getData).toHaveBeenCalledTimes(3)
})

test('SI Parse Data - Card 5', () => {
  const port = { write: jest.fn(), flush: jest.fn() }

  expect(si.parseData(
    [2, 177, 130, 0, 10, 170, 254, 254, 254, 88, 221, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 88, 221, 135, 154, 136, 193, 31, 86, 238, 238, 40, 4, 57, 0, 7, 0, 101, 135, 206, 102, 136, 45, 107, 136, 161, 109, 137, 36, 106, 91, 214, 0, 107, 91, 229, 108, 91, 229, 109, 91, 226, 110, 91, 234, 111, 91, 238, 0, 112, 91, 251, 105, 91, 249, 104, 92, 9, 102, 92, 1, 101, 92, 14, 0, 100, 92, 14, 119, 92, 14, 120, 92, 25, 121, 92, 34, 123, 92, 37, 0, 122, 92, 39, 124, 92, 47, 125, 92, 62, 126, 92, 57, 127, 92, 61, 0, 128, 92, 74, 129, 92, 74, 110, 100, 179, 110, 100, 183, 110, 100, 184, 56, 139, 3], port
  )).toEqual({
    siid: 422749,
    punches: [
      { controlCode: 'S', time: 34714 },
      { controlCode: 'F', time: 35009 },
      { controlCode: 101, time: 34766 },
      { controlCode: 102, time: 34861 },
      { controlCode: 107, time: 34977 },
      { controlCode: 109, time: 35108 },
      { controlCode: 106, time: 66710 },
      { controlCode: 107, time: 66725 },
      { controlCode: 108, time: 66725 },
      { controlCode: 109, time: 66722 },
      { controlCode: 110, time: 66730 },
      { controlCode: 111, time: 66734 },
      { controlCode: 112, time: 66747 },
      { controlCode: 105, time: 66745 },
      { controlCode: 104, time: 66761 },
      { controlCode: 102, time: 66753 },
      { controlCode: 101, time: 66766 },
      { controlCode: 100, time: 66766 },
      { controlCode: 119, time: 66766 },
      { controlCode: 120, time: 66777 },
      { controlCode: 121, time: 66786 },
      { controlCode: 123, time: 66789 },
      { controlCode: 122, time: 66791 },
      { controlCode: 124, time: 66799 },
      { controlCode: 125, time: 66814 },
      { controlCode: 126, time: 66809 },
      { controlCode: 127, time: 66813 },
      { controlCode: 128, time: 66826 },
      { controlCode: 129, time: 66826 },
      { controlCode: 110, time: 68979 },
      { controlCode: 110, time: 68983 },
      { controlCode: 110, time: 68984 },
    ],
  })

  expect(si.parseData(
    [2, 177, 130, 0, 10, 170, 254, 254, 254, 171, 95, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 171, 95, 135, 152, 136, 193, 5, 86, 238, 238, 40, 4, 14, 0, 7, 0, 101, 135, 206, 102, 136, 44, 103, 136, 111, 117, 91, 229, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 229, 255, 3], port
  )).toEqual({
    siid: 443871,
    punches: [
      { controlCode: 'S', time: 34712 },
      { controlCode: 'F', time: 35009 },
      { controlCode: 101, time: 34766 },
      { controlCode: 102, time: 34860 },
      { controlCode: 103, time: 34927 },
      { controlCode: 117, time: 66725 },
    ],
  })

  expect(si.parseData(
    [2, 177, 130, 0, 10, 170, 254, 254, 254, 88, 222, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 88, 222, 135, 153, 136, 195, 4, 86, 238, 238, 40, 4, 58, 0, 7, 0, 101, 135, 214, 102, 136, 43, 103, 136, 112, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 71, 221, 3], port
  )).toEqual({
    siid: 422750,
    punches: [
      { controlCode: 'S', time: 34713 },
      { controlCode: 'F', time: 35011 },
      { controlCode: 101, time: 34774 },
      { controlCode: 102, time: 34859 },
      { controlCode: 103, time: 34928 },
    ],
  })

  expect(si.parseData(
    [2, 177, 130, 0, 10, 170, 254, 254, 254, 88, 222, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 88, 222, 238, 238, 238, 238, 4, 86, 238, 238, 40, 4, 58, 0, 7, 0, 101, 135, 214, 102, 136, 43, 103, 136, 112, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 124, 50, 3], port
  )).toEqual({
    siid: 422750,
    punches: [
      { controlCode: 101, time: 34774 },
      { controlCode: 102, time: 34859 },
      { controlCode: 103, time: 34928 },
    ],
  })

  expect(si.parseData(
    [2, 177, 130, 0, 10, 170, 254, 254, 254, 88, 222, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 88, 222, 135, 153, 0, 12, 4, 86, 238, 238, 40, 4, 58, 0, 7, 0, 101, 135, 214, 102, 136, 43, 103, 136, 112, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 120, 210, 3], port
  )).toEqual({
    siid: 422750,
    punches: [
      { controlCode: 'S', time: 34713 },
      { controlCode: 'F', time: 43212 },
      { controlCode: 101, time: 34774 },
      { controlCode: 102, time: 34859 },
      { controlCode: 103, time: 34928 },
    ],
  })
})

test('Si Parse Data - Card 10 Inserted', () => {
  const port = { write: jest.fn(), flush: jest.fn() }

  expect(si.parseData([2, 232, 6, 0, 10, 15, 125, 110, 41, 41, 208, 3], port)).toEqual(undefined)
  expect(si.parseData([2, 232, 6, 0, 10, 15, 137, 124, 46, 73, 82, 3], port)).toEqual(undefined)
  expect(instructionSets.card10.getData0).toHaveBeenCalledTimes(2)
})

test('Si Parse Data - Card 10 Data Block Unknown', () => {
  const port = { write: jest.fn(), flush: jest.fn() }
  jest.spyOn(helperFunctions.card10, 'processBlock0')
  helperFunctions.validityCheck = jest.fn(() => true)

  expect(si.parseData([2, 239, 131, 0, 10, 7, 74, 174, 193, 155, 234, 234, 234, 234, 17, 1, 41, 64, 17, 3, 41, 74, 17, 6, 42, 15, 16, 9, 17, 20, 15, 125, 110, 41, 1, 16, 59, 14, 66, 101, 110, 59, 66, 114, 111, 119, 110, 59, 109, 59, 50, 48, 48, 49, 59, 69, 83, 79, 67, 59, 98, 101, 110, 46, 98, 114, 111, 119, 110, 46, 107, 105, 100, 115, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109, 59, 59, 69, 100, 105, 110, 98, 117, 114, 103, 104, 59, 51, 32, 82, 101, 100, 102, 111, 114, 100, 32, 68, 114, 105, 118, 101, 59, 69, 72, 49, 51, 32, 48, 66, 76, 59, 71, 66, 82, 59, 0, 238, 238, 238, 238, 238, 238, 238, 238, 187, 255, 3], port)).toEqual(undefined)

  expect(helperFunctions.card10.processBlock0).toHaveBeenCalledTimes(0)
})

test('Si Parse Data - Card 10 Data Block 0', () => {
  const port = { write: jest.fn(), flush: jest.fn() }
  jest.spyOn(helperFunctions.card10, 'processBlock0')

  expect(si.parseData([2, 239, 131, 0, 10, 0, 74, 174, 193, 155, 234, 234, 234, 234, 17, 1, 41, 64, 17, 3, 41, 74, 17, 6, 42, 15, 16, 9, 17, 20, 15, 125, 110, 41, 1, 16, 59, 14, 66, 101, 110, 59, 66, 114, 111, 119, 110, 59, 109, 59, 50, 48, 48, 49, 59, 69, 83, 79, 67, 59, 98, 101, 110, 46, 98, 114, 111, 119, 110, 46, 107, 105, 100, 115, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109, 59, 59, 69, 100, 105, 110, 98, 117, 114, 103, 104, 59, 51, 32, 82, 101, 100, 102, 111, 114, 100, 32, 68, 114, 105, 118, 101, 59, 69, 72, 49, 51, 32, 48, 66, 76, 59, 71, 66, 82, 59, 0, 238, 238, 238, 238, 238, 238, 238, 238, 187, 255, 3], port)).toEqual(undefined)

  expect(helperFunctions.card10.processBlock0).toHaveBeenCalledTimes(1)
})

test('Si Parse Data - Card 10 Data Block 4', () => {
  const port = { write: jest.fn(), flush: jest.fn() }
  helperFunctions.card10.processBlockNext = jest.fn(() => 'data')

  expect(si.parseData([2, 239, 131, 0, 10, 4, 17, 231, 41, 96, 17, 232, 41, 110, 17, 233, 41, 120, 17, 234, 41, 133, 17, 235, 41, 138, 17, 236, 41, 149, 17, 237, 41, 163, 17, 238, 41, 174, 17, 239, 41, 183, 17, 240, 41, 189, 17, 241, 41, 199, 17, 242, 41, 206, 17, 243, 41, 218, 17, 244, 41, 231, 17, 245, 41, 240, 17, 247, 41, 250, 17, 246, 42, 3, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 238, 57, 203, 3], port)).toEqual('data')

  expect(helperFunctions.card10.processBlockNext).toHaveBeenCalledTimes(1)
})

test('SI Parse Data - Card 10 Removed', () => {
  const port = { write: jest.fn(), flush: jest.fn() }

  expect(si.parseData([2, 231, 6, 0, 10, 0, 125, 110, 41, 21, 242, 3], port)).toEqual(undefined)
  expect(si.parseData([2, 231, 6, 0, 10, 0, 137, 124, 46, 117, 112, 3], port)).toEqual(undefined)
})
