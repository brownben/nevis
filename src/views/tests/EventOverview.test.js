import { mount, shallowMount } from '@vue/test-utils'
import EventOverview from '@/views/EventOverview'

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(EventOverview, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 } },
      $messages: { addMessage: jest.fn() },
    },
  })
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly', () => {
  const wrapper = shallowMount(EventOverview, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 } },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setData({ event: { id: 12, name: 'Test Event', date: '11/22/33' } })
  expect(wrapper.element).toMatchSnapshot()
})

test('Not Connected to the Database', () => {
  const wrapper = shallowMount(EventOverview, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: false, query: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 } },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/')
})

test('Get Event Details - Success', async () => {
  const wrapper = mount(EventOverview, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue(['hello']) },
      $route: { params: { id: 12 } },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.getEventDetails()
  expect(wrapper.vm.event).toBe('hello')
})

test('Get Event Details - Error', async () => {
  const wrapper = mount(EventOverview, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { id: 12 } },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.getEventDetails()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Fetching Event Data', 'error')
  expect(wrapper.vm.event).toEqual({})
})
