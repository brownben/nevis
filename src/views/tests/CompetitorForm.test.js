import { shallowMount } from '@vue/test-utils'
import CompetitorForm from '@/views/CompetitorForm'

import courseMatching from '@/scripts/courseMatching/courseMatching'
jest.mock('@/scripts/courseMatching/courseMatching')

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly - Create', () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $archive: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Renders Correctly - Update', () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue({}),
      },
      $route: { params: { eventId: 12 }, path: '/events/edit/12' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({
    getCourseNameFromId: jest.fn(),
    getCourseIdFromName: jest.fn(),
  })
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
      $database: {
        connection: {},
        connected: false,
        query: jest.fn().mockResolvedValue({}),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
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
        query: jest.fn().mockResolvedValue([
          {
            name: 'Bob',
            event: 12,
            siid: '12345',
            membershipNumber: '',
            ageClass: 'M16',
            club: 'HAT',
            course: 7,
            downloaded: false,
          },
        ]),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({
    getCourseNameFromId: jest.fn().mockResolvedValue('Long'),
    getCourseIdFromName: jest.fn(),
  })
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
    courseId: 7,
  })
})

test('Get Competitor Details - No Data', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue({}),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({
    getCourseNameFromId: jest.fn(),
    getCourseIdFromName: jest.fn(),
  })
  wrapper.setData({ courses: [] })
  await wrapper.vm.getCompetitorDetails()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Fetching Entry Data',
    'error'
  )
  expect(wrapper.vm.competitor.name).toBe('')
})

test('Get Competitor Details - Error', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({
    getCourseNameFromId: jest.fn(),
    getCourseIdFromName: jest.fn(),
  })
  await wrapper.vm.getCompetitorDetails()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Fetching Entry Data',
    'error'
  )
  expect(wrapper.vm.competitor.name).toBe('')
})

test('Get Competitor Details - Call Get Punches', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue([{ downloaded: true }]),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({ getCompetitorPunches: jest.fn() })
  await wrapper.vm.getCompetitorDetails()
  expect(wrapper.vm.getCompetitorPunches).toHaveBeenCalledTimes(1)
})

test('Create Competitor - Success', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue({}),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({
    getCourseNameFromId: jest.fn(),
    getCourseIdFromName: jest.fn(),
  })
  wrapper.setData({ competitor: { name: 'Test', date: '' } })
  await wrapper.vm.createCompetitor()
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith(
    '/events/12/competitors'
  )
})

test('Create Competitor - Error', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({
    getCourseNameFromId: jest.fn(),
    getCourseIdFromName: jest.fn(),
  })
  await wrapper.vm.createCompetitor()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Creating Entry',
    'error'
  )
})

test('Update Competitor - Success', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue({}),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({
    getCourseNameFromId: jest.fn(),
    getCourseIdFromName: jest.fn(),
  })
  await wrapper.vm.updateCompetitor()
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith(
    '/events/12/competitors'
  )
})

test('Update Competitor - Error', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({
    getCourseNameFromId: jest.fn(),
    getCourseIdFromName: jest.fn(),
  })
  await wrapper.vm.updateCompetitor()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Updating Entry',
    'error'
  )
})

test('Delete Competitor - Success', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue({}),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({
    getCourseNameFromId: jest.fn(),
    getCourseIdFromName: jest.fn(),
  })
  wrapper.setData({ competitor: { id: 0, name: 'Test' } })
  await wrapper.vm.deleteCompetitor()
  expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith(
    '/events/12/competitors'
  )
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Entry for "Test" Deleted'
  )
})

test('Delete Competitor - Error', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({
    getCourseNameFromId: jest.fn(),
    getCourseIdFromName: jest.fn(),
  })
  await wrapper.vm.deleteCompetitor()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Deleting Entry',
    'error'
  )
})

test('Submit', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue({}),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({
    checkForDuplicateSIID: jest.fn(),
    updateCompetitor: jest.fn(),
    createCompetitor: jest.fn(),
  })

  await wrapper.vm.submit()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Please Enter a Name',
    'error'
  )

  wrapper.setData({ competitor: { name: 'A', siid: 'A' } })
  wrapper.vm.checkForDuplicateSIID.mockResolvedValue(true)
  await wrapper.vm.submit()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(2)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'An Entry with that SI Card Already Exists',
    'error'
  )

  wrapper.vm.checkForDuplicateSIID.mockResolvedValue(false)
  await wrapper.vm.submit()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(3)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Please Enter a Valid SI Card Number',
    'error'
  )

  wrapper.setData({ competitor: { siid: '12345' } })
  await wrapper.vm.submit()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(4)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Please Select a Course',
    'error'
  )

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
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue({}),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setData({
    courses: [
      { id: 0, name: 'A' },
      { id: 1, name: 'B' },
      { id: 4, name: 'C' },
    ],
  })
  expect(wrapper.vm.getCourseIdFromName('A')).toBe(0)
  expect(wrapper.vm.getCourseIdFromName('C')).toBe(4)
})

