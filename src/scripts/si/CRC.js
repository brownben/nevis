/*
  Modified From OpenSportIdent.js (https://github.com/angexis/opensportident.js)
  Copyright (c) 2016 Jan Vorwerk
  Copyright (c) 2013 Simon Denier
*/

/* eslint no-plusplus: "off" */
export default (buffer) => {
  const count = buffer.length
  if (count < 2) return 0
  let ptr = 0
  let tmp = (buffer[ptr++] << 8) | (buffer[ptr++] & 0xff)
  for (let i = Math.trunc(count / 2); i > 0; i--) {
    let val = 0
    if (i > 1) val = (buffer[ptr++] << 8) | (buffer[ptr++] & 0xff)
    else if (count % 2 === 1) val = buffer[count - 1] << 8
    else val = 0
    for (let j = 0; j < 16; j += 1) {
      if ((tmp & 0x8000) !== 0) {
        tmp <<= 1
        if ((val & 0x8000) !== 0) tmp += 1
        tmp ^= 0x8005
      } else {
        tmp <<= 1
        if ((val & 0x8000) !== 0) tmp += 1
      }
      val <<= 1
    }
  }
  return tmp & 0xffff
}
