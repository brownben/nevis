'use strict'

// Electron Process
const { dialog, BrowserWindow, ipcMain, shell } = require('electron').remote
const { ipcRenderer: ipc, webFrame } = require('electron')

// Node System Commands
const fs = require('fs')
const url = require('url')
const path = require('path')

// Database
const Loki = require('lokijs')

// Live Views
const Vue = require('vue/dist/vue.min')

// Serialport
const SerialPort = require('serialport')

// Printer
const printer = require('printer')
const thermalPrinter = require('node-thermal-printer')

// Process XML
const ejs = require('ejs').render
const parseXML = require('xml2js').parseString

const SI = require('../scripts/SI.js')
const dialogs = require('../scripts/dialogs')

// Database
let db
let competitorsDB
let coursesDB
let eventInfo

const databaseEncryptionAdapter = require('../scripts/databaseEncryption')
const database = require('../scripts/database')

// Set Up Menu and Naviagtion
let currentLocation = ''
const navigatePage = require('../scripts/menu').navigatePage
navigatePage('Welcome')

// The Live Overview of the Event
const homeVue = require('../scripts/home').homeVue

// Set Process Version Numbers
document.getElementById('about-node').innerText = 'Node Version: ' + process.versions.node
document.getElementById('about-chrome').innerText = 'Chrome Version: ' + process.versions.chrome
document.getElementById('about-electron').innerText = 'Electron Version: ' + process.versions.electron
