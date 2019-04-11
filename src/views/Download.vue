<template>
  <base-layout>
    <template v-slot:menu>
      <label>Port:</label>
      <button :class="{ dropdown: true, nohover: connected }" @click="refreshPortList()">
        <p>{{ selectedPort }}</p>
        <svg v-if="!connected" viewBox="0 0 24 24">
          <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"></path>
          <path d="M0-.75h24v24H0z" fill="none"></path>
        </svg>
      </button>
      <transition name="openMenu">
        <ul v-if="portOpen">
          <li v-for="port of portList" :key="port" @click="changePort(port)">{{ port }}</li>
        </ul>
      </transition>
      <label>Baud:</label>
      <button :class="{ dropdown: true, nohover: connected }" @click="refreshBaudList()">
        <p>{{ selectedBaud }}</p>
        <svg v-if="!connected" viewBox="0 0 24 24">
          <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"></path>
          <path d="M0-.75h24v24H0z" fill="none"></path>
        </svg>
      </button>
      <transition name="openMenu">
        <ul v-show="baudOpen">
          <li v-for="baud of baudList" :key="baud" @click="changeBaud(baud)">{{ baud }}</li>
        </ul>
      </transition>
      <label>Printer:</label>
      <button :class="{ dropdown: true, nohover: connected }" @click="refreshPrinterList()">
        <p class="smaller">{{ selectedPrinter }}</p>
        <svg v-if="!connected" viewBox="0 0 24 24">
          <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"></path>
          <path d="M0-.75h24v24H0z" fill="none"></path>
        </svg>
      </button>
      <transition name="openMenu">
        <ul v-if="printerOpen">
          <li
            v-for="printer of printerList"
            :key="printer"
            class="smaller"
            @click="changePrinter(printer)"
          >{{ printer }}</li>
        </ul>
      </transition>
      <button @click="connect()">{{ connectButtonText }}</button>
      <button class="back" @click="back">Back</button>
    </template>
    <template v-slot:main>
      <div v-show="lastDownload !== false" class="card">
        <h1>Last Download</h1>
        <p v-if="lastDownload.name">Name: {{ lastDownload.name }}</p>
        <p>SI Card: {{ lastDownload.siid }}</p>
        <p>Course: {{ lastDownload.course || 'Unknown' }}</p>
        <p>Time: {{ time.displayTime(lastDownload.result) || '-' }}</p>
      </div>
      <transition name="open">
        <confirmation-dialog
          v-if="showConfirmationDialog"
          heading="Leave Download"
          message="Are You Sure You Want to Stop Downloading SI Cards?"
          confirm="Continue"
          cancel="Cancel"
          @close="leavePage"
        />
      </transition>
    </template>
  </base-layout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'
import Dialog from '@/components/Dialog'
import si from '@/scripts/si/si'
import courseMatching from '@/scripts/courseMatching/courseMatching'
import time from '@/scripts/time'
import splits from '@/scripts/splits'

