import { mount } from '@vue/test-utils'
import BackArrow from '@/components/BackArrow'

test('Is a Vue Instance', () => {
  const wrapper = mount(BackArrow, {
    stubs: ['router-link'],
  })
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly', () => {
  const wrapper = mount(BackArrow, {
    stubs: ['router-link'],
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Click - Back to Previous', () => {
  const mockRouterGo = jest.fn()
  const wrapper = mount(BackArrow, {
    stubs: ['router-link'],
    mocks: {
      $router: { go: mockRouterGo },
    },
  })
  wrapper.find('svg').trigger('click')
  expect(mockRouterGo).toHaveBeenCalledTimes(1)
  expect(mockRouterGo).toHaveBeenLastCalledWith(-1)
})

test('Click - Disabled', () => {
  const mockEmit = jest.fn()
  const wrapper = mount(BackArrow, {
    stubs: ['router-link'],
    mocks: {
      $emit: mockEmit,
    },
    propsData: {
      disable: true,
    },
  })
  wrapper.find('svg').trigger('click')
  expect(mockEmit).toHaveBeenCalledTimes(1)
  expect(mockEmit).toHaveBeenLastCalledWith('clicked')
})

test('Click - To Location', () => {
  const mockRouterPush = jest.fn()
  const wrapper = mount(BackArrow, {
    stubs: ['router-link'],
    mocks: {
      $router: { push: mockRouterPush },
    },
    propsData: {
      to: '/about',
    },
  })
  wrapper.find('svg').trigger('click')
  expect(mockRouterPush).toHaveBeenCalledTimes(1)
  expect(mockRouterPush).toHaveBeenLastCalledWith('/about')
})
