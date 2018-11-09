<template>
  <base-layout>
    <div slot="menu">
      <label>Port:</label>
      <button :class="{ dropdown: true, nohover: connected }" @click="refreshPortList()">
        <p>{{ selectedPort }}</p>
        <svg v-if="!connected" viewBox="0 0 24 24">
          <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"></path>
          <path d="M0-.75h24v24H0z" fill="none"></path>
        </svg>
      </button>
      <ul v-if="portOpen">
        <li v-for="port of portList" :key="port" @click="changePort(port)">{{ port }}</li>
      </ul>
      <label>Baud:</label>
      <button :class="{ dropdown: true, nohover: connected }" @click="refreshBaudList()">
        <p>{{ selectedBaud }}</p>
        <svg v-if="!connected" viewBox="0 0 24 24">
          <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"></path>
          <path d="M0-.75h24v24H0z" fill="none"></path>
        </svg>
      </button>
      <ul v-show="baudOpen">
        <li v-for="baud of baudList" :key="baud" @click="changeBaud(baud)">{{ baud }}</li>
      </ul>
      <button @click="connect()">{{ connectButtonText }}</button>
      <button @click="back" class="back">Back</button>
    </div>
    <div slot="main" class="main">
      <div v-show="lastDownload" class="card">
        <h1>Last Download</h1>
        <p v-if="lastDownload.name">Name: {{ lastDownload.name }}</p>
        <p>SI Card: {{ lastDownload.siid }}</p>
        <p>Start: {{ $time.actual(lastDownload.start) || '-'}}</p>
        <p>Finish: {{ $time.actual(lastDownload.finish) || '-'}}</p>
        <p>Time: {{ $time.elapsed(time)}}</p>
      </div>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'
import DropdownInput from '@/components/DropdownInput'

export default {
  components: {
    'base-layout': BaseLayout,
    'dropdown-input': DropdownInput,
  },

  data: () => ({
    selectedPort: '',
    selectedBaud: 38400,
    portList: [],
    baudList: [4800, 38400],
    portOpen: false,
    baudOpen: false,
    connected: false,
    connectButtonText: 'Connect',
    lastDownload: false,
  }),

  created: function () {
    if (this.$database.database === null) {
      this.$router.push('/')
      this.$messages.addMessage('Not Connected to the Database', 'error')
    }
  },

  methods: {
    back: function () {
      this.$port.disconnect()
      this.$router.go(-1)
    },
    refreshPortList: function () {
      if (!this.connected) {
        this.$port.listPorts().then(ports => {
          if (typeof ports === 'string') this.$messages.addMessage(ports, 'error')
          else this.portList = ports
          this.portOpen = !this.portOpen
        })
      }
    },
    refreshBaudList: function () {
      if (!this.connected) this.baudOpen = !this.baudOpen
    },
    changeBaud: function (baud) {
      this.selectedBaud = baud
      this.baudOpen = !this.baudOpen
    },
    changePort: function (port) {
      if (port === 'No Ports Found') this.selectedPort = ''
      else this.selectedPort = port
      this.portOpen = !this.portOpen
    },
    connect: function () {
      if (this.selectedPort === '') {
        this.$messages.addMessage('Please Select a Port to Connect to', 'error')
      }
      else if (this.connectButtonText === 'Disconnect') {
        this.$port.disconnect()
        this.connectButtonText = 'Connect'
      }
      else {
        this.$port.open = () => {
          this.connectButtonText = 'Disconnect'
          this.connected = true
        }
        this.$port.close = () => {
          this.connectButtonText = 'Connect'
          this.connected = false
        }
        this.$port.data = data => {
          this.$si.getInfo(data, this.$port.port)
            .then(data => {
              if (data) this.saveCardData(data)
            })
            .catch(error => this.$messages.addMessage(error.message, 'error'))
        }
        this.$port.error = error => this.$messages.addMessage(error, 'error')

        this.$port.connect(this.selectedPort, this.selectedBaud)
      }
    },
    saveCardData: function (data) {
      this.lastDownload = data
      this.$database.findCompetitorBySIID(data.siid)
        .then(competitor => {
          if (competitor) {
            this.lastDownload.name = competitor.name
            competitor.download = data
            this.$database.updateCompetitor(competitor)
          }
          else {
            const competitor = {
              name: data.name || 'Unknown',
              siid: data.siid.toString(),
              ageClass: '',
              club: '',
              course: 'Unknown',
              membershipNumber: '',
              nonCompetitive: false,
              download: data,
            }
            this.$database.addCompetitor(competitor)
          }
        })
    },
  },

  computed: {
    time: function () {
      if (this.lastDownload) return this.lastDownload.finish - this.lastDownload.start
    }
  },
}
</script>
<style lang="stylus" scoped>
@import '../assets/styles/helpers.styl'

label
  display: block
  margin: 3px 0
  width: 100%
  color: main-color
  text-align: center
  font-size: 14px
  default-font()

  &:first-child:not()
    margin-top: 8px

button
  margin-top: 8px

  &.dropdown
    display: flex
    justify-content: space-between
    margin-top: 0
    padding: 0
    height: 33px
    vertical-align: middle
    text-align: center

    svg
      margin: 0 4.5px
      width: 24px
      height: 33px
      vertical-align: middle
      transition: 0.3s ease-out
      fill: main-color

    p
      margin: auto
      width: calc(100% - 33px)
      vertical-align: middle
      text-align: center

    &:hover
      background-color: main-color

      svg
        fill: white

ul
  margin: 0
  padding: 0
  list-style: none

  li
    padding: 5px 0
    height: 20px
    color: main-color
    vertical-align: middle
    text-align: center
    transition: 0.3s ease-out
    default-font()

    &:hover
      background-color: main-color
      color: white

.nohover
  background-color: white
  color: main-color

  &:hover
    background-color: white !important
    color: main-color !important
</style>
