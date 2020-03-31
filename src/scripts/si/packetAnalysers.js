export const card5 = {
  inserted: data =>
    data[1] === parseInt(0xe5) &&
    data[2] === parseInt(0x06) &&
    data.length === 12,

  data: data =>
    data[1] === parseInt(0xb1) &&
    data[2] === parseInt(0x82) &&
    data.length === 136,
}

export const card10 = {
  inserted: data =>
    parseInt(data[1]) === 0xe8 &&
    parseInt(data[2]) === parseInt(0x06) &&
    data.length === 12,

  data: data =>
    parseInt(data[1]) === parseInt(0xef) &&
    data[2] === parseInt(0x83) &&
    data.length === 137,
}
