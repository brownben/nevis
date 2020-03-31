import { mount, shallowMount } from '@vue/test-utils'
import Results from '@/views/Results'

let MockDate = require('mockdate')

MockDate.set('2019-01-01')

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(Results, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly - No Results', () => {
  const wrapper = shallowMount(Results, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Not Connected to the Database', () => {
  const wrapper = shallowMount(Results, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: false,
        query: jest.fn().mockResolvedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/')
})

test('Get Courses - Success', async () => {
  const wrapper = shallowMount(Results, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(['hello']),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.getCourses()
  expect(wrapper.vm.courses).toEqual(['hello'])
})

test('Get Courses - Error', async () => {
  const wrapper = shallowMount(Results, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.getCourses()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Fetching Courses',
    'error'
  )
  expect(wrapper.vm.courses.length).toBe(0)
})

test('Get Results - Success', async () => {
  const wrapper = shallowMount(Results, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(['hello']),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.getResults()
  expect(wrapper.vm.results).toEqual(['hello'])
})

test('Get Results - Error', async () => {
  const wrapper = shallowMount(Results, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.getResults()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Fetching Results',
    'error'
  )
  expect(wrapper.vm.results.length).toBe(0)
})

test('Competitors On Course', () => {
  const wrapper = shallowMount(Results, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setData({
    results: [
      { course: 1, errors: '', time: 35 },
      { course: 2, errors: '', time: 2 },
      { course: 1, errors: 'W2', time: 22 },
      { course: 2, errors: 'M4', time: 0 },
      { course: 1, errors: '', time: 15 },
      { course: 1, errors: '', time: 33, nonCompetitive: true },
    ],
  })
  expect(wrapper.vm.competitorsOnCourse(1)).toEqual([
    { course: 1, errors: '', time: 15, position: 1 },
    { course: 1, errors: '', time: 33, position: 'n/c', nonCompetitive: true },
    { course: 1, errors: '', time: 35, position: 2 },
    { course: 1, errors: 'W2', time: 22, position: 3 },
  ])
  expect(wrapper.vm.competitorsOnCourse(2)).toEqual([
    { course: 2, errors: '', time: 2, position: 1 },
    { course: 2, errors: 'M4', time: 0, position: 2 },
  ])
})

test('Get Event Details - Success', async () => {
  const wrapper = mount(Results, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(['hello']),
      },
      $route: { params: { id: 12 } },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })

  expect(await wrapper.vm.getEventDetails()).toBe('hello')
})

test('Get Event Details - Error', async () => {
  const wrapper = mount(Results, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { id: 12 } },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.getEventDetails()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Fetching Event Data',
    'error'
  )
  expect(await wrapper.vm.getEventDetails()).toEqual(undefined)
})

test('Generate HTML', async () => {
  const wrapper = shallowMount(Results, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({
    getEventDetails: jest.fn().mockResolvedValue({ name: 'a', date: 'b' }),
  })
  wrapper.setData({
    courses: [
      {
        id: 3,
        name: 'Short',
        length: 2530,
        climb: 35,
        type: 'linear',
        controls: '',
        event: 1,
      },
      {
        id: 5,
        name: 'Long',
        length: 7500,
        climb: 250,
        type: 'linear',
        controls: '101,102,103',
        event: 1,
      },
    ],
    results: [{ name: 'Bob', ageClass: 'M20', course: 3, errors: 'M12' }],
  })
  expect(await wrapper.vm.generateHTML()).toEqual(
    expect.stringContaining(`
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>a - Results</title>`)
  )

  expect(await wrapper.vm.generateHTML()).toEqual(
    expect.stringContaining(`<div class="course">
    <h2>Short</h2>
    <p>2.53km 35m</p>
    <table>
      <tr>
        <th>Pos.</th>
        <th>Name</th>
        <th class="ageClass">Age Class</th>
        <th class="club">Club</th>
        <th>Time</th>
      </tr>`)
  )
  expect(await wrapper.vm.generateHTML()).toEqual(
    expect.stringContaining(`<tr>
      <td></td>
      <td>Bob</td>
      <td class="ageClass">M20</td>
      <td class="club"></td>
      <td>M12</td>
    </tr>`)
  )

  expect(await wrapper.vm.generateHTML()).toEqual(
    expect.stringContaining(`</main>
    <footer>
      <p>Created at 2019-01-01 00:00:00 by Nevis </p>
    </footer>
  </body>
</html>`)
  )
})

test('Generate HTML - Error', async () => {
  const wrapper = shallowMount(Results, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })

  wrapper.setMethods({
    getEventDetails: jest.fn().mockResolvedValue({ name: 'a', date: 'b' }),
    courseToHTML: jest.fn(() => {
      throw Error()
    }),
  })
  wrapper.setData({
    courses: [
      {
        id: 3,
        name: 'Short',
        length: 2530,
        climb: 35,
        type: 'linear',
        controls: '',
        event: 1,
      },
      {
        id: 5,
        name: 'Long',
        length: 7500,
        climb: 250,
        type: 'linear',
        controls: '101,102,103',
        event: 1,
      },
    ],
    results: [{ name: 'Bob', ageClass: 'M20', course: 3, errors: 'M12' }],
  })
  await wrapper.vm.generateHTML()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Generating HTML',
    'error'
  )
})

test('Save HTML - Cancelled', async () => {
  const wrapper = shallowMount(Results, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $electron: {
        remote: {
          dialog: {
            showSaveDialog: jest.fn().mockResolvedValue({ canceled: true }),
          },
        },
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })

  await wrapper.vm.saveHTMLResults()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Saving Results',
    'error'
  )
})

test('Save HTML - Success', async () => {
  const wrapper = shallowMount(Results, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $electron: {
        remote: {
          dialog: {
            showSaveDialog: jest
              .fn()
              .mockResolvedValue({ canceled: false, filePath: 'test.html' }),
          },
        },
      },
      $fs: { writeFile: jest.fn() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })

  wrapper.setMethods({
    generateHTML: jest.fn().mockResolvedValue('a'),
  })

  await wrapper.vm.saveHTMLResults()
  expect(wrapper.vm.$fs.writeFile).toHaveBeenLastCalledWith('test.html', 'a', {
    encoding: 'utf8',
  })
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledWith(
    'Results Successfully Written'
  )
})
