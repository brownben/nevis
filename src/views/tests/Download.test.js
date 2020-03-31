import { shallowMount } from '@vue/test-utils'
import Download from '@/views/Download'
import si from '@/scripts/si/si'
import courseMatching from '@/scripts/courseMatching/courseMatching'

jest.mock('@/scripts/si/si')
jest.mock('@/scripts/courseMatching/courseMatching')

test('Is a Vue Instance', () => {
  global.window.require = jest.fn()
  const wrapper = shallowMount(Download, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
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
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly', () => {
  global.window.require = jest.fn()
  const wrapper = shallowMount(Download, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
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
  wrapper.setData({
    lastDownload: {
      name: 'Bob',
      courseName: 'Long',
      time: 'M3',
      siid: '12345',
    },
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Not Connected to the Database', () => {
  const wrapper = shallowMount(Download, {
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
})

test('Exit', () => {
  const wrapper = shallowMount(Download, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
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
  wrapper.vm.exit()
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/events/12')
  expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  wrapper.setData({ connected: true })
  wrapper.vm.exit()
  expect(wrapper.vm.showConfirmationDialog).toBeTruthy()
  expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
})

test('Leave Page', () => {
  const wrapper = shallowMount(Download, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
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
  wrapper.setData({ port: { close: jest.fn() } })
  wrapper.vm.leavePage(true)
  expect(wrapper.vm.port.close).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/events/12')
  expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  wrapper.vm.leavePage(false)
  expect(wrapper.vm.port.close).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/events/12')
  expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
})

test('Selected Baud', () => {
  const wrapper = shallowMount(Download, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
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
  wrapper.setData({ selectedBaudString: 'USB (38400)' })
  expect(wrapper.vm.selectedBaud).toBe(38400)
  wrapper.setData({ selectedBaudString: 'Serial (4800)' })
  expect(wrapper.vm.selectedBaud).toBe(4800)
})

test('Port Functions', () => {
  const wrapper = shallowMount(Download, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
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
  wrapper.vm.portOnOpen()
  expect(wrapper.vm.connected).toBeTruthy()
  expect(wrapper.vm.$messages.clearMessages).toHaveBeenCalledTimes(1)
  wrapper.vm.portOnClose()
  expect(wrapper.vm.connected).toBeFalsy()
  wrapper.vm.portOnError({ message: 'error' })
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'error',
    'error'
  )
  wrapper.setMethods({ saveDownload: jest.fn() })

  si.parseData = jest.fn(() => 'a')
  wrapper.vm.portOnData()
  expect(wrapper.vm.saveDownload).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.saveDownload).toHaveBeenLastCalledWith('a')
  si.parseData = jest.fn(() => false)
  wrapper.vm.portOnData()
  expect(wrapper.vm.saveDownload).toHaveBeenCalledTimes(1)

  si.parseData = jest.fn(() => {
    throw Error()
  })
  wrapper.vm.portOnData()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Saving Download',
    'error'
  )
})

test('Refresh Ports List - Success', async () => {
  const wrapper = shallowMount(Download, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
      $serialPort: {
        list: jest
          .fn()
          .mockResolvedValue([{ comName: 'COM1' }, { comName: 'COM2' }]),
        open: jest.fn(),
        close: jest.fn(),
      },
    },
  })
  await wrapper.vm.refreshPortsList()
  expect(wrapper.vm.portsList).toEqual(['COM1', 'COM2'])
})

test('Refresh Ports List - No Ports', async () => {
  const wrapper = shallowMount(Download, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
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
  await wrapper.vm.refreshPortsList()
  expect(wrapper.vm.portsList).toEqual(['No Ports Found'])
})

test('Refresh Ports List - Error', async () => {
  const wrapper = shallowMount(Download, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
      $serialPort: {
        list: jest.fn().mockRejectedValue(),
        open: jest.fn(),
        close: jest.fn(),
      },
    },
  })
  await wrapper.vm.refreshPortsList()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Finding Ports',
    'error'
  )
})

test('Get Course From Id', async () => {
  const wrapper = shallowMount(Download, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest
          .fn()
          .mockResolvedValue([{ name: 'Hello', controls: '1,2,,3' }]),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
      $serialPort: {
        list: jest.fn().mockRejectedValue(),
        open: jest.fn(),
        close: jest.fn(),
      },
    },
  })
  expect(await wrapper.vm.getCourseFromId(1)).toEqual({
    name: 'Hello',
    controls: ['1', '2', '3'],
  })
})

test('Get Course From Id - Error', async () => {
  const wrapper = shallowMount(Download, {
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
      $serialPort: {
        list: jest.fn().mockRejectedValue(),
        open: jest.fn(),
        close: jest.fn(),
      },
    },
  })
  await wrapper.vm.getCourseFromId(1)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Fetching Courses',
    'error'
  )
})

