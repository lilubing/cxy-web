export function tableFormatDateTime(row, column) {
  let date = row[column.property]
  if (date === undefined) {
    return ''
  }
  date = date.toString()
  //					if(inputTime.length < 13) {
  //						inputTime =
  //					}
  date = date.length < 13 ? parseInt(date) * 1000 : (Number(date))
  //					inputTime = Number(inputTime)
  var dates = new Date(date)
  var y = dates.getFullYear()
  var m = dates.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  var d = dates.getDate()
  d = d < 10 ? ('0' + d) : d
  var h = dates.getHours()
  h = h < 10 ? ('0' + h) : h
  var minute = dates.getMinutes()
  var second = dates.getSeconds()
  minute = minute < 10 ? ('0' + minute) : minute
  second = second < 10 ? ('0' + second) : second
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
}

export function formatDateTime(inputTime, type) {
  if (inputTime == null || inputTime === '') {
    return
  } else {
    inputTime = inputTime.toString()
    //					if(inputTime.length < 13) {
    //						inputTime =
    //					}
    inputTime = inputTime.length < 13 ? parseInt(inputTime) * 1000 : (Number(inputTime))
    //					inputTime = Number(inputTime)
    var dates = new Date(inputTime)
    var y = dates.getFullYear()
    var m = dates.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    var d = dates.getDate()
    d = d < 10 ? ('0' + d) : d
    var h = dates.getHours()
    h = h < 10 ? ('0' + h) : h
    var minute = dates.getMinutes()
    var second = dates.getSeconds()
    minute = minute < 10 ? ('0' + minute) : minute
    second = second < 10 ? ('0' + second) : second
    if (type === 2) {
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    } else {
      return y + '-' + m + '-' + d
    }
  }
}

export function AddDays(dayIn, time) {
  var date = null
  if (time) {
    date = time
  } else {
    date = new Date()
  }
  var myDate = new Date(date.getTime() + dayIn * 24 * 60 * 60 * 1000)
  var year = myDate.getFullYear()
  var month = myDate.getMonth() + 1
  var day = myDate.getDate()
  var CurrentDate = year + '-'
  if (month >= 10) {
    CurrentDate = CurrentDate + month + '-'
  } else {
    CurrentDate = CurrentDate + '0' + month + '-'
  }
  if (day >= 10) {
    CurrentDate = CurrentDate + day
  } else {
    CurrentDate = CurrentDate + '0' + day
  }
  return CurrentDate
}

export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
