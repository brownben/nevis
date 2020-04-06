import { shallowMount } from '@vue/test-utils'
import SafetyCheck from '@/views/SafetyCheck'

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(SafetyCheck, {
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

test('Renders Correctly', () => {
  const wrapper = shallowMount(SafetyCheck, {
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
  wrapper.setData({
    outstandingCompetitors: [
      { name: 'Bob', controlCode: 202, time: 5655, course: 'Long' },
      { name: 'James', controlCode: 202, time: 4555, course: 'Short' },
      { name: 'Alfie', controlCode: 201, time: 5665, club: 'HAT' },
    ],
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Not Connected to the Database', () => {
  const wrapper = shallowMount(SafetyCheck, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: false,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
      $serialPort: {
        list: jest.fn().mockResolvedValue([]),
        open: jest.fn(),
        close: jest.fn(),
      },
    },
  })
  expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/')
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Connecting To Database',
    'error'
  )
})

test('Punch Record To Array', () => {
  const wrapper = shallowMount(SafetyCheck, {
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
  expect(wrapper.vm.punchRecordToArray([])).toEqual([])
  expect(wrapper.vm.punchRecordToArray([{}])).toEqual([
    [undefined, undefined, undefined, undefined, undefined],
  ])
  expect(
    wrapper.vm.punchRecordToArray([
      {
        competitor: 7,
        controlCode: 202,
        time: 777,
        event: 3,
        type: 'imported',
      },
      {
        competitor: 5,
        controlCode: 202,
        time: 547,
        event: 3,
        type: 'imported',
      },
    ])
  ).toEqual([
    [7, 202, 777, 3, 'imported'],
    [5, 202, 547, 3, 'imported'],
  ])
})

test('Raw File to Punch Records', () => {
  const wrapper = shallowMount(SafetyCheck, {
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
  expect(wrapper.vm.rawFileToPunchRecords(``)).toEqual([])
  expect(
    wrapper.vm.rawFileToPunchRecords(
      `No;Read on;SIID;Control time;Battery voltage;Serial number;Code number;DayOfWeek;Punch DateTime;Operating mode;SIAC number;SIAC Count;SIAC radio mode;SIAC is battery low;SIAC is card full;SIAC beacon mode;SIAC is gate mode;`
    )
  ).toEqual([])
  expect(
    wrapper.vm.rawFileToPunchRecords(
      `
      No;Read on;SIID;Control time;Battery voltage;Serial number;Code number;DayOfWeek;Punch DateTime;Operating mode;SIAC number;SIAC Count;SIAC radio mode;SIAC is battery low;SIAC is card full;SIAC beacon mode;SIAC is gate mode;
      1;2020-04-01 15:09:58;2047481;01/04/2020   13:59:22.468;;;102;We;13:59:22.468;Control;0;1;;;;;;
      2;2020-04-01 15:09:58;2047471;01/04/2020   13:59:26.312;;;102;We;13:59:26.312;Control;0;1;;;;;;
      3;2020-04-01 15:09:58;2047461;01/04/2020   13:59:29.148;;;102;We;13:59:29.148;Control;0;1;;;;;;
      4;2020-04-01 15:09:58;2047481;01/04/2020   13:59:40.398;;;102;We;13:59:40.398;Control;0;1;;;;;;

      `
    )
  ).toEqual([
    {
      controlCode: 102,
      event: undefined,
      siid: 2047481,
      time: 50362,
      type: 'imported',
    },
    {
      controlCode: 102,
      event: undefined,
      siid: 2047471,
      time: 50366,
      type: 'imported',
    },
    {
      controlCode: 102,
      event: undefined,
      siid: 2047461,
      time: 50369,
      type: 'imported',
    },
    {
      controlCode: 102,
      event: undefined,
      siid: 2047481,
      time: 50380,
      type: 'imported',
    },
  ])
})

test('Get Outstanding Competitors - Success', async () => {
  const wrapper = shallowMount(SafetyCheck, {
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
        query: jest.fn().mockResolvedValue([1, 2, 3]),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.getOutstandingCompetitors()
  expect(wrapper.vm.$database.query).toHaveBeenCalledWith(expect.any(String), [
    12,
  ])
  expect(wrapper.vm.outstandingCompetitors).toEqual([1, 2, 3])
})
test('Get Outstanding Competitors - Failure', async () => {
  const wrapper = shallowMount(SafetyCheck, {
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
        query: jest.fn().mockRejectedValue([1, 2, 3]),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.getOutstandingCompetitors()
  expect(wrapper.vm.$database.query).toHaveBeenCalledWith(expect.any(String), [
    12,
  ])
  expect(wrapper.vm.outstandingCompetitors).toEqual([])
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledWith(
    'Problem Fetching Outstanding Competitors',
    'error'
  )
})

test('Filter Existing Punches', async () => {
  const wrapper = shallowMount(SafetyCheck, {
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
        query: jest.fn().mockResolvedValue([]),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  expect(
    await wrapper.vm.filterExistingPunches([
      { siid: 1, time: 1, controlCode: 1 },
      { siid: 3, time: 2, controlCode: 1 },
      { siid: 1, time: 3, controlCode: 1 },
    ])
  ).toEqual([
    { siid: 1, time: 1, controlCode: 1 },
    { siid: 3, time: 2, controlCode: 1 },
    { siid: 1, time: 3, controlCode: 1 },
  ])

  wrapper.vm.$database.query.mockResolvedValue([[1, 1, 1]])

  expect(
    await wrapper.vm.filterExistingPunches([
      { siid: 1, time: 1, controlCode: 1 },
      { siid: 3, time: 2, controlCode: 1 },
      { siid: 1, time: 3, controlCode: 1 },
    ])
  ).toEqual([
    { siid: 3, time: 2, controlCode: 1 },
    { siid: 1, time: 3, controlCode: 1 },
  ])

  expect(wrapper.vm.$database.query).toHaveBeenCalledWith(expect.any(String), [
    12,
  ])
})

test('Import Punches', async () => {
  const wrapper = shallowMount(SafetyCheck, {
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
        query: jest.fn().mockResolvedValue({ affectedRows: 3 }),
      },
      $electron: {
        remote: {
          dialog: {
            showOpenDialog: jest
              .fn()
              .mockResolvedValue({ canceled: false, filePaths: ['hi'] }),
          },
        },
      },
      $fs: { readFile: jest.fn() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({
    rawFileToPunchRecords: jest.fn().mockResolvedValue(),
    findCompetitorForPunches: jest.fn().mockResolvedValue(),
    filterExistingPunches: jest.fn().mockResolvedValue(),
    punchRecordToArray: jest.fn().mockResolvedValue([1, 2, 3]),
    getOutstandingCompetitors: jest.fn().mockResolvedValue(),
  })
  await wrapper.vm.importPunches()
  expect(wrapper.vm.rawFileToPunchRecords).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.findCompetitorForPunches).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.filterExistingPunches).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.punchRecordToArray).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.getOutstandingCompetitors).toHaveBeenCalledTimes(1)
  expect(
    wrapper.vm.$electron.remote.dialog.showOpenDialog
  ).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledWith(
    '3 Punches Imported'
  )
  expect(wrapper.vm.$fs.readFile).toHaveBeenCalledWith('hi', {
    encoding: 'utf8',
  })
  expect(
    wrapper.vm.$database.query
  ).toHaveBeenCalledWith(
    'INSERT INTO punches (competitor,controlCode,time,event,type) VALUES ?',
    [[1, 2, 3]]
  )
})

test('Import Punches - Cancelled', async () => {
  const wrapper = shallowMount(SafetyCheck, {
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
        query: jest.fn().mockResolvedValue({ affectedRows: 3 }),
      },
      $electron: {
        remote: {
          dialog: {
            showOpenDialog: jest
              .fn()
              .mockResolvedValue({ canceled: true, filePaths: ['hi'] }),
          },
        },
      },
      $fs: { readFile: jest.fn() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({
    rawFileToPunchRecords: jest.fn().mockResolvedValue(),
    findCompetitorForPunches: jest.fn().mockResolvedValue(),
    filterExistingPunches: jest.fn().mockResolvedValue(),
    punchRecordToArray: jest.fn().mockResolvedValue([1, 2, 3]),
    getOutstandingCompetitors: jest.fn().mockResolvedValue(),
  })
  await wrapper.vm.importPunches()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledWith(
    'Problem Importing Punches',
    'error'
  )
  expect(wrapper.vm.$fs.readFile).not.toHaveBeenCalledWith('hi', {
    encoding: 'utf8',
  })
})

test('Import Punches - No Punches', async () => {
  const wrapper = shallowMount(SafetyCheck, {
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
        query: jest.fn().mockResolvedValue({ affectedRows: 3 }),
      },
      $electron: {
        remote: {
          dialog: {
            showOpenDialog: jest
              .fn()
              .mockResolvedValue({ canceled: false, filePaths: ['hi'] }),
          },
        },
      },
      $fs: { readFile: jest.fn() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({
    rawFileToPunchRecords: jest.fn().mockResolvedValue(),
    findCompetitorForPunches: jest.fn().mockResolvedValue(),
    filterExistingPunches: jest.fn().mockResolvedValue(),
    punchRecordToArray: jest.fn().mockResolvedValue([]),
    getOutstandingCompetitors: jest.fn().mockResolvedValue(),
  })
  await wrapper.vm.importPunches()
  expect(wrapper.vm.rawFileToPunchRecords).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.findCompetitorForPunches).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.filterExistingPunches).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.punchRecordToArray).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.getOutstandingCompetitors).toHaveBeenCalledTimes(1)
  expect(
    wrapper.vm.$electron.remote.dialog.showOpenDialog
  ).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledWith(
    '0 Punches Imported'
  )
  expect(wrapper.vm.$fs.readFile).toHaveBeenCalledWith('hi', {
    encoding: 'utf8',
  })
})

test('Find Competitor For Punches', async () => {
  const wrapper = shallowMount(SafetyCheck, {
    stubs: ['router-link'],
    mocks: {
      $archive: {
        connection: {},
        connected: true,
        query: jest
          .fn()
          .mockResolvedValueOnce([{ name: 'Bob', membershipNumber: 3 }])
          .mockResolvedValueOnce([]),
      },
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })

  wrapper.vm.$database.query = jest
    .fn()
    .mockResolvedValueOnce([{ id: 3 }])
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce({ insertId: 2 })
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce({ insertId: 1 })

  expect(
    await wrapper.vm.findCompetitorForPunches([
      { siid: 1 },
      { siid: 2 },
      { siid: 3 },
    ])
  ).toEqual([
    { siid: 1, competitor: 3 },
    { siid: 2, competitor: 2 },
    { siid: 3, competitor: 1 },
  ])

  expect(wrapper.vm.$archive.query).toHaveBeenCalledTimes(2)
  expect(wrapper.vm.$database.query).toHaveBeenCalledTimes(5)
  expect(wrapper.vm.$database.query).toHaveBeenCalledWith(
    'INSERT INTO competitors SET ?',
    {
      ageClass: '',
      club: undefined,
      downloaded: false,
      event: 12,
      membershipNumber: 3,
      name: 'Bob',
      siid: 2,
    }
  )
  expect(wrapper.vm.$database.query).toHaveBeenCalledWith(
    'INSERT INTO competitors SET ?',
    {
      downloaded: false,
      event: 12,
      name: 'Unknown',
      siid: 3,
    }
  )
})

test('Change Sort By', () => {
  const wrapper = shallowMount(SafetyCheck, {
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
  wrapper.setMethods({
    getOutstandingCompetitors: jest.fn(),
  })
  wrapper.vm.changeSortBy('name')
  expect(wrapper.vm.sortBy).toBe('name')
  expect(wrapper.vm.sortDirection).toBe('DESC')
  expect(wrapper.vm.getOutstandingCompetitors).toHaveBeenCalledTimes(1)
  wrapper.vm.changeSortBy('name')
  expect(wrapper.vm.sortBy).toBe('name')
  expect(wrapper.vm.sortDirection).toBe('ASC')
  expect(wrapper.vm.getOutstandingCompetitors).toHaveBeenCalledTimes(2)
  wrapper.vm.changeSortBy('siid')
  expect(wrapper.vm.sortBy).toBe('siid')
  expect(wrapper.vm.sortDirection).toBe('ASC')
  expect(wrapper.vm.getOutstandingCompetitors).toHaveBeenCalledTimes(3)
  wrapper.vm.changeSortBy('siid')
  expect(wrapper.vm.sortBy).toBe('siid')
  expect(wrapper.vm.sortDirection).toBe('DESC')
  expect(wrapper.vm.getOutstandingCompetitors).toHaveBeenCalledTimes(4)
})
