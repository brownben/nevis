import { shallowMount } from '@vue/test-utils'
import TitleBar from '@/components/TitleBar'

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(TitleBar, {
    stubs: ['router-link'],
    mocks: {
      $electron: { ipcRenderer: { on: jest.fn() } },
    },
  })
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly', () => {
  const wrapper = shallowMount(TitleBar, {
    stubs: ['router-link'],
    mocks: {
      $electron: { ipcRenderer: { on: jest.fn() } },
    },
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Close', () => {
  window.close = jest.fn()
  const wrapper = shallowMount(TitleBar, {
    stubs: ['router-link'],
    mocks: {
      $electron: { ipcRenderer: { on: jest.fn() } },
    },
  })
  wrapper.vm.close()
  expect(window.close).toHaveBeenCalledTimes(1)
})

test('Minimise/ Maximise', () => {
  const mockSend = jest.fn()
  const wrapper = shallowMount(TitleBar, {
    stubs: ['router-link'],
    mocks: {
      $electron: {
        ipcRenderer: {
          on: jest.fn(),
          send: mockSend,
        },
      },
    },
  })
  wrapper.vm.minimize()
  expect(mockSend).toHaveBeenCalledTimes(1)
  expect(mockSend).toHaveBeenLastCalledWith('window', 'minimize')
  wrapper.vm.maximize()
  expect(mockSend).toHaveBeenCalledTimes(2)
  expect(mockSend).toHaveBeenLastCalledWith('window', 'maximize')
})
