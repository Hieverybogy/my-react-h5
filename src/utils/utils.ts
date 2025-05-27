import { isNumber } from './is'

export * from './domUtils'
export * from './dateUtil'
export * from './is'

/**
 *
 * @param component 需要注册的组件
 * @param alias 组件别名
 * @returns any
 */
export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: any) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}

/**
 * @param str 需要转下划线的驼峰字符串
 * @returns 字符串下划线
 */
export const humpToUnderline = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * @param str 需要转驼峰的下划线字符串
 * @returns 字符串驼峰
 */
export const underlineToHump = (str: string): string => {
  if (!str) return ''
  return str.replace(/\-(\w)/g, (_, letter: string) => {
    return letter.toUpperCase()
  })
}

/**
 * 驼峰转横杠
 */
export const humpToDash = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

export const setCssVar = (prop: string, val: any, dom = document.documentElement) => {
  dom.style.setProperty(prop, val)
}

export const getCssVar = (prop: string, dom = document.documentElement) => {
  return getComputedStyle(dom).getPropertyValue(prop)
}

/**
 * 查找数组对象的某个下标
 * @param {Array} ary 查找的数组
 * @param {Functon} fn 判断的方法
 */
// eslint-disable-next-line
export const findIndex = <T = Recordable>(ary: Array<T>, fn: Fn): number => {
  if (ary.findIndex) {
    return ary.findIndex(fn)
  }
  let index = -1
  ary.some((item: T, i: number, ary: Array<T>) => {
    const ret: T = fn(item, i, ary)
    if (ret) {
      index = i
      return ret
    }
  })
  return index
}

export const trim = (str: string) => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * @param {Date | number | string} time 需要转换的时间
 * @param {String} fmt 需要转换的格式 如 yyyy-MM-dd、yyyy-MM-dd HH:mm:ss
 * @param {boolean} isUTC 是否转换为 UTC+0 时间格式
 */
export function formatTime(time: Date | number | string, fmt: string, isUTC: boolean = false) {
  if (!time) return ''
  else {
    const date = new Date(time)

    // 如果需要转换为 UTC 时间
    if (isUTC) {
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
    }

    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      S: date.getMilliseconds()
    }

    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }

    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }

    return fmt
  }
}

/**
 * 生成随机字符串
 */
export function toAnyString() {
  const str: string = 'xxxxx-xxxxx-4xxxx-yxxxx-xxxxx'.replace(/[xy]/g, (c: string) => {
    const r: number = (Math.random() * 16) | 0
    const v: number = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString()
  })
  return str
}

/**
 * 首字母大写
 */
export function firstUpperCase(str: string) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}

/**
 * 把对象转为formData
 */
export function objToFormData(obj: Recordable) {
  const formData = new FormData()
  Object.keys(obj).forEach((key) => {
    formData.append(key, obj[key])
  })
  return formData
}

export function getUrlParams(key: string, url?: string): string {
  url = url || (window && window.location.href) || ''

  if (!key) {
    return ''
  }

  key = key.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + key + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  if (!results) return ''
  if (!results[2]) return ''
  const val = results[2].replace(/\+/g, ' ')
  return val
}

export const formatNumber = (
  num: number | string,
  decimals: number = 2,
  decimal: string = '.',
  separator: string = ',',
  suffix: string = '',
  prefix: string = ''
) => {
  if (!num && num !== 0 && num !== '0') return num
  num = Number(num).toFixed(decimals)
  num += ''
  const x = num.split('.')
  let x1 = x[0]
  const x2 = x.length > 1 ? decimal + x[1] : ''
  const rgx = /(\d+)(\d{3})/
  if (separator && !isNumber(separator)) {
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + separator + '$2')
    }
  }
  return prefix + x1 + x2 + suffix
}

// 将 UTC+0 时间转换为本地时间
export const convertUTCToLocal = (utcDateString) => {
  if (!utcDateString) return null
  const utcDate = new Date(utcDateString)
  return new Date(
    new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000).toISOString()
  ).getTime()
}

export const formatUtcToDateString = (utcTimestamp, format = 'yyyy-MM-dd HH:mm:ss') => {
  if (!utcTimestamp) return ''

  const date = new Date(utcTimestamp) // 创建日期对象
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')

  // 根据格式返回日期字符串
  return format
    .replace('yyyy', year)
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

// 将本地时间转换为 UTC+0 时间
export const convertLocalToUTC = (localDateString) => {
  const localDate = new Date(localDateString)
  return new Date(
    Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(),
      localDate.getHours(),
      localDate.getMinutes(),
      localDate.getSeconds()
    )
  )
}

export const formatUtcToDate = (
  utcTimestamp,
  timeZone = 'Etc/GMT0', // 默认使用 UTC+0
  format = 'yyyy-MM-dd HH:mm:ss'
) => {
  if (!utcTimestamp) return ''

  const date = new Date(utcTimestamp)

  // 使用 Intl.DateTimeFormat 格式化
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone,
    hour12: false // 24小时制
  }

  const formatter = new Intl.DateTimeFormat('en-US', options)
  const parts = formatter.formatToParts(date)

  // 提取各部分，构建自定义格式
  const formatMap = {}
  parts.forEach((part) => {
    formatMap[part.type] = part.value
  })

  return format
    .replace('yyyy', formatMap.year)
    .replace('MM', formatMap.month)
    .replace('dd', formatMap.day)
    .replace('HH', formatMap.hour)
    .replace('mm', formatMap.minute)
    .replace('ss', formatMap.second)
}
