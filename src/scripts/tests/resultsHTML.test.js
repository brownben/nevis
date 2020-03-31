import * as resultsHTML from '@/scripts/resultsHTML'

test('competitorPosition', () => {
  expect(resultsHTML.competitorPosition({ errors: '', position: 7 })).toBe(7)
  expect(resultsHTML.competitorPosition({ errors: 'W', position: 7 })).toBe('')
})

test('resultRow', () => {
  expect(
    resultsHTML.resultRow({
      errors: 'M5',
      name: 'Bob',
      ageClass: 'M20',
      club: 'HAT',
    })
  ).toBe(`
    <tr>
      <td></td>
      <td>Bob</td>
      <td class="ageClass">M20</td>
      <td class="club">HAT</td>
      <td>M5</td>
    </tr>
`)

  expect(
    resultsHTML.resultRow({
      errors: 'M5',
    })
  ).toBe(`
    <tr>
      <td></td>
      <td></td>
      <td class="ageClass"></td>
      <td class="club"></td>
      <td>M5</td>
    </tr>
`)
})

test('courseTable', () => {
  expect(
    resultsHTML.courseTable({ name: 'name', length: 1000, climb: 2 }, 'results')
  ).toBe(`
  <div class="course">
    <h2>name</h2>
    <p>1km 2m</p>
    <table>
      <tr>
        <th>Pos.</th>
        <th>Name</th>
        <th class="ageClass">Age Class</th>
        <th class="club">Club</th>
        <th>Time</th>
      </tr>
      results
    </table>
  </div>
`)
})

test('style', () => {
  expect(resultsHTML.style()).toEqual(expect.stringContaining('{'))
})

test('htmlPage', () => {
  expect(resultsHTML.htmlPage({ name: 'Event Name' }, '')).toEqual(
    expect.stringContaining('<!DOCTYPE html>')
  )
})