test('Get Course Name From Id', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue({}),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({ getCourses: jest.fn() })
  wrapper.setData({
    competitor: { course: 7 },
    courses: [
      { id: 0, name: 'A' },
      { id: 1, name: 'B' },
      { id: 4, name: 'C' },
    ],
  })
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
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue([]),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setData({ competitor: { id: 2 } })
  expect(await wrapper.vm.checkForDuplicateSIID()).toBeFalsy()
  wrapper.vm.$database.query.mockResolvedValue([
    { downloaded: true, id: 1 },
    { downloaded: true, id: 1 },
    { downloaded: true, id: 1 },
  ])
  expect(await wrapper.vm.checkForDuplicateSIID()).toBeFalsy()
  wrapper.vm.$database.query.mockResolvedValue([
    { downloaded: true, id: 1 },
    { downloaded: false, id: 1 },
    { downloaded: true, id: 1 },
  ])
  expect(await wrapper.vm.checkForDuplicateSIID()).toBeTruthy()
  wrapper.vm.$database.query.mockResolvedValue([{ downloaded: false, id: 1 }])
  expect(await wrapper.vm.checkForDuplicateSIID()).toBeTruthy()
  wrapper.vm.$database.query.mockResolvedValue([{ downloaded: false, id: 2 }])
  expect(await wrapper.vm.checkForDuplicateSIID()).toBeFalsy()
  wrapper.vm.$database.query.mockResolvedValue([
    { downloaded: true, id: 1 },
    { downloaded: false, id: 2 },
    { downloaded: true, id: 1 },
  ])
  expect(await wrapper.vm.checkForDuplicateSIID()).toBeFalsy()
})

test('On Delete Confirm', () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({ deleteCompetitor: jest.fn() })
  wrapper.vm.onDeleteConfirm(false)
  expect(wrapper.vm.deleteCompetitor).toHaveBeenCalledTimes(0)
  wrapper.vm.onDeleteConfirm(true)
  expect(wrapper.vm.deleteCompetitor).toHaveBeenCalledTimes(1)
})

test('Clear Form', () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setData({ competitor: { name: 'Hello', siid: 'World' } })
  wrapper.vm.clearForm()
  expect(wrapper.vm.competitor.name).toBe('')
  expect(wrapper.vm.competitor.siid).toBe('')
})

test('Calculating Age Class', () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  expect(wrapper.vm.calculateAgeClass('m', '2001')).toBe('M20')
})

test('On Archive Select', () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.vm.onArchiveSelect(false)
  expect(wrapper.vm.archiveData).toEqual([])
  expect(wrapper.vm.competitor).toEqual({
    club: '',
    ageClass: '',
    course: '',
    downloaded: false,
    id: undefined,
    membershipNumber: '',
    name: '',
    siid: '',
    nonCompetitive: false,
  })
  wrapper.vm.onArchiveSelect({
    name: 'Hi',
    siid: '123',
    id: 4,
    gender: 'f',
    yearOfBirth: '2003',
  })
  expect(wrapper.vm.competitor).toEqual({
    name: 'Hi',
    siid: '123',
    id: null,
    ageClass: 'W18',
    gender: 'f',
    yearOfBirth: '2003',
  })
  wrapper.vm.onArchiveSelect({
    name: 'Hi',
    siid: '123',
    id: 4,
    gender: 'f',
    yearOfBirth: '2003',
    status: 'Lost',
  })
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'This SI Card is Marked as Lost',
    'warning'
  )
})

test('Search Archive - One Result', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $archive: {
        connection: {},
        connected: true,
        query: jest
          .fn()
          .mockResolvedValue([
            { gender: 'm', yearOfBirth: '2001', name: 'Bob' },
          ]),
      },
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue([]),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({
    getCourseNameFromId: jest.fn(),
    getCourseIdFromName: jest.fn(),
  })
  await wrapper.vm.searchArchive()
  expect(wrapper.vm.competitor.name).toBe('Bob')
  expect(wrapper.vm.competitor.id).toBe(null)
})

test('Search Archive - One Result - Lost', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $archive: {
        connection: {},
        connected: true,
        query: jest
          .fn()
          .mockResolvedValue([
            { gender: 'm', yearOfBirth: '2001', name: 'Bob', status: 'Lost' },
          ]),
      },
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue([]),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({
    getCourseNameFromId: jest.fn(),
    getCourseIdFromName: jest.fn(),
  })
  await wrapper.vm.searchArchive()
  expect(wrapper.vm.competitor.name).toBe('Bob')
  expect(wrapper.vm.competitor.id).toBe(null)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'This SI Card is Marked as Lost',
    'warning'
  )
})

