<template>
  <main>
    <back-arrow :disable="true" @clicked="back()" />
    <h1 class="title">Download</h1>
    <div class="card input">
      <dropdown-input
        v-model="selectedPort"
        :hide="connected"
        :list="portList"
        label="Port:"
        @opened="refreshPortList"
      />
      <dropdown-input v-model="selectedBaud" :hide="connected" :list="baudList" label="Baud:" />
      <dropdown-input
        v-model="selectedPrinter"
        :hide="connected"
        :list="printerList"
        label="Printer:"
        @opened="refreshPrinterList"
      />
    </div>
    <div>
      <button class="button" @click="connect()">{{ connectButtonText }}</button>
    </div>
    <div v-show="lastDownload !== false" class="card">
      <h1>Last Download</h1>
      <p v-if="lastDownload.name">
        <b>Name:</b>
        {{ lastDownload.name }}
      </p>
      <p>
        <b>SI Card:</b>
        {{ lastDownload.siid }}
      </p>
      <p>
        <b>Course:</b>
        {{ lastDownload.course || 'Unknown' }}
      </p>
      <p>
        <b>Time:</b>
        {{ time.displayTime(lastDownload.result) || '-' }}
      </p>
    </div>
    <transition name="fade">
      <confirmation-dialog
        v-if="showConfirmationDialog"
        heading="Leave Download"
        message="Are You Sure You Want to Stop Downloading SI Cards?"
        confirm="Continue"
        cancel="Cancel"
        @close="leavePage"
      />
    </transition>
  </main>
</template>

<script>
import DropdownInput from '@/components/DropdownInput'
import BackArrow from '@/components/BackArrow'
import Dialog from '@/components/Dialog'

import si from '@/scripts/si/si'
import courseMatching from '@/scripts/courseMatching/courseMatching'
import time from '@/scripts/time'
import splits from '@/scripts/splits'

export default {
  components: {
    'confirmation-dialog': Dialog,
    'dropdown-input': DropdownInput,
    'back-arrow': BackArrow,
  },

  data: () => ({
    selectedPort: '',
    selectedBaud: '38400',
    selectedPrinter: '',
    portList: [],
    baudList: ['4800', '38400'],
    printerList: ['No Printing'],
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
        })
      }
    },

    refreshPrinterList: function () {
      if (!this.connected) {
        let printers = this.$node.printer.getPrinters()
        this.printerList = printers
          .filter(eachPrinter => eachPrinter.name.toUpperCase().includes('EPSON'))
          .filter(eachPrinter => !eachPrinter.status.includes('NOT-AVAILABLE'))
          .map(eachPrinter => eachPrinter.name)
        this.printerList.push('No Printing')
      }
    },

    connect: function () {
      if (this.selectedPort === '' || this.selectedPort === 'No Ports Found') {
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
        this.$port.connect(this.selectedPort, parseInt(this.selectedBaud))
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
.card
  h1
    padding-bottom: 0.5rem

  p
    padding: 0.1rem 0
</style>