export default {
  components: {
    'base-layout': BaseLayout,
    'confirmation-dialog': Dialog,
  },

  data: () => ({
    selectedPort: '',
    selectedBaud: 38400,
    selectedPrinter: '',
    portList: [],
    baudList: [4800, 38400],
    printerList: ['No Printing'],
    portOpen: false,
    baudOpen: false,
    printerOpen: false,
    connected: false,
    connectButtonText: 'Connect',
    lastDownload: false,
    showConfirmationDialog: false,
    time: time,
  }),

  created: function () {
    if (this.$database.database === null) {
      this.$router.push('/')
      this.$messages.addMessage('Not Connected to the Database', 'error')
    }
  },

  methods: {
    back: function () {
      if (this.connected) this.showConfirmationDialog = true
      else this.$router.go(-1)
    },

    leavePage: function (decision) {
      this.showConfirmationDialog = false
      if (decision) {
        this.$port.disconnect()
        this.$router.go(-1)
      }
    },

    refreshPortList: function () {
      if (!this.connected) {
        this.$port.listPorts().then(ports => {
          if (typeof ports === 'string') this.$messages.addMessage(ports, 'error')
          else this.portList = ports
          if (ports.includes('No Ports Found')) this.selectedPort = ''
          this.portOpen = !this.portOpen
        })
      }
    },

    refreshBaudList: function () {
      if (!this.connected) this.baudOpen = !this.baudOpen
    },

    refreshPrinterList: function () {
      if (!this.connected) {
        let printers = this.$node.printer.getPrinters()
        this.printerList = printers
          .filter(eachPrinter => eachPrinter.name.toUpperCase().includes('EPSON'))
          .filter(eachPrinter => !eachPrinter.status.includes('NOT-AVAILABLE'))
          .map(eachPrinter => eachPrinter.name)
        this.printerList.push('No Printing')

        this.printerOpen = !this.printerOpen
      }
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

    changePrinter: function (printer) {
      if (printer === 'No Printing') this.selectedPrinter = ''
      else this.selectedPrinter = printer
      this.printerOpen = !this.printerOpen
    },

    connect: function () {
      if (this.selectedPort === '') {
        this.$messages.addMessage('No Port Selected To Connect To', 'error')
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
          si.getInfo(data, this.$port.port)
            .then(data => {
              if (data) this.saveCardData(data)
            })
            .catch(error => this.$messages.addMessage(error.message, 'error'))
        }
        this.$port.error = error => this.$messages.addMessage(error.message, 'error')
        this.$port.connect(this.selectedPort, this.selectedBaud)
      }
    },

    calculateResult: function (competitor, courseList) {
      const match = courseMatching.linear(competitor.download.controls, courseList)
      if (competitor.download.other) match.errors = (competitor.download.other + ' ' + match.errors).trim()
      if (match.errors.length > 0) competitor.result = match.errors
      else competitor.result = time.calculateTime(competitor.download)
      competitor.splits = splits.generateSplits(competitor.download, match.links, courseList)
      return competitor
    },

    saveCardData: function (data) {
      this.$database.findCompetitorBySIID(data.siid)
        .then(async competitor => {
          if (competitor) {
            competitor.download = data
            const course = await this.$database.findCourseByName(competitor.course)
            if (course && course.controls) competitor = this.calculateResult(competitor, course.controls)
            else competitor = this.calculateResult(competitor, [])
            this.lastDownload = competitor
            this.$database.updateCompetitor(competitor)
            this.printSplits(competitor)
          }
          else {
            competitor = {
              name: data.name || 'Unknown',
              siid: data.siid.toString(),
              ageClass: '',
              club: '',
              course: 'Unknown',
              membershipNumber: '',
              nonCompetitive: false,
              download: data,
            }
            const allCourses = await this.$database.getCoursesData()
            const matchedCourse = courseMatching.findBestCourse(data.controls, allCourses)
            if (matchedCourse) {
              competitor.course = matchedCourse.name
              if (matchedCourse.controls) competitor = this.calculateResult(competitor, matchedCourse.controls)
              else competitor = this.calculateResult(competitor, [])
            }
            else competitor.result = time.calculateTime(data)
            this.lastDownload = competitor
            this.$database.addCompetitor(competitor)
            this.printSplits(competitor)
          }
        })
    },

    printSpacing: function (printer, string, length) {
      printer.print(' '.repeat(length - string.length))
    },

    minWidthString: function (string, length) {
      if (string === 'F ') return 'F    '
      return ' '.repeat(length - string.length) + string
    },

    printSplits: async function (competitor) {
      if (this.selectedPrinter === 'No Printing') return
      const printer = this.$node.thermalPrinter
      printer.init({
        type: 'epson',
        interface: 'printer:' + this.selectedPrinter,
      })
      const eventInformation = await this.$database.getEventInformation()
      printer.isPrinterConnected(isConnected => {
        if (!isConnected) return
        printer.clear()
        printer.setTypeFontA()
        printer.alignLeft()
        printer.println(eventInformation.name + ' - ' + eventInformation.date)
        printer.newLine()
        printer.setTextQuadArea()
        printer.setTypeFontB()
        printer.println(competitor.name)
        printer.setTextNormal()
        printer.setTypeFontA()
        printer.newLine()
        printer.println('SI Card: ' + competitor.siid)
        printer.println('Course: ' + competitor.course)
        printer.newLine()
        printer.setTextQuadArea()
        printer.setTypeFontB()
        printer.println('Time: ' + this.time.displayTime(competitor.result))
        printer.setTextNormal()
        printer.setTypeFontA()
        printer.newLine()
        printer.bold(true)
        printer.setTypeFontB()
        printer.println('Control                             Leg         Elapsed')
        printer.setTypeFontA()
        printer.bold(false)
        printer.println('S                          00:00    00:00')
        competitor.splits.forEach(split => {
          printer.print(this.minWidthString(split.number + ' ' + split.control), 6)
          printer.print('                      ')
          printer.print(this.minWidthString(this.time.displayTime(split.splitTime) || '--:--'), 6)
          printer.print('    ')
          printer.print(this.minWidthString(this.time.displayTime(split.elapsedTime) || '--:--'), 6)
          printer.newLine()
        })
        printer.newLine()
        printer.alignRight()
        printer.bold(true)
        printer.println('Results created by Nevis')
        printer.bold(false)
        printer.cut()
        printer.execute()
      })
    },
  },
}
</script>
<style lang="stylus" scoped>
@import '../assets/styles/helpers.styl'

label
  display: block
  margin: 3px 0
  padding-top: 3px
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

.smaller
  font-size: 0.8rem

.nohover
  background-color: white
  color: main-color

  &:hover
    background-color: white !important
    color: main-color !important

.openMenu-enter-active, .openMenu-leave-active
  transition: 0.3s
  transform: scaleY(1)
  transform-origin: top center

.openMenu-enter, .openMenu-leave-to
  transform: scaleY(0)
  transform-origin: top center
</style>
