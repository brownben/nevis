import { mount, shallowMount } from '@vue/test-utils'
import Courses from '@/views/Courses'

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(Courses, {
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

test('Renders Correctly - No Courses', () => {
  const wrapper = shallowMount(Courses, {
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

test('Renders Correctly - With Courses', () => {
  const wrapper = shallowMount(Courses, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setData({
    courses: [
      { id: 0, name: 'Long', length: 2.35, climb: 150, controls: '101,102,103' },
      { id: 77, name: 'Short', length: 1.75, climb: 15, controls: '100,108,103' },
    ],
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Not Connected to the Database', () => {
  const wrapper = shallowMount(Courses, {
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

test('Get Courses - Success', async () => {
  const wrapper = mount(Courses, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue(['hello']) },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.getCourses()
  expect(wrapper.vm.courses).toEqual(['hello'])
})

test('Get Courses - Error', async () => {
  const wrapper = mount(Courses, {
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
  expect(wrapper.vm.courses.length).toBe(0)
})
