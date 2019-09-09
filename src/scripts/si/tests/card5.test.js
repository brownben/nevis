import * as card5 from '@/scripts/si/card5'

test('Process Punch', () => {
  expect(card5.processPunch([14, 0, 0], 0)).toEqual({ controlCode: 14, time: 0 })
  expect(card5.processPunch([14, 0, 0], 0, '14')).toEqual({ controlCode: '14', time: 0 })
  expect(card5.processPunch([14, 0, 0], 0, 'S')).toEqual({ controlCode: 'S', time: 0 })
  expect(card5.processPunch([14, 0, 15], 0)).toEqual({ controlCode: 14, time: 15 })
  expect(card5.processPunch([14, 1, 15], 0, '14')).toEqual({ controlCode: '14', time: 271 })
  expect(card5.processPunch([14, 5, 255], 0, 'S')).toEqual({ controlCode: 'S', time: 1535 })
})

test('Get Punch Data', () => {
  expect(card5.getPunches(
    [2, 177, 130, 0, 10, 170, 254, 254, 254, 88, 221, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 88, 221, 135, 154, 136, 193, 31, 86, 238, 238, 40, 4, 57, 0, 7, 0, 101, 135, 206, 102, 136, 45, 107, 136, 161, 109, 137, 36, 106, 91, 214, 0, 107, 91, 229, 108, 91, 229, 109, 91, 226, 110, 91, 234, 111, 91, 238, 0, 112, 91, 251, 105, 91, 249, 104, 92, 9, 102, 92, 1, 101, 92, 14, 0, 100, 92, 14, 119, 92, 14, 120, 92, 25, 121, 92, 34, 123, 92, 37, 0, 122, 92, 39, 124, 92, 47, 125, 92, 62, 126, 92, 57, 127, 92, 61, 0, 128, 92, 74, 129, 92, 74, 110, 100, 179, 110, 100, 183, 110, 100, 184, 56, 139, 3]))
    .toEqual([
      { controlCode: 101, time: 34766 },
      { controlCode: 102, time: 34861 },
      { controlCode: 107, time: 34977 },
      { controlCode: 109, time: 35108 },
      { controlCode: 106, time: 23510 },
      { controlCode: 107, time: 23525 },
      { controlCode: 108, time: 23525 },
      { controlCode: 109, time: 23522 },
      { controlCode: 110, time: 23530 },
      { controlCode: 111, time: 23534 },
      { controlCode: 112, time: 23547 },
      { controlCode: 105, time: 23545 },
      { controlCode: 104, time: 23561 },
      { controlCode: 102, time: 23553 },
      { controlCode: 101, time: 23566 },
      { controlCode: 100, time: 23566 },
      { controlCode: 119, time: 23566 },
      { controlCode: 120, time: 23577 },
      { controlCode: 121, time: 23586 },
      { controlCode: 123, time: 23589 },
      { controlCode: 122, time: 23591 },
      { controlCode: 124, time: 23599 },
      { controlCode: 125, time: 23614 },
      { controlCode: 126, time: 23609 },
      { controlCode: 127, time: 23613 },
      { controlCode: 128, time: 23626 },
      { controlCode: 129, time: 23626 },
      { controlCode: 110, time: 25779 },
      { controlCode: 110, time: 25783 },
      { controlCode: 110, time: 25784 },
    ])

  expect(card5.getPunches(
    [2, 177, 130, 0, 10, 170, 254, 254, 254, 171, 95, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 171, 95, 135, 152, 136, 193, 5, 86, 238, 238, 40, 4, 14, 0, 7, 0, 101, 135, 206, 102, 136, 44, 103, 136, 111, 117, 91, 229, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 229, 255, 3]))
    .toEqual([
      { controlCode: 101, time: 34766 },
      { controlCode: 102, time: 34860 },
      { controlCode: 103, time: 34927 },
      { controlCode: 117, time: 23525 },
    ])

  expect(card5.getPunches(
    [2, 177, 130, 0, 10, 170, 254, 254, 254, 88, 222, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 88, 222, 135, 153, 136, 195, 4, 86, 238, 238, 40, 4, 58, 0, 7, 0, 101, 135, 214, 102, 136, 43, 103, 136, 112, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 71, 221, 3]))
    .toEqual([
      { controlCode: 101, time: 34774 },
      { controlCode: 102, time: 34859 },
      { controlCode: 103, time: 34928 },
    ])

  expect(card5.getPunches(
    [2, 177, 130, 0, 10, 170, 254, 254, 254, 88, 222, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 88, 222, 135, 153, 136, 195, 4, 86, 238, 238, 40, 4, 58, 0, 7, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 71, 221, 3]))
    .toEqual([])

  expect(card5.getPunches(
    [2, 177, 130, 0, 10, 170, 254, 254, 254, 88, 221, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 88, 221, 135, 154, 136, 193, 31, 86, 238, 238, 40, 4, 57, 0, 7, 5, 101, 135, 206, 102, 136, 45, 107, 136, 161, 109, 137, 36, 106, 91, 214, 6, 107, 91, 229, 108, 91, 229, 109, 91, 226, 110, 91, 234, 111, 91, 238, 7, 112, 91, 251, 105, 91, 249, 104, 92, 9, 102, 92, 1, 101, 92, 14, 8, 100, 92, 14, 119, 92, 14, 120, 92, 25, 121, 92, 34, 123, 92, 37, 9, 122, 92, 39, 124, 92, 47, 125, 92, 62, 126, 92, 57, 127, 92, 61, 10, 128, 92, 74, 129, 92, 74, 110, 100, 179, 110, 100, 183, 110, 100, 184, 56, 139, 3]))
    .toEqual([
      { controlCode: 101, time: 34766 },
      { controlCode: 102, time: 34861 },
      { controlCode: 107, time: 34977 },
      { controlCode: 109, time: 35108 },
      { controlCode: 106, time: 23510 },
      { controlCode: 107, time: 23525 },
      { controlCode: 108, time: 23525 },
      { controlCode: 109, time: 23522 },
      { controlCode: 110, time: 23530 },
      { controlCode: 111, time: 23534 },
      { controlCode: 112, time: 23547 },
      { controlCode: 105, time: 23545 },
      { controlCode: 104, time: 23561 },
      { controlCode: 102, time: 23553 },
      { controlCode: 101, time: 23566 },
      { controlCode: 100, time: 23566 },
      { controlCode: 119, time: 23566 },
      { controlCode: 120, time: 23577 },
      { controlCode: 121, time: 23586 },
      { controlCode: 123, time: 23589 },
      { controlCode: 122, time: 23591 },
      { controlCode: 124, time: 23599 },
      { controlCode: 125, time: 23614 },
      { controlCode: 126, time: 23609 },
      { controlCode: 127, time: 23613 },
      { controlCode: 128, time: 23626 },
      { controlCode: 129, time: 23626 },
      { controlCode: 110, time: 25779 },
      { controlCode: 110, time: 25783 },
      { controlCode: 110, time: 25784 },
      { controlCode: 5 },
      { controlCode: 6 },
      { controlCode: 7 },
      { controlCode: 8 },
      { controlCode: 9 },
      { controlCode: 10 },
    ])
})

