import { shallowMount } from '@vue/test-utils'
import CompetitorForm from '@/views/CompetitorForm'

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly - Create', () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Renders Correctly - Update', () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue({}) },
      $route: { params: { eventId: 12 }, path: '/events/edit/12' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setMethods({ getCourseNameFromId: jest.fn(), getCourseIdFromName: jest.fn() })
  wrapper.setData({
    competitor: {
      name: 'Bob',
      event: 12,
      siid: '12345',
      membershipNumber: '',
      ageClass: 'M16',
      club: 'HAT',
      course: 'Long',
      downloaded: false,
    },
    courses: [],
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Not Connected to the Database', () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: false, query: jest.fn().mockResolvedValue({}) },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/')
})

test('Get Competitor Details - Success', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue([{
          name: 'Bob',
          event: 12,
          siid: '12345',
          membershipNumber: '',
          ageClass: 'M16',
          club: 'HAT',
          course: 7,
          downloaded: false,
        }]),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setMethods({ getCourseNameFromId: jest.fn().mockResolvedValue('Long'), getCourseIdFromName: jest.fn() })
  await wrapper.vm.getCompetitorDetails()
  expect(wrapper.vm.competitor).toEqual({
    name: 'Bob',
    event: 12,
    siid: '12345',
    membershipNumber: '',
    ageClass: 'M16',
    club: 'HAT',
    course: 'Long',
    downloaded: false,
  })
})

test('Get Competitor Details - No Data', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue({}) },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setMethods({ getCourseNameFromId: jest.fn(), getCourseIdFromName: jest.fn() })
  wrapper.setData({ courses: [] })
  await wrapper.vm.getCompetitorDetails()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Fetching Entry Data', 'error')
  expect(wrapper.vm.competitor.name).toBe('')
})

test('Get Competitor Details - Error', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setMethods({ getCourseNameFromId: jest.fn(), getCourseIdFromName: jest.fn() })
  await wrapper.vm.getCompetitorDetails()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Fetching Entry Data', 'error')
  expect(wrapper.vm.competitor.name).toBe('')
})

test('Create Competitor - Success', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue({}) },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setMethods({ getCourseNameFromId: jest.fn(), getCourseIdFromName: jest.fn() })
  wrapper.setData({ competitor: { name: 'Test', date: '' } })
  await wrapper.vm.createCompetitor()
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/events/12/competitors')
})

test('Create Competitor - Error', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setMethods({ getCourseNameFromId: jest.fn(), getCourseIdFromName: jest.fn() })
  await wrapper.vm.createCompetitor()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Creating Entry', 'error')
})

test('Update Competitor - Success', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue({}) },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setMethods({ getCourseNameFromId: jest.fn(), getCourseIdFromName: jest.fn() })
  await wrapper.vm.updateCompetitor()
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/events/12/competitors')
})

test('Update Competitor - Error', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setMethods({ getCourseNameFromId: jest.fn(), getCourseIdFromName: jest.fn() })
  await wrapper.vm.updateCompetitor()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Updating Entry', 'error')
})

test('Delete Competitor - Success', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue({}) },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setMethods({ getCourseNameFromId: jest.fn(), getCourseIdFromName: jest.fn() })
  wrapper.setData({ competitor: { id: 0, name: 'Test' } })
  await wrapper.vm.deleteCompetitor()
  expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/events/12/competitors')
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Entry for "Test" Deleted')
})

test('Delete Competitor - Error', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setMethods({ getCourseNameFromId: jest.fn(), getCourseIdFromName: jest.fn() })
  await wrapper.vm.deleteCompetitor()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Deleting Entry', 'error')
})