test('Search Archive - Show Dialog', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $archive: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue([1, 2, 3]),
      },
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue([]),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({
    getCourseNameFromId: jest.fn(),
    getCourseIdFromName: jest.fn(),
  })
  await wrapper.vm.searchArchive()
  expect(wrapper.vm.showArchiveDialog).toBeTruthy()
  expect(wrapper.vm.archiveData).toEqual([1, 2, 3])
})

test('Search Archive - Error', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $archive: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue([]),
      },
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue([]),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
    methods: {
      getCourses: jest.fn(),
    },
  })
  wrapper.setMethods({
    getCourseNameFromId: jest.fn(),
    getCourseIdFromName: jest.fn(),
  })
  await wrapper.vm.searchArchive()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Fetching Data From Archive',
    'error'
  )
})

test('Get Competitor Punches - Success', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(['hello']),
      },
      $archive: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue([]),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.getCompetitorPunches()
  expect(wrapper.vm.punches).toEqual(['hello'])
})

test('Get Competitor Punches Error', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue({}),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.getCompetitorPunches()
  expect(wrapper.vm.punches).toEqual([])
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Fetching Competitors Punches',
    'error'
  )
})

test('Calculate Time', () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })

  expect(
    wrapper.vm.calculateTime({ errors: '' }, [
      { controlCode: 'S', time: 10 },
      { controlCode: 'F', time: 19 },
    ]).displayTime
  ).toBe('00:09')

  expect(
    wrapper.vm.calculateTime({ errors: '' }, [
      { controlCode: 'S', time: 10 },
      { controlCode: 'F', time: 130 },
    ]).displayTime
  ).toBe('02:00')

  expect(
    wrapper.vm.calculateTime({ errors: '' }, [
      { controlCode: 'S', time: 10 },
      { controlCode: 'F', time: 139 },
    ]).displayTime
  ).toBe('02:09')

  expect(
    wrapper.vm.calculateTime({ errors: 'M1' }, [
      { controlCode: 'S', time: 10 },
      { controlCode: 'F', time: 19 },
    ]).displayTime
  ).toBe('M1')

  expect(
    wrapper.vm.calculateTime({ errors: '' }, [{ controlCode: 'F', time: 19 }])
      .displayTime
  ).toBe('MS')

  expect(
    wrapper.vm.calculateTime({ errors: 'M1' }, [{ controlCode: 'F', time: 19 }])
      .displayTime
  ).toBe('MS M1')

  expect(
    wrapper.vm.calculateTime({ errors: '' }, [{ controlCode: 'S', time: 10 }])
      .displayTime
  ).toBe('Rtd')

  expect(
    wrapper.vm.calculateTime({ errors: 'M1' }, [{ controlCode: 'S', time: 10 }])
      .displayTime
  ).toBe('Rtd')
})

test('Recalculate Results', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
    methods: {
      getCourseIdFromName: jest.fn(() => 7),
      calculateTime: jest.fn(() => ({ time: 7, errors: 'M4' })),
      getCourses: jest.fn(),
    },
  })

  wrapper.setData({
    originalCourse: 'hello',
    competitor: { id: 6, name: 'Bob', course: 'hello' },
    punches: [
      { controlCode: 'S' },
      { controlCode: 'F' },
      { controlCode: '101' },
      { controlCode: '102' },
      { controlCode: '103' },
    ],
    courses: [{ id: 7, controls: '101,102,103' }],
  })
  expect(wrapper.vm.recalculateResult()).toBe(undefined)

  wrapper.setData({ originalCourse: 'hello', competitor: { course: 'world' } })
  courseMatching.linear = jest.fn(() => ({ errors: 'M4', links: '[]' }))
  await wrapper.vm.recalculateResult()
  expect(courseMatching.linear).not.toHaveBeenCalledWith(
    [{ controlCode: '101' }, { controlCode: '102' }, { controlCode: '103' }],
    ['101', '102', '103']
  )

  wrapper.setData({
    originalCourse: 'hello',
    competitor: { course: 'world', downloaded: true },
  })
  await wrapper.vm.recalculateResult()
  expect(courseMatching.linear).toHaveBeenCalledWith(
    [{ controlCode: '101' }, { controlCode: '102' }, { controlCode: '103' }],
    ['101', '102', '103']
  )
  expect(wrapper.vm.$database.query).toHaveBeenCalledWith(
    'REPLACE INTO results SET ?',
    {
      time: 7,
      links: JSON.stringify([]),
      errors: 'M4',
      competitor: 6,
      event: 12,
    }
  )
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    '"Bob" result recalculated'
  )

  wrapper.vm.$database.query.mockRejectedValue()
  await wrapper.vm.recalculateResult()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Recalculating Result',
    'error'
  )
})

test('Get Courses - Success', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(['hello']),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.getCourses()
  expect(wrapper.vm.courses).toEqual(['hello'])
})

test('Get Courses - Error', async () => {
  const wrapper = shallowMount(CompetitorForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.getCourses()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Fetching Courses',
    'error'
  )
  expect(wrapper.vm.courses.length).toBe(0)
})
