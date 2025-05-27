import service from './service'
import { CONTENT_TYPE } from '@/constants'
// import { useUserStoreWithOut } from '@/store/modules/user'

const request = (option: AxiosConfig) => {
  const { url, method, params, data, headers, responseType } = option
  // const userStore = useUserStoreWithOut()
  return service.request({
    url:
      import.meta.env.VITE_NODE_ENV === 'development' &&
      import.meta.env.VITE_API_PROXY_ONOFF === 'true' &&
      import.meta.env.VITE_API_PROXY_PRVE
        ? `${import.meta.env.VITE_API_PROXY_PRVE}${url}`
        : url,
    method,
    params,
    data: Object.assign({ showLoading: true }, data),
    responseType: responseType,
    headers: {
      'Content-Type': CONTENT_TYPE,
      // [userStore.getTokenKey ?? 'Authorization']: userStore.getToken ?? '',
      // AgentId: userStore.userInfo?.agent_id,
      // uid: userStore.userInfo?.user_id,
      ...headers,
    },
  })
}

export default {
  get: <T = any>(option: AxiosConfig) => {
    return request({ method: 'get', ...option }) as Promise<IResponse<T>>
  },
  post: <T = any>(option: AxiosConfig) => {
    return request({ method: 'post', ...option }) as Promise<IResponse<T>>
  },
  delete: <T = any>(option: AxiosConfig) => {
    return request({ method: 'delete', ...option }) as Promise<IResponse<T>>
  },
  put: <T = any>(option: AxiosConfig) => {
    return request({ method: 'put', ...option }) as Promise<IResponse<T>>
  },
  cancelRequest: (url: string | string[]) => {
    return service.cancelRequest(url)
  },
  cancelAllRequest: () => {
    return service.cancelAllRequest()
  },
}
