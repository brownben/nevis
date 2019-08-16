import { mount, shallowMount } from '@vue/test-utils'
import Home from '@/views/Home'

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(Home, {
    stubs: ['router-link'],
  })
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly', () => {
  const wrapper = shallowMount(Home, {
    stubs: ['router-link'],
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Connect to Database - Success', async () => {
  const mockCreateConnection = jest.fn()
  const mockConnect = jest.fn()
  const mockAddMessage = jest.fn()
  const mockRouterPush = jest.fn()
  mockConnect.mockResolvedValue()

  const wrapper = mount(Home, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connect: mockConnect, connected: false },
      $mysql: { createConnection: mockCreateConnection },
      $messages: { addMessage: mockAddMessage },
      $router: { push: mockRouterPush },
    },
  })
  await wrapper.vm.connect()
  expect(mockCreateConnection).toHaveBeenCalledTimes(1)
  expect(mockConnect).toHaveBeenCalledTimes(1)
  expect(mockAddMessage).toHaveBeenCalledTimes(0)
  expect(wrapper.vm.$database.connected).toBeTruthy()
  expect(mockRouterPush).toHaveBeenCalledTimes(1)
  expect(mockRouterPush).toHaveBeenLastCalledWith('/events')
})

test('Connect to Database - Error', async () => {
  const mockCreateConnection = jest.fn()
  const mockConnect = jest.fn()
  const mockAddMessage = jest.fn()
  mockConnect.mockRejectedValue('Error')

  const wrapper = mount(Home, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connect: mockConnect, connected: false },
      $mysql: { createConnection: mockCreateConnection },
      $messages: { addMessage: mockAddMessage },
    },
  })
  await wrapper.vm.connect()
  expect(mockCreateConnection).toHaveBeenCalledTimes(1)
  expect(mockConnect).toHaveBeenCalledTimes(1)
  expect(mockAddMessage).toHaveBeenCalledTimes(1)
  expect(mockAddMessage).toHaveBeenLastCalledWith('Error', 'error')
  expect(wrapper.vm.$database.connected).toBeFalsy()
})
