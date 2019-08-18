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
  const wrapper = shallowMount(TitleBar, {
    stubs: ['router-link'],
    mocks: {
      $electron: {
        ipcRenderer: {
          on: jest.fn(),
          send: jest.fn(),
        },
      },
    },
  })
  wrapper.vm.minimize()
  expect(wrapper.vm.$electron.ipcRenderer.send).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$electron.ipcRenderer.send).toHaveBeenLastCalledWith('window', 'minimize')
  wrapper.vm.maximize()
  expect(wrapper.vm.$electron.ipcRenderer.send).toHaveBeenCalledTimes(2)
  expect(wrapper.vm.$electron.ipcRenderer.send).toHaveBeenLastCalledWith('window', 'maximize')
})

test('Set Maximized', () => {
  const wrapper = shallowMount(TitleBar, {
    stubs: ['router-link'],
    mocks: {
      $electron: {
        ipcRenderer: {
          on: jest.fn(),
          send: jest.fn(),
        },
      },
    },
  })
  wrapper.vm.setMaximized('', 'maximized')
  expect(wrapper.vm.maximized).toBeTruthy()
  wrapper.vm.setMaximized('', 'minimise')
  expect(wrapper.vm.maximized).toBeFalsy()
})
