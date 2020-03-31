import courseMatching from '@/scripts/courseMatching/courseMatching'

test('Find Best Course', () => {
  courseMatching.linear = jest
    .fn()
    .mockReturnValueOnce({ percentageCorrect: 1 })
    .mockReturnValueOnce({ percentageCorrect: 0.5 })
    .mockReturnValueOnce({ percentageCorrect: 0.5 })
    .mockReturnValueOnce({ percentageCorrect: 1 })
    .mockReturnValueOnce({ percentageCorrect: 1 })
    .mockReturnValueOnce({ percentageCorrect: 1 })
    .mockReturnValueOnce({ percentageCorrect: 1 })
    .mockReturnValueOnce({ percentageCorrect: 0.25 })
    .mockReturnValueOnce({ percentageCorrect: 0.15 })
    .mockReturnValueOnce({ percentageCorrect: 0.25 })

  expect(courseMatching.findBestCourse([], [{ name: 'Long' }])).toEqual({
    name: 'Long',
    percentageMatch: 1,
  })
  expect(courseMatching.findBestCourse([], [{ name: 'Long' }])).toEqual({
    name: 'Long',
    percentageMatch: 0.5,
  })
  expect(
    courseMatching.findBestCourse([], [{ name: 'Long' }, { name: 'Short' }])
  ).toEqual({ name: 'Short', percentageMatch: 1 })
  expect(
    courseMatching.findBestCourse([], [{ name: 'Long' }, { name: 'Short' }])
  ).toEqual({ name: 'Long', percentageMatch: 1 })
  expect(
    courseMatching.findBestCourse([], [{ name: 'Long' }, { name: 'Short' }])
  ).toEqual({ name: 'Long', percentageMatch: 1 })
  expect(
    courseMatching.findBestCourse([], [{ name: 'Long' }, { name: 'Short' }])
  ).toEqual({ name: 'Short', percentageMatch: 0.25 })
  expect(courseMatching.findBestCourse([], [])).toEqual(undefined)
})
