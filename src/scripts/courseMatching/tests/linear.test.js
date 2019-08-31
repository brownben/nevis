import linear from '@/scripts/courseMatching/linear'

test('Empty Course', () => {
  expect(linear([], []).errors).toBe('')
  expect(linear([], []).percentageCorrect).toBe(1)
})

test('Correct Course', () => {
  expect(linear([1, 1, 1], [1, 1, 1]).errors).toBe('')
  expect(linear([1, 2, 3], [1, 2, 3]).errors).toBe('')
  expect(linear([3, 2, 1], [3, 2, 1]).errors).toBe('')
  expect(linear([4, 3, 5, 2, 1, 9, 2], [4, 3, 5, 2, 1, 9, 2]).errors).toBe('')
  expect(linear([1, 2, 3, 4, 5, 2, 6, 7], [1, 2, 3, 4, 5, 2, 6, 7]).errors).toBe('')
  expect(linear([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).errors).toBe('')
})

test('Extra Controls', () => {
  expect(linear([1, 1, 2, 3], [1, 2, 3]).errors).toBe('')
  expect(linear([1, 2, 2, 3], [1, 2, 3]).errors).toBe('')
  expect(linear([1, 2, 3, 3], [1, 2, 3]).errors).toBe('')
  expect(linear([4, 1, 2, 3], [1, 2, 3]).errors).toBe('')
  expect(linear([1, 4, 2, 3], [1, 2, 3]).errors).toBe('')
  expect(linear([1, 2, 4, 3], [1, 2, 3]).errors).toBe('')
  expect(linear([1, 2, 3, 4], [1, 2, 3]).errors).toBe('')
  expect(linear([1, 1, 1, 1], [1, 1, 1]).errors).toBe('')
  expect(linear([1, 2, 2, 1, 1], [1, 2, 1]).errors).toBe('')
  expect(linear([1, 2, 2, 2, 2, 1, 1], [1, 2, 1]).errors).toBe('')
  expect(linear([1, 2, 2, 2, 2, 1, 1], [1, 2, 1]).errors).toBe('')
  expect(linear([2, 1, 2, 1, 2, 1, 2], [1, 1, 1]).errors).toBe('')
})

test('Wrong Controls', () => {
  expect(linear([4, 2, 3], [1, 2, 3]).errors).toBe('W1')
  expect(linear([1, 4, 3], [1, 2, 3]).errors).toBe('W2')
  expect(linear([1, 2, 4], [1, 2, 3]).errors).toBe('W3')
  expect(linear([1, 2, 7, 4, 5], [1, 2, 3, 4, 5]).errors).toBe('W3')
  expect(linear([6, 7, 3, 4, 5], [1, 2, 3, 4, 5]).errors).toBe('W1-2')
  expect(linear([1, 2, 6, 7, 5], [1, 2, 3, 4, 5]).errors).toBe('W3-4')
  expect(linear([1, 2, 3, 6, 7], [1, 2, 3, 4, 5]).errors).toBe('W4-5')
  expect(linear([6, 2, 3, 4, 7], [1, 2, 3, 4, 5]).errors).toBe('W1 W5')
  expect(linear([1, 6, 3, 6, 5], [1, 2, 3, 4, 5]).errors).toBe('W2 W4')
  expect(linear([6, 7, 8, 9, 0], [1, 2, 3, 4, 5]).errors).toBe('W1-5')
  expect(linear([1, 2, 9, 4, 5, 3, 7, 8], [1, 2, 3, 4, 5, 3, 7, 8]).errors).toBe('W3')
})

test('Missing Controls', () => {
  expect(linear([], [1, 2, 3]).errors).toBe('M1-3')
  expect(linear([2, 3], [1, 2, 3]).errors).toBe('M1')
  expect(linear([1, 3], [1, 2, 3]).errors).toBe('M2')
  expect(linear([1, 2], [1, 2, 3]).errors).toBe('M3')
  expect(linear([1, 2, 4], [1, 2, 3, 4]).errors).toBe('M3')
  expect(linear([3, 4, 5], [1, 2, 3, 4, 5]).errors).toBe('M1-2')
  expect(linear([1, 2, 5], [1, 2, 3, 4, 5]).errors).toBe('M3-4')
  expect(linear([2, 5], [1, 2, 3, 4, 5]).errors).toBe('M1 M3-4')
})

test('Extra + Missing Controls', () => {
  expect(linear([2, 3, 4, 4, 5], [1, 2, 3, 4, 5]).errors).toBe('M1')
  expect(linear([1, 3, 4, 5, 6, 7], [1, 2, 3, 4, 5]).errors).toBe('M2')
  expect(linear([1, 3, 5, 6, 4, 1], [1, 2, 3, 4, 5]).errors).toBe('M2 M4')
})

test('Extra + Wrong Controls', () => {
  expect(linear([7, 2, 3, 4, 4, 4, 5], [1, 2, 3, 4, 5]).errors).toBe('W1')
  expect(linear([1, 7, 3, 4, 5, 6, 7], [1, 2, 3, 4, 5]).errors).toBe('W2')
  expect(linear([1, 1, 3, 1, 2, 7], [1, 2, 3, 4, 5]).errors).toBe('W2 W4-5')
})

test('Wrong + Missing Controls', () => {
  expect(linear([7, 2, 3, 5], [1, 2, 3, 4, 5]).errors).toBe('W1 M4')
  expect(linear([1, 2, 4, 6], [1, 2, 3, 4, 5]).errors).toBe('M3 W5')
})

test('Wrong + Missing + Extra Controls', () => {
  expect(linear([1, 3, 6, 6, 5, 1], [1, 2, 3, 4, 5]).errors).toBe('M2 W4')
  expect(linear([3, 4, 6, 7, 8, 9, 8], [1, 2, 3, 4, 5]).errors).toBe('M1-2 W5')
})

test('Percentage Correct', () => {
  expect(linear([], [1, 2, 3]).percentageCorrect).toBe(0)
  expect(linear([5, 6, 7], [1, 2, 3]).percentageCorrect).toBe(0)
  expect(linear([1, 5, 6, 7], [1, 2, 3, 4]).percentageCorrect).toBe(0.25)
  expect(linear([1, 2], [1, 2, 3, 4]).percentageCorrect).toBe(0.5)
  expect(linear([8, 2, 3, 9], [1, 2, 3, 4]).percentageCorrect).toBe(0.5)
  expect(linear([1, 2, 8, 9], [1, 2, 3, 4]).percentageCorrect).toBe(0.5)
  expect(linear([1, 2, 3, 5], [1, 2, 3, 4]).percentageCorrect).toBe(0.75)
  expect(linear([1, 2, 3], [1, 2, 3, 4]).percentageCorrect).toBe(0.75)
  expect(linear([1, 2, 3, 4], [1, 2, 3, 4]).percentageCorrect).toBe(1)
  expect(linear([1, 5, 4, 3, 2, 1, 2, 3, 4, 2], [1, 2, 3, 4]).percentageCorrect).toBe(1)
})
