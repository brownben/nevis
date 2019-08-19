import { mount, shallowMount } from '@vue/test-utils'
import Competitors from '@/views/Competitors'

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(Competitors, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly - No Competitors', () => {
  const wrapper = shallowMount(Competitors, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Renders Correctly - With Competitors', () => {
  const wrapper = shallowMount(Competitors, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setData({
    competitors: [
      { id: 0, name: 'Bob', course: 1, siid: '154585' },
      { id: 77, name: 'Shaun', course: 2, siid: '12345' },
    ],
    courses: { 1: 'Long', 2: 'short' },
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Not Connected to the Database', () => {
  const wrapper = shallowMount(Competitors, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: false, query: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/')
})

test('Get Competitors - Success', async () => {
  const wrapper = mount(Competitors, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue(['hello']) },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.getCompetitors()
  expect(wrapper.vm.competitors).toEqual(['hello'])
})

test('Get Competitors - Error', async () => {
  const wrapper = mount(Competitors, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.getCompetitors()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Fetching Entries', 'error')
  expect(wrapper.vm.competitors.length).toBe(0)
})

test('Get Courses - Success', async () => {
  const wrapper = mount(Competitors, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue([
          { id: 0, name: 'Long', length: 2.35, climb: 150, controls: '101,102,103' },
          { id: 77, name: 'Short', length: 1.75, climb: 15, controls: '100,108,103' },
        ]),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.getCourses()
  expect(wrapper.vm.courses).toEqual({ 0: 'Long', 77: 'Short' })
})

test('Get Courses - Error', async () => {
  const wrapper = mount(Competitors, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.getCourses()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Fetching Courses', 'error')
  expect(wrapper.vm.courses).toEqual({})
})
