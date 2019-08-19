import { mount } from '@vue/test-utils'
import ConfirmationDialog from '@/components/ConfirmationDialog'

test('Is a Vue Instance', () => {
  const wrapper = mount(ConfirmationDialog, {
    stubs: ['router-link'],
  })
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly', () => {
  const wrapper = mount(ConfirmationDialog, {
    stubs: ['router-link'],
  })
  wrapper.setProps({
    title: 'Pop-up',
    message: 'Hello',
    cancel: 'Cancel',
    confirm: 'Hello',
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Emits Value on Close', () => {
  const wrapper = mount(ConfirmationDialog, {
    stubs: ['router-link'],
  })
  wrapper.vm.confirmAction('Hello')
  wrapper.vm.confirmAction(123)
  expect(wrapper.emitted().close.length).toBe(2)
  expect(wrapper.emitted().close[0]).toEqual(['Hello'])
  expect(wrapper.emitted().close[1]).toEqual([123])
})
