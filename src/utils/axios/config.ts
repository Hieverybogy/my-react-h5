import { AxiosResponse, InternalAxiosRequestConfig } from './types'
import { Toast } from 'antd-mobile'
import qs from 'qs'
import { SUCCESS_CODE, TRANSFORM_REQUEST_DATA } from '@/constants'
// import { useUserStoreWithOut } from '@/store/modules/user'
import { objToFormData } from '@/utils/utils'

const defaultRequestInterceptors = (config: InternalAxiosRequestConfig) => {
  if (
    config.method === 'post' &&
    config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
  ) {
    config.data = qs.stringify(config.data)
  } else if (
    TRANSFORM_REQUEST_DATA &&
    config.method === 'post' &&
    config.headers['Content-Type'] === 'multipart/form-data'
  ) {
    config.data = objToFormData(config.data)
  }
  if (config.method === 'get' && config.params) {
    let url = config.url as string
    url += '?'
    const keys = Object.keys(config.params)
    for (const key of keys) {
      if (config.params[key] !== void 0 && config.params[key] !== null) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`
      }
    }
    url = url.substring(0, url.length - 1)
    config.params = {}
    config.url = url
  }
  return config
}

const defaultResponseInterceptors = (response: AxiosResponse) => {
  if (response?.config?.responseType === 'blob') {
    // 如果是文件流，直接过
    return response
  } else if (response.data.code === SUCCESS_CODE) {
    return response.data
  } else {
    Toast.show({
      icon: 'fail',
      content: response?.data?.message,
    })
    if (
      response?.data?.code === 401 ||
      response?.data?.code === 408002 ||
      response?.data?.code === 408003
    ) {
      // const userStore = useUserStoreWithOut()
      // userStore.logout()
    }
    // throw new Error(JSON.stringify(response?.data))

    return Promise.reject(response?.data)
  }
}

export { defaultResponseInterceptors, defaultRequestInterceptors }
