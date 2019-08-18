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
  const wrapper = mount(BackArrow, {
    stubs: ['router-link'],
    mocks: {
      $router: { go: jest.fn() },
    },
  })
  wrapper.find('svg').trigger('click')
  expect(wrapper.vm.$router.go).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$router.go).toHaveBeenLastCalledWith(-1)
})

test('Click - Disabled', () => {
  const wrapper = mount(BackArrow, {
    stubs: ['router-link'],
    propsData: {
      disable: true,
    },
  })
  wrapper.find('svg').trigger('click')
  expect(wrapper.emitted().clicked).toBeTruthy()
})

test('Click - To Location', () => {
  const wrapper = mount(BackArrow, {
    stubs: ['router-link'],
    mocks: {
      $router: { push: jest.fn() },
    },
    propsData: {
      to: '/about',
    },
  })
  wrapper.find('svg').trigger('click')
  expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/about')
})
