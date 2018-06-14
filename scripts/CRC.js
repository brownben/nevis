'use strict'
/* eslint no-plusplus: "off" */

// If Byte Starts with 0 it is cut short, causing problems when concatenated
function shortByte (byte) {
    if (byte.toString(16).length < 2) byte = '0' + byte.toString(16)
    else byte = byte.toString(16)
    return byte
}

// The actual computation of CRC Value
function computeCRC (buffer) {
    const count = buffer.length
    if (count < 2) {
        return 0
    }
    let tmp
    let ptr = 0
    tmp = (buffer[ptr++] << 8 | (buffer[ptr++] & 0xFF))
    if (count > 2) {
        for (let i = Math.trunc(count / 2); i > 0; i--) {
            let val = void 0
            if (i > 1) {
                val = (buffer[ptr++] << 8 | (buffer[ptr++] & 0xFF))
            }
            else {
                if (count % 2 === 1) {
                    val = buffer[count - 1] << 8
                }
                else {
                    val = 0 // last value with 0 // last 16 bit value
                }
            }
            for (let j = 0; j < 16; j++) {
                if ((tmp & 0x8000) !== 0) {
                    tmp <<= 1
                    if ((val & 0x8000) !== 0) {
                        tmp++ // rotate carry
                    }
                    tmp ^= 0x8005
                }
                else {
                    tmp <<= 1
                    if ((val & 0x8000) !== 0) {
                        tmp++ // rotate carry
                    }
                }
                val <<= 1
            }
        }
    }
    return (tmp & 0xFFFF)
}

// The computation wrapped in a function to select specific bytes
module.exports.check = function (data, cardType) {
    if (cardType === 5) {
        if (parseInt(shortByte(data[133]) + shortByte(data[134]), 16) === parseInt(computeCRC(data.slice(1, 133)).toString(16), 16)) return true
        else return false
    }
    else {
        if (parseInt(shortByte(data[134]) + shortByte(data[135]), 16) === parseInt(computeCRC(data.slice(1, 134)).toString(16), 16)) return true
        else return false
    }
}
