import { mount, shallowMount } from '@vue/test-utils'
import Events from '@/views/Events'

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(Events, {
    stubs: ['router-link'],
    mocks: {
      $mysql: { createConnection: jest.fn() },
      $database: { connection: { config: { host: '', port: '', user: '', password: '' } }, connected: true, query: jest.fn().mockResolvedValue() },
      $archive: { connection: {}, connected: true, query: jest.fn().mockRejectedValue(), connect: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly - No Events', () => {
  const wrapper = shallowMount(Events, {
    stubs: ['router-link'],
    mocks: {
      $mysql: { createConnection: jest.fn() },
      $database: { connection: { config: { host: '', port: '', user: '', password: '' } }, connected: true, query: jest.fn().mockResolvedValue() },
      $archive: { connection: {}, connected: true, query: jest.fn().mockRejectedValue(), connect: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Renders Correctly - Events', () => {
  const wrapper = shallowMount(Events, {
    stubs: ['router-link'],
    mocks: {
      $mysql: { createConnection: jest.fn() },
      $database: { connection: { config: { host: '', port: '', user: '', password: '' } }, connected: true, query: jest.fn().mockResolvedValue() },
      $archive: { connection: {}, connected: true, query: jest.fn().mockRejectedValue(), connect: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setData({ events: [{ id: 1, name: 'Test', date: '1/2/3' }, { id: 2, name: 'Testing', date: '36/22/11' }, { id: 3, name: 'Event', date: '5/6/9' }] })
  expect(wrapper.element).toMatchSnapshot()
})

test('Not Connected to the Database', () => {
  const wrapper = shallowMount(Events, {
    stubs: ['router-link'],
    mocks: {
      $mysql: { createConnection: jest.fn() },
      $database: { connection: { config: { host: '', port: '', user: '', password: '' } }, connected: false, query: jest.fn().mockResolvedValue() },
      $archive: { connection: {}, connected: true, query: jest.fn().mockRejectedValue(), connect: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/')
})

test('Get Events - Success', async () => {
  const wrapper = mount(Events, {
    stubs: ['router-link'],
    mocks: {
      $mysql: { createConnection: jest.fn() },
      $database: { connection: { config: { host: '', port: '', user: '', password: '' } }, connected: true, query: jest.fn().mockResolvedValue(['hello']) },
      $archive: { connection: {}, connected: true, query: jest.fn().mockRejectedValue(), connect: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.getEvents()
  expect(wrapper.vm.events).toEqual(['hello'])
})

test('Get Events - Error', async () => {
  const wrapper = mount(Events, {
    stubs: ['router-link'],
    mocks: {
      $mysql: { createConnection: jest.fn() },
      $database: { connection: { config: { host: '', port: '', user: '', password: '' } }, connected: true, query: jest.fn().mockRejectedValue() },
      $archive: { connection: {}, connected: true, query: jest.fn().mockRejectedValue(), connect: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.getEvents()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Fetching Events', 'error')
  expect(wrapper.vm.events.length).toBe(0)
})

test('Get Year Of Birth', () => {
  const wrapper = mount(Events, {
    stubs: ['router-link'],
    mocks: {
      $mysql: { createConnection: jest.fn() },
      $database: { connection: { config: { host: '', port: '', user: '', password: '' } }, connected: true, query: jest.fn().mockRejectedValue() },
      $archive: { connection: {}, connected: true, query: jest.fn().mockRejectedValue(), connect: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  expect(wrapper.vm.getYearOfBirth('2001')).toBe(2001)
  expect(wrapper.vm.getYearOfBirth('1987')).toBe(1987)
  expect(wrapper.vm.getYearOfBirth('19/12/2014')).toBe(2014)
  expect(wrapper.vm.getYearOfBirth('1/2/2003')).toBe(2003)
  expect(wrapper.vm.getYearOfBirth('2001')).toBe(2001)
  expect(wrapper.vm.getYearOfBirth('5+/2-')).toBe(0)
})

test('Import Archive - Cancelled', async () => {
  const wrapper = mount(Events, {
    stubs: ['router-link'],
    mocks: {
      $mysql: { createConnection: jest.fn() },
      $fs: { readFile: jest.fn().mockResolvedValue() },
      $electron: { remote: { dialog: { showOpenDialog: jest.fn().mockResolvedValue({ canceled: true }) } } },
      $database: { connection: { config: { host: '', port: '', user: '', password: '' } }, connected: true, query: jest.fn().mockRejectedValue() },
      $archive: { connection: {}, connected: true, query: jest.fn().mockRejectedValue(), connect: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.importArchive()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Importing the Archive', 'error')
})

test('Import Archive - Wrong File Type', async () => {
  const sampleArchiveForImport = `
CardNuber,CardLabel,CardStatus,Name,Sex,DateOfBirth,MemberNo,Club,Country
,,,Bob Eves,m,22/02/1995,TARP1001,St Lukes,GBR
,,,Jo Smith,f,12/12/1995,TARP1002,St Janes,IRL
`

  const wrapper = mount(Events, {
    stubs: ['router-link'],
    mocks: {
      $mysql: { createConnection: jest.fn() },
      $fs: { readFile: jest.fn().mockResolvedValue(sampleArchiveForImport) },
      $electron: {
        remote: { dialog: { showOpenDialog: jest.fn().mockResolvedValue({ canceled: false, filePaths: ['/test'] }) } },
      },
      $database: { connection: { config: { host: '', port: '', user: '', password: '' } }, connected: true, query: jest.fn().mockRejectedValue() },
      $archive: { connection: {}, connected: true, query: jest.fn().mockResolvedValue(), connect: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
    methods: {
      getYearOfBirth: jest.fn(() => 2000),
      createArchiveConnection: jest.fn(),
    },
  })
  await wrapper.vm.importArchive()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Importing the Archive', 'error')
})

test('Import Archive - Success', async () => {
  const sampleArchiveForImport = `
CardNumber,CardLabel,CardStatus,Name,Sex,DateOfBirth,MemberNo,Club,Country
,,,Bob Eves,m,22/02/1995,TARP1001,St Lukes,GBR
,,,Jo Smith,f,12/12/1995,TARP1002,St Janes,IRL
`

  const wrapper = mount(Events, {
    stubs: ['router-link'],
    mocks: {
      $mysql: { createConnection: jest.fn() },
      $fs: { readFile: jest.fn().mockResolvedValue(sampleArchiveForImport) },
      $electron: {
        remote: { dialog: { showOpenDialog: jest.fn().mockResolvedValue({ canceled: false, filePaths: ['/test'] }) } },
      },
      $database: { connection: { config: { host: '', port: '', user: '', password: '' } }, connected: true, query: jest.fn().mockResolvedValue() },
      $archive: { connection: {}, connected: true, query: jest.fn().mockResolvedValue({ affectedRows: 2 }), connect: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
    methods: {
      getYearOfBirth: jest.fn(() => 2000),
      createArchiveConnection: jest.fn(),
    },
  })
  await wrapper.vm.importArchive()
  expect(wrapper.vm.$fs.readFile).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$fs.readFile).toHaveBeenLastCalledWith('/test', { encoding: 'utf8' })

  expect(wrapper.vm.$archive.query).toHaveBeenLastCalledWith('INSERT INTO people (siid, status, name, gender, yearOfBirth, membershipNumber,club) VALUES ?', [[
    ['', '', 'Bob Eves', 'm', 2000, 'TARP1001', 'St Lukes'],
    ['', '', 'Jo Smith', 'f', 2000, 'TARP1002', 'St Janes'],
  ]])
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('2 Archive Records Imported')
})