test('Get Courses', async () => {
  const wrapper = shallowMount(Download, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue([
          { name: 'Hello', controls: '1,2,,3' },
          { name: 'Alpha', controls: '101,525,232' },
        ]),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
      $serialPort: {
        list: jest.fn().mockRejectedValue(),
        open: jest.fn(),
        close: jest.fn(),
      },
    },
  })
  expect(await wrapper.vm.getCourses()).toEqual([
    { name: 'Hello', controls: ['1', '2', '3'] },
    { name: 'Alpha', controls: ['101', '525', '232'] },
  ])
})

test('Get Courses - Error', async () => {
  const wrapper = shallowMount(Download, {
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
      $serialPort: {
        list: jest.fn().mockRejectedValue(),
        open: jest.fn(),
        close: jest.fn(),
      },
    },
  })
  await wrapper.vm.getCourses()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Fetching Courses',
    'error'
  )
})

test('Calculate Time', () => {
  const wrapper = shallowMount(Download, {
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
      $serialPort: {
        list: jest.fn().mockRejectedValue(),
        open: jest.fn(),
        close: jest.fn(),
      },
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

test('Connect to Port - Already Open', () => {
  const wrapper = shallowMount(Download, {
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
      $serialPort: {
        list: jest.fn().mockRejectedValue(),
        open: jest.fn(),
        close: jest.fn(),
      },
    },
  })
  wrapper.setData({ connected: true, port: { close: jest.fn() } })
  wrapper.vm.connect()
  expect(wrapper.vm.port.close).toHaveBeenCalledTimes(1)
})

test('Connect to Port - No Port Selected', () => {
  const wrapper = shallowMount(Download, {
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
      $serialPort: {
        list: jest.fn().mockRejectedValue(),
        open: jest.fn(),
        close: jest.fn(),
        on: jest.fn(),
      },
    },
  })
  wrapper.setData({ connected: false, selectedPort: '' })
  wrapper.vm.connect()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'No Port Selected',
    'error'
  )
})

test('Connect to Port - Open', () => {
  const wrapper = shallowMount(Download, {
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
      $serialPort: function() {
        this.list = jest.fn().mockRejectedValue()
        this.open = jest.fn()
        this.close = jest.fn()
        this.on = jest.fn()
      },
    },
    methods: {
      refreshPortsList: jest.fn(),
    },
  })
  wrapper.setData({ connected: false, selectedPort: 'COM1' })
  wrapper.vm.connect()
  expect(wrapper.vm.port.on).toHaveBeenCalledTimes(4)
})

test('Find Competitor For Download', async () => {
  const wrapper = shallowMount(Download, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn() },
      $archive: { connection: {}, connected: true, query: jest.fn() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
      $serialPort: {
        list: jest.fn().mockRejectedValue(),
        open: jest.fn(),
        close: jest.fn(),
        on: jest.fn(),
      },
    },
  })

  wrapper.vm.$database.query.mockResolvedValue([
    { siid: '123', downloaded: false, name: 'person' },
  ])
  wrapper.vm.$archive.query.mockResolvedValue([])
  expect(await wrapper.vm.findCompetitorForDownload({ siid: '123' })).toEqual({
    siid: '123',
    downloaded: false,
    name: 'person',
  })

  wrapper.vm.$database.query
    .mockResolvedValueOnce([
      { id: 6, siid: '123', downloaded: true, name: 'person' },
    ])
    .mockResolvedValueOnce([{ controlCode: 'S', time: 523 }])
  wrapper.vm.$archive.query.mockResolvedValue([])
  expect(
    await wrapper.vm.findCompetitorForDownload({
      siid: '123',
      punches: [
        { controlCode: 'S', time: 523 },
        { controlCode: '101', time: 452 },
      ],
    })
  ).toEqual({ id: 6, siid: '123', downloaded: true, name: 'person' })
  expect(wrapper.vm.$database.query).toHaveBeenLastCalledWith(
    `DELETE FROM punches WHERE competitor=?`,
    6
  )

  wrapper.vm.$database.query
    .mockResolvedValueOnce([
      { id: 6, siid: '123', downloaded: true, name: 'person' },
    ])
    .mockResolvedValueOnce([{ controlCode: 'S', time: 623 }])
  wrapper.vm.$archive.query.mockResolvedValue([])
  expect(
    await wrapper.vm.findCompetitorForDownload({
      siid: '123',
      punches: [{ controlCode: 'S', time: 523 }],
    })
  ).toEqual({ name: 'Unknown', event: 12, siid: '123', downloaded: false })
  expect(wrapper.vm.$database.query).toHaveBeenLastCalledWith(
    'INSERT INTO competitors SET ?',
    expect.any(Object)
  )

  wrapper.vm.$database.query
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce({ insertId: 5 })
  wrapper.vm.$archive.query.mockResolvedValue([
    { name: 'Bob', siid: '123', gender: 'm', yearOfBirth: '1989' },
  ])
  expect(
    await wrapper.vm.findCompetitorForDownload({
      siid: '123',
      punches: [{ controlCode: 'S', time: 523 }],
    })
  ).toEqual({
    ageClass: 'M21',
    club: undefined,
    downloaded: false,
    event: 12,
    id: 5,
    membershipNumber: undefined,
    name: 'Bob',
    siid: '123',
  })
  expect(wrapper.vm.$database.query).toHaveBeenLastCalledWith(
    'INSERT INTO competitors SET ?',
    expect.any(Object)
  )

  wrapper.vm.$database.query
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce({ insertId: 5 })
  wrapper.vm.$archive.query.mockResolvedValue([])
  expect(
    await wrapper.vm.findCompetitorForDownload({
      siid: '123',
      punches: [{ controlCode: 'S', time: 523 }],
      personalData: ['Bob', 'Jones', 'm', '1989', 'HAT'],
    })
  ).toEqual({
    ageClass: 'M21',
    club: 'HAT',
    downloaded: false,
    event: 12,
    id: 5,
    membershipNumber: undefined,
    name: 'Bob Jones',
    siid: '123',
  })
  expect(wrapper.vm.$database.query).toHaveBeenLastCalledWith(
    'INSERT INTO competitors SET ?',
    expect.any(Object)
  )
})

