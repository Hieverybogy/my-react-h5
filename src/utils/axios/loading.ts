import { Toast } from 'antd-mobile'

let loadingCount = 0
let messageKey: any = null

export const showLoading = () => {
  if (loadingCount === 0) {
    messageKey = Toast.show({
      icon: 'loading',
      content: '加载中…',
    })
  }
  loadingCount++
}

export const hideLoading = () => {
  loadingCount--
  if (loadingCount === 0 && messageKey) {
    messageKey?.close()
  }
}
