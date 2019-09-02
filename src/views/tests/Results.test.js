import { shallowMount } from '@vue/test-utils'
import Results from '@/views/Results'

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(Results, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue() },
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
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue() },
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
      $database: { connection: {}, connected: false, query: jest.fn().mockResolvedValue() },
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
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue(['hello']) },
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
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.getCourses()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Fetching Courses', 'error')
  expect(wrapper.vm.courses.length).toBe(0)
})

test('Get Results - Success', async () => {
  const wrapper = shallowMount(Results, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue(['hello']) },
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
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.getResults()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Fetching Results', 'error')
  expect(wrapper.vm.results.length).toBe(0)
})

test('Competitors On Course', () => {
  const wrapper = shallowMount(Results, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
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
      { course: 1, errors: '', time: 33 },
    ],
  })
  expect(wrapper.vm.competitorsOnCourse(1)).toEqual([
    { course: 1, errors: '', time: 15 },
    { course: 1, errors: '', time: 33 },
    { course: 1, errors: '', time: 35 },
    { course: 1, errors: 'W2', time: 22 },
  ])
  expect(wrapper.vm.competitorsOnCourse(2)).toEqual([
    { course: 2, errors: '', time: 2 },
    { course: 2, errors: 'M4', time: 0 },
  ])
})
