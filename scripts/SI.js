'use strict'

const CRC = require('./CRC.js').check

function shortByte (byte) {
    // If Byte Starts with 0 it is cut short, causing problems when concatenated
    if (byte.toString(16).length < 2) byte = '0' + byte.toString(16)
    else byte = byte.toString(16)
    return byte
}

function calculateSIID (byte1, byte2, byte3, byte4) {
    byte1 = shortByte(byte1)
    byte2 = shortByte(byte2)
    byte3 = shortByte(byte3)
    byte4 = shortByte(byte4)

    let siid = parseInt(byte1 + byte2 + byte3 + byte4, 16)
    // SI Card 5
    if ((parseInt(byte1) === 0) && (parseInt(byte2) === 1)) {
        siid = siid - 65536
    }
    else if ((parseInt(byte1) === 0) && (parseInt(byte2) === 2)) {
        siid = siid + 68928
    }
    else if ((parseInt(byte1) === 0) && (parseInt(byte2) === 3)) {
        siid = siid + 103392
    }
    else if ((parseInt(byte1) === 0) && (parseInt(byte2) === 4)) {
        siid = siid + 137856
    }
    else if ((siid >= 3000000) && (siid <= 3999999)) {
        siid = siid - 0
    }
    // SI Card 6
    else if ((siid >= 500000) && (siid <= 999999)) {
        siid = siid - 0
    }
    // SI Card 8 + comCard Up
    else if ((siid >= 35554432) && (siid <= 36554431)) {
        siid = siid - 33554432
    }
    // SI pCard
    else if ((siid >= 71180864) && (siid <= 72108863)) {
        siid = siid - 67108864
    }
    // SI tCard
    else if ((siid >= 106663296) && (siid <= 107663295)) {
        siid = siid - 100663296
    }
    // SI fCard
    else if ((siid >= 248881024) && (siid <= 249881023)) {
        siid = siid - 234881024
    }
    // SI Card 10+
    else if ((siid >= 258658240) && (siid <= 261658239)) {
        siid = siid - 251658240
    }
    return siid
}

function calculateTime (startRaw1, startRaw2, finishRaw1, finishRaw2) {
    startRaw1 = shortByte(startRaw1)
    startRaw2 = shortByte(startRaw2)
    finishRaw1 = shortByte(finishRaw1)
    finishRaw2 = shortByte(finishRaw2)

    const startRaw = parseInt(startRaw1 + startRaw2, 16)
    let finishRaw = parseInt(finishRaw1 + finishRaw2, 16)

    if (finishRaw < startRaw) finishRaw = finishRaw + 43200
    const totalTime = finishRaw - startRaw

    return {
        start: startRaw,
        finish: finishRaw,
        time: totalTime,
    }
}

function getCard5PunchData (data) {
    let currentPosition = 38
    let currentPositionInBlock = 0
    let controls = []
    while (data[currentPosition] !== 0x00 && data[currentPosition + 1] !== 0xEE && data[currentPosition + 2] !== 0xEE && currentPosition < 130) {
        const currentControlCode = parseInt(data[currentPosition])
        const currentControlTime = parseInt(shortByte(data[currentPosition + 1]) + shortByte(data[currentPosition + 2]), 16)
        controls.push({
            code: currentControlCode,
            time: currentControlTime,
        })
        if (currentPositionInBlock < 4) {
            currentPosition = currentPosition + 3
            currentPositionInBlock = currentPositionInBlock + 1
        }
        else {
            currentPosition = currentPosition + 4
            currentPositionInBlock = 0
        }
    }
    return controls
}

function getCard10PunchData (data) {
    const endOfPunches = data.length - 1
    let currentPosition = 0
    let currentControls = []
    while (currentPosition !== endOfPunches && parseInt(data[currentPosition + 1]) !== parseInt(0xEE) && parseInt(data[currentPosition + 2]) !== parseInt(0xEE)) {
        const control = {
            code: parseInt(data[currentPosition + 1]),
            time: parseInt(shortByte(data[currentPosition + 2]) + shortByte(data[currentPosition + 3]), 16),
        }
        currentControls.push(control)
        currentPosition = currentPosition + 4
    }
    return currentControls
}

function getNameFromCard (personalData) {
    let name = ''
    let colonCounter = 0
    for (let character of personalData) {
        if (parseInt(character) !== parseInt(0x3B) && colonCounter <= 1) {
            name = name + String.fromCharCode(character)
        }
        else if (parseInt(character) === parseInt(0x3B) && colonCounter <= 1) {
            name = name + ' '
            colonCounter = colonCounter + 1
        }
        else {
            return name
        }
    }
}

