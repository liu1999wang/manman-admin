// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'

/**
 *计算距离当前时间的差
 * @param {string} lately_time
 * @returns {number}
 */
export function activetime(lately_time) {
  const date1 = new Date(lately_time).getTime()
  const date = Date.now()
  const diff = Math.round((date - date1) / 1000 / 60)
  if (diff < 1) {
    return ''
  } else if (diff < 60) {
    return diff
  } else if (diff < 60 * 24) {
    return Math.round(diff / 60)
  } else if (diff < 60 * 24 * 7) {
    return Math.round(diff / 60 / 24)
  } else if (diff < 60 * 24 * 30) {
    return Math.round(diff / 60 / 24 / 7)
  } else if (diff < 60 * 24 * 365) {
    return Math.round(diff / 60 / 24 / 30)
  } else {
    return Math.round(diff / 60 / 24 / 365)
  }
}

/**
 * 计算距离当前时间的差的符号
 * @param {string} lately_time
 * @returns {string}
 */
export function timesymbol(lately_time) {
  const date1 = new Date(lately_time).getTime()
  const date = Date.now()
  const diff = Math.round((date - date1) / 1000 / 60)
  if (diff < 1) {
    return 'time.now'
  } else if (diff < 60) {
    return 'time.minute'
  } else if (diff < 60 * 24) {
    return 'time.hour'
  } else if (diff < 60 * 24 * 7) {
    return 'time.day'
  } else if (diff < 60 * 24 * 30) {
    return 'time.week'
  } else if (diff < 60 * 24 * 365) {
    return 'time.month'
  } else {
    return 'time.year'
  }
}

export function isphone(phone) {
  const isphone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
  if (isphone.test(phone)) {
    return true
  } else {
    return false
  }
}

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
