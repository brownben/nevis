import card5Functions from '@/scripts/si/card5Functions'

test('Check Empty Punch', () => {
  expect(card5Functions.checkEmptyPunch([0x12, 0x54])).toBeTruthy()
  expect(card5Functions.checkEmptyPunch([0xF3, 0xC2])).toBeTruthy()
  expect(card5Functions.checkEmptyPunch([0xFF, 0xFF, 0xFF])).toBeTruthy()
  expect(card5Functions.checkEmptyPunch([0xFF])).toBeTruthy()
  expect(card5Functions.checkEmptyPunch([0x36])).toBeTruthy()
  expect(card5Functions.checkEmptyPunch([0xC3])).toBeTruthy()
  expect(card5Functions.checkEmptyPunch([0xEE])).toBeTruthy()
  expect(card5Functions.checkEmptyPunch([111, 91, 238])).toBeTruthy()
  expect(card5Functions.checkEmptyPunch([0x00, 0xEE, 0xEE])).toBeFalsy()
})

test('Get Punch Data', () => {
  expect(card5Functions.getPunchData(
    [2, 177, 130, 0, 10, 170, 254, 254, 254, 88, 221, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 88, 221, 135, 154, 136, 193, 31, 86, 238, 238, 40, 4, 57, 0, 7, 0, 101, 135, 206, 102, 136, 45, 107, 136, 161, 109, 137, 36, 106, 91, 214, 0, 107, 91, 229, 108, 91, 229, 109, 91, 226, 110, 91, 234, 111, 91, 238, 0, 112, 91, 251, 105, 91, 249, 104, 92, 9, 102, 92, 1, 101, 92, 14, 0, 100, 92, 14, 119, 92, 14, 120, 92, 25, 121, 92, 34, 123, 92, 37, 0, 122, 92, 39, 124, 92, 47, 125, 92, 62, 126, 92, 57, 127, 92, 61, 0, 128, 92, 74, 129, 92, 74, 110, 100, 179, 110, 100, 183, 110, 100, 184, 56, 139, 3]))
    .toEqual([
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
    ])

  expect(card5Functions.getPunchData(
    [2, 177, 130, 0, 10, 170, 254, 254, 254, 171, 95, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 171, 95, 135, 152, 136, 193, 5, 86, 238, 238, 40, 4, 14, 0, 7, 0, 101, 135, 206, 102, 136, 44, 103, 136, 111, 117, 91, 229, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 229, 255, 3]))
    .toEqual([
      { controlCode: 101, time: 34766 },
      { controlCode: 102, time: 34860 },
      { controlCode: 103, time: 34927 },
      { controlCode: 117, time: 66725 },
    ])

  expect(card5Functions.getPunchData(
    [2, 177, 130, 0, 10, 170, 254, 254, 254, 88, 222, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 88, 222, 135, 153, 136, 195, 4, 86, 238, 238, 40, 4, 58, 0, 7, 0, 101, 135, 214, 102, 136, 43, 103, 136, 112, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 71, 221, 3]))
    .toEqual([
      { controlCode: 101, time: 34774 },
      { controlCode: 102, time: 34859 },
      { controlCode: 103, time: 34928 },
    ])

  expect(card5Functions.getPunchData(
    [2, 177, 130, 0, 10, 170, 254, 254, 254, 88, 222, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 88, 222, 135, 153, 136, 195, 4, 86, 238, 238, 40, 4, 58, 0, 7, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 0, 238, 238, 71, 221, 3]))
    .toEqual([])

  expect(card5Functions.getPunchData(
    [2, 177, 130, 0, 10, 170, 254, 254, 254, 88, 221, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 88, 221, 135, 154, 136, 193, 31, 86, 238, 238, 40, 4, 57, 0, 7, 5, 101, 135, 206, 102, 136, 45, 107, 136, 161, 109, 137, 36, 106, 91, 214, 6, 107, 91, 229, 108, 91, 229, 109, 91, 226, 110, 91, 234, 111, 91, 238, 7, 112, 91, 251, 105, 91, 249, 104, 92, 9, 102, 92, 1, 101, 92, 14, 8, 100, 92, 14, 119, 92, 14, 120, 92, 25, 121, 92, 34, 123, 92, 37, 9, 122, 92, 39, 124, 92, 47, 125, 92, 62, 126, 92, 57, 127, 92, 61, 10, 128, 92, 74, 129, 92, 74, 110, 100, 179, 110, 100, 183, 110, 100, 184, 56, 139, 3]))
    .toEqual([
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
      { controlCode: 5 },
      { controlCode: 6 },
      { controlCode: 7 },
      { controlCode: 8 },
      { controlCode: 9 },
      { controlCode: 10 },
    ])
})