test('Fix Punch Times', () => {
  expect(card5.fixPunchTimes([])).toEqual([])
  expect(card5.fixPunchTimes([{ time: 0 }])).toEqual([{ time: 0 }])
  expect(card5.fixPunchTimes([{ time: 101 }])).toEqual([{ time: 101 }])
  expect(card5.fixPunchTimes([{ time: 0 }, { time: 101 }]))
    .toEqual([{ time: 0 }, { time: 101 }])
  expect(card5.fixPunchTimes([{ time: 0 }, { time: 101 }, { time: 452 }]))
    .toEqual([{ time: 0 }, { time: 101 }, { time: 452 }])
  expect(card5.fixPunchTimes([{ time: 0 }, { time: 452 }, { time: 101 }]))
    .toEqual([{ time: 0 }, { time: 452 }, { time: 43301 }])
  expect(card5.fixPunchTimes([{ time: 555 }, { time: 0 }]))
    .toEqual([{ time: 555 }, { time: 43200 }])
})

test('SI Parse Data - Card 5', () => {
  const port = { write: jest.fn(), flush: jest.fn() }

  expect(card5.processData(
    [2, 177, 130, 0, 10, 170, 254, 254, 254, 88, 221, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 88, 221, 135, 154, 136, 193, 31, 86, 238, 238, 40, 4, 57, 0, 7, 0, 101, 135, 206, 102, 136, 45, 107, 136, 161, 109, 137, 36, 106, 91, 214, 0, 107, 91, 229, 108, 91, 229, 109, 91, 226, 110, 91, 234, 111, 91, 238, 0, 112, 91, 251, 105, 91, 249, 104, 92, 9, 102, 92, 1, 101, 92, 14, 0, 100, 92, 14, 119, 92, 14, 120, 92, 25, 121, 92, 34, 123, 92, 37, 0, 122, 92, 39, 124, 92, 47, 125, 92, 62, 126, 92, 57, 127, 92, 61, 0, 128, 92, 74, 129, 92, 74, 110, 100, 179, 110, 100, 183, 110, 100, 184, 56, 139, 3], port
  )).toEqual({
    siid: 422749,
    punches: [
      { controlCode: 'S', time: 34714 },
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
      { controlCode: 'F', time: 78209 },
    ],
  })

  expect(card5.processData(
    [2, 177, 130, 0, 10, 170, 254, 254, 254, 171, 95, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 171, 95, 135, 152, 136, 193, 5, 86, 238, 238, 40, 4, 14, 0, 7, 0, 101, 135, 206, 102, 136, 44, 103, 136, 111, 117, 91, 229, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 229, 255, 3], port
  )).toEqual({
    siid: 443871,
    punches: [
      { controlCode: 'S', time: 34712 },
      { controlCode: 101, time: 34766 },
      { controlCode: 102, time: 34860 },
      { controlCode: 103, time: 34927 },
      { controlCode: 117, time: 66725 },
      { controlCode: 'F', time: 78209 },
    ],
  })

  expect(card5.processData(
    [2, 177, 130, 0, 10, 170, 254, 254, 254, 88, 222, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 88, 222, 135, 153, 136, 195, 4, 86, 238, 238, 40, 4, 58, 0, 7, 0, 101, 135, 214, 102, 136, 43, 103, 136, 112, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 71, 221, 3], port
  )).toEqual({
    siid: 422750,
    punches: [
      { controlCode: 'S', time: 34713 },
      { controlCode: 101, time: 34774 },
      { controlCode: 102, time: 34859 },
      { controlCode: 103, time: 34928 },
      { controlCode: 'F', time: 35011 },
    ],
  })

  expect(card5.processData(
    [2, 177, 130, 0, 10, 170, 254, 254, 254, 88, 222, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 88, 222, 238, 238, 238, 238, 4, 86, 238, 238, 40, 4, 58, 0, 7, 0, 101, 135, 214, 102, 136, 43, 103, 136, 112, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 124, 50, 3], port
  )).toEqual({
    siid: 422750,
    punches: [
      { controlCode: 101, time: 34774 },
      { controlCode: 102, time: 34859 },
      { controlCode: 103, time: 34928 },
    ],
  })

  expect(card5.processData(
    [2, 177, 130, 0, 10, 170, 254, 254, 254, 88, 222, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 88, 222, 135, 153, 0, 12, 4, 86, 238, 238, 40, 4, 58, 0, 7, 0, 101, 135, 214, 102, 136, 43, 103, 136, 112, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 120, 210, 3], port
  )).toEqual({
    siid: 422750,
    punches: [
      { controlCode: 'S', time: 34713 },
      { controlCode: 101, time: 34774 },
      { controlCode: 102, time: 34859 },
      { controlCode: 103, time: 34928 },
      { controlCode: 'F', time: 43212 },
    ],
  })
})
