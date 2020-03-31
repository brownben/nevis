import { mount } from '@vue/test-utils'
import TextInput from '@/components/TextInput'

test('Is a Vue Instance', () => {
  const wrapper = mount(TextInput)
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly', () => {
  const wrapper = mount(TextInput, {
    propsData: {},
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Assigns Correct Input Type', () => {
  const wrapper = mount(TextInput, {
    propsData: {
      type: 'password',
    },
  })
  expect(wrapper.vm.inputType).toBe('password')
  wrapper.setProps({ type: '' })
  expect(wrapper.vm.inputType).toBe('text')
  wrapper.setProps({ type: 'text' })
  expect(wrapper.vm.inputType).toBe('text')
})