test('Submit', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue({}) },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setMethods({
    checkForDuplicateSIID: jest.fn(),
    updateCompetitor: jest.fn(),
    createCompetitor: jest.fn(),
  })

  await wrapper.vm.submit()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Please Enter a Name', 'error')

  wrapper.setData({ competitor: { name: 'A', siid: 'A' } })
  wrapper.vm.checkForDuplicateSIID.mockResolvedValue(true)
  await wrapper.vm.submit()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(2)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('An Entry with that SI Card Already Exists', 'error')

  wrapper.vm.checkForDuplicateSIID.mockResolvedValue(false)
  await wrapper.vm.submit()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(3)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Please Enter a Valid SI Card Number', 'error')

  wrapper.setData({ competitor: { siid: '12345' } })
  await wrapper.vm.submit()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(4)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Please Select a Course', 'error')

  wrapper.setData({ competitor: { course: 'hello' } })
  await wrapper.vm.submit()
  expect(wrapper.vm.createCompetitor).toHaveBeenCalledTimes(1)

  wrapper.setData({ competitor: { id: 2 } })
  await wrapper.vm.submit()
  expect(wrapper.vm.updateCompetitor).toHaveBeenCalledTimes(1)
})

test('Get Course Id From Name', () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue({}) },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setData({ courses: [{ id: 0, name: 'A' }, { id: 1, name: 'B' }, { id: 4, name: 'C' }] })
  expect(wrapper.vm.getCourseIdFromName('A')).toBe(0)
  expect(wrapper.vm.getCourseIdFromName('C')).toBe(4)
})

test('Get Course Name From Id', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue({}) },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setMethods({ getCourses: jest.fn() })
  wrapper.setData({ competitor: { course: 7 }, courses: [{ id: 0, name: 'A' }, { id: 1, name: 'B' }, { id: 4, name: 'C' }] })
  expect(await wrapper.vm.getCourseNameFromId(0)).toBe('A')
  expect(await wrapper.vm.getCourseNameFromId(4)).toBe('C')
  expect(wrapper.vm.getCourses).toHaveBeenCalledTimes(2)
  wrapper.setData({ competitor: { course: null } })
  expect(await wrapper.vm.getCourseNameFromId(0)).toBe('')
  expect(await wrapper.vm.getCourseNameFromId(4)).toBe('')
  expect(wrapper.vm.getCourses).toHaveBeenCalledTimes(4)
})

test('Check Duplicate SIID', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue([]) },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setData({ competitor: { id: 2 } })
  expect(await wrapper.vm.checkForDuplicateSIID()).toBeFalsy()
  wrapper.vm.$database.query.mockResolvedValue([{ downloaded: true, id: 1 }, { downloaded: true, id: 1 }, { downloaded: true, id: 1 }])
  expect(await wrapper.vm.checkForDuplicateSIID()).toBeFalsy()
  wrapper.vm.$database.query.mockResolvedValue([{ downloaded: true, id: 1 }, { downloaded: false, id: 1 }, { downloaded: true, id: 1 }])
  expect(await wrapper.vm.checkForDuplicateSIID()).toBeTruthy()
  wrapper.vm.$database.query.mockResolvedValue([{ downloaded: false, id: 1 }])
  expect(await wrapper.vm.checkForDuplicateSIID()).toBeTruthy()
  wrapper.vm.$database.query.mockResolvedValue([{ downloaded: false, id: 2 }])
  expect(await wrapper.vm.checkForDuplicateSIID()).toBeFalsy()
  wrapper.vm.$database.query.mockResolvedValue([{ downloaded: true, id: 1 }, { downloaded: false, id: 2 }, { downloaded: true, id: 1 }])
  expect(await wrapper.vm.checkForDuplicateSIID()).toBeFalsy()
})

test('On Confirm', () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setMethods({ deleteCompetitor: jest.fn() })
  wrapper.vm.onConfirm(false)
  expect(wrapper.vm.deleteCompetitor).toHaveBeenCalledTimes(0)
  wrapper.vm.onConfirm(true)
  expect(wrapper.vm.deleteCompetitor).toHaveBeenCalledTimes(1)
})