test('Save Download', async () => {
  const wrapper = shallowMount(Download, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
      },
      $archive: { connection: {}, connected: true, query: jest.fn() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
      $serialPort: {
        list: jest.fn().mockRejectedValue(),
        open: jest.fn(),
        close: jest.fn(),
        on: jest.fn(),
      },
    },
    methods: {
      findCompetitorForDownload: jest
        .fn()
        .mockResolvedValue({ id: 6, name: 'Bob', siid: '123', course: 3 }),
      getCourseFromId: jest
        .fn()
        .mockResolvedValue({ name: 'Long', controls: [], id: 3 }),
    },
  })
  jest.spyOn(wrapper.vm, 'getCourseFromId')
  courseMatching.linear.mockReturnValue({
    percentageCorrect: 1,
    errors: '',
    links: [],
  })
  await wrapper.vm.saveDownload({
    punches: [
      { controlCode: 'S', time: 5 },
      { controlCode: '101', time: 32 },
      { controlCode: 'F', time: 35 },
    ],
  })
  expect(wrapper.vm.$database.query).toBeCalledWith(
    'INSERT INTO punches (controlCode, time, competitor, event) VALUES ?',
    [
      [
        ['S', 5, 6, 12],
        ['101', 32, 6, 12],
        ['F', 35, 6, 12],
      ],
    ]
  )
  expect(wrapper.vm.getCourseFromId).toHaveBeenCalledTimes(1)
  expect(
    wrapper.vm.$database.query
  ).toBeCalledWith('UPDATE competitors SET ? WHERE id=?', [
    { downloaded: true },
    6,
  ])
  expect(wrapper.vm.$database.query).toBeCalledWith(
    'REPLACE INTO results SET ?',
    {
      time: 30,
      links: expect.any(String),
      errors: '',
      competitor: 6,
      event: 12,
    }
  )
  expect(wrapper.vm.lastDownload).toEqual({
    id: 6,
    name: 'Bob',
    siid: '123',
    courseName: 'Long',
    time: '00:30',
    course: 3,
  })
})

test('Save Download - Unknown Course', async () => {
  const wrapper = shallowMount(Download, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
      },
      $archive: { connection: {}, connected: true, query: jest.fn() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
      $serialPort: {
        list: jest.fn().mockRejectedValue(),
        open: jest.fn(),
        close: jest.fn(),
        on: jest.fn(),
      },
    },
    methods: {
      findCompetitorForDownload: jest
        .fn()
        .mockResolvedValue({ id: 6, name: 'Bob', siid: '123' }),
      getCourses: jest.fn(),
    },
  })

  courseMatching.linear.mockReturnValue({ percentageCorrect: 1, errors: '' })
  courseMatching.findBestCourse.mockReturnValue({
    name: 'Long',
    controls: [],
    id: 3,
  })
  await wrapper.vm.saveDownload({
    punches: [
      { controlCode: 'S', time: 5 },
      { controlCode: '101', time: 32 },
      { controlCode: 'F', time: 35 },
    ],
  })
  expect(wrapper.vm.$database.query).toBeCalledWith(
    'INSERT INTO punches (controlCode, time, competitor, event) VALUES ?',
    [
      [
        ['S', 5, 6, 12],
        ['101', 32, 6, 12],
        ['F', 35, 6, 12],
      ],
    ]
  )
  expect(
    wrapper.vm.$database.query
  ).toBeCalledWith('UPDATE competitors SET ? WHERE id=?', [{ course: 3 }, 6])
  expect(
    wrapper.vm.$database.query
  ).toBeCalledWith('UPDATE competitors SET ? WHERE id=?', [
    { downloaded: true },
    6,
  ])
  expect(wrapper.vm.lastDownload).toEqual({
    id: 6,
    name: 'Bob',
    siid: '123',
    courseName: 'Long',
    time: '00:30',
  })
})