function Card5 () {
    this.data = {}
    this.type = 5
    this.dataRecieved = function (data) {
        return (parseInt(data[1]) === parseInt(0xB1) && parseInt(data[2]) === parseInt(0x82) && data.length === 136)
    }
    this.readData = Buffer.from([255, 2, 177, 0, 177, 0, 3])
    this.processData = function (data, port) {
        if (CRC(data, 5)) {
            const value = calculateTime(data[24], data[25], data[26], data[27])
            this.data.start = value.start
            this.data.finish = value.finish
            this.data.totalTime = value.time
            this.data.siid = calculateSIID(data[12], data[11], data[9], data[10])
            this.data.controls = getCard5PunchData(data)
            port.write(Buffer.from([0xFF, 0x06]))
            return this.data
        }
        else {
            return false
        }
    }
}

function Card10 (type) {
    this.data = {}
    this.type = this.type || 10
    this.readData = Buffer.from([0xFF, 0x02, 0xEF, 0x01, 0x00, 0xE2, 0x09, 0x03])
    this.readData1 = Buffer.from([0xFF, 0x02, 0xEF, 0x01, 0x01, 0xE3, 0x09, 0x03])
    this.readData4 = Buffer.from([0xFF, 0x02, 0xEF, 0x01, 0x04, 0xE6, 0x09, 0x03])
    this.readData5 = Buffer.from([0xFF, 0x02, 0xEF, 0x01, 0x05, 0xE7, 0x09, 0x03])
    this.readData6 = Buffer.from([0xFF, 0x02, 0xEF, 0x01, 0x06, 0xE4, 0x09, 0x03])
    this.readData7 = Buffer.from([0xFF, 0x02, 0xEF, 0x01, 0x07, 0xE5, 0x09, 0x03])
    this.readData8 = Buffer.from([0xFF, 0x02, 0xEF, 0x01, 0x08, 0xEA, 0x09, 0x03])

    this.dataRecieved = function (data) {
        return (parseInt(data[1]) === parseInt(0xEF) && data[2] === parseInt(0x83) && data.length === 137)
    }

    this.processData = function (data, port, currentDownload) {
        const blockNumber = data[5]
        if (CRC(data, 10)) {
            if (blockNumber === 0) {
                const value = calculateTime(data[20], data[21], data[24], data[25])
                this.data.start = value.start
                this.data.finish = value.finish
                this.data.totalTime = value.time
                this.data.siid = calculateSIID(data[30], data[31], data[32], data[33])
                if (type === 9) {
                    this.data.name = getNameFromCard(data.slice(38, 58))
                    const controls = getCard10PunchData(data.slice(59, 133))
                    this.data.controls = controls
                    if (controls.length < 18) {
                        port.write(Buffer.from([0xFF, 0x06]))
                        return this.data
                    }
                    else {
                        port.write(this.readData1)
                    }
                }
                else if (type === 8) {
                    this.data.name = getNameFromCard(data.slice(38, 133))
                    port.write(this.readData1)
                }
                else {
                    this.data.name = getNameFromCard(data.slice(38, 133))
                    port.write(this.readData4)
                }
                return false
            }
            else if (blockNumber === 1 || blockNumber === 4 || blockNumber === 5 || blockNumber === 6 || blockNumber === 7) {
                if (this.type === 8) controls = getCard10PunchData(data.slice(14, 134))
                else if (this.type === 'p') controls = getCard10PunchData(data.slice(54, 134))
                else controls = getCard10PunchData(data.slice(6, 134))
                if (this.data.controls === []) this.data.controls = controls
                else this.data.controls.push(controls)
                if (controls.length < 32 || blockNumber === 1 || blockNumber === 7) {
                    port.write(Buffer.from([0xFF, 0x06]))
                    return this.data
                }
                else if (blockNumber === 4) {
                    port.write(this.readData5)
                    return false
                }
                else if (blockNumber === 5) {
                    port.write(this.readData6)
                    return false
                }
                else if (blockNumber === 6) {
                    port.write(this.readData7)
                    return false
                }
            }
            else {
                return false
            }
        }
    }
}

module.exports.inserted = function (data) {
    if (parseInt(data[1]) === parseInt(0xE5) && parseInt(data[2]) === parseInt(0x06) && data.length === 12) {
        return new Card5()
    }
    else if (parseInt(data[1]) === 0xE8 && parseInt(data[2]) === parseInt(0x06) && data.length === 12) {
        const siid = calculateSIID(data[5], data[6], data[7], data[8])
        if (siid >= 7000000) return new Card10(10)
        else if (siid >= 2000000 && siid <= 2999999) return new Card10(8)
        else if (siid >= 1000000 && siid <= 1999999) return new Card10(9)
        else if (siid >= 4000000 && siid <= 4999999) return new Card10('p')
        else return false
    }
    else {
        return false
    }
}
