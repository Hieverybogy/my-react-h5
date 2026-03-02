class WSService {
  private ws: WebSocket | null = null
  private token?: string
  private reconnectTimer: any = null

  connect(token: string) {
    if (this.ws && token === this.token) return

    this.ws && this.disconnect()
    this.token = token

    let ws_url = import.meta.env.VITE_API_WS_Chat_BASE_PATH
    if (window.location.protocol === 'https:') {
      ws_url = ws_url.replace('ws://', 'wss://')
      const arr = ws_url.split(':')
      arr.pop()
      ws_url = arr.join(':')

      console.log(1111111, ws_url)
    }
    this.ws = new WebSocket(`${ws_url}/ws?token=${token}`)

    this.ws.onopen = () => {
      console.log('WS connected, WS 已连接')

      window.dispatchEvent(new Event('onopenWS'))
    }

    this.ws.onmessage = event => {
      const data = JSON.parse(event.data)

      window.dispatchEvent(new CustomEvent('onmessageWS', { detail: data }))
    }

    this.ws.onclose = () => {
      console.log('WS closed')

      window.dispatchEvent(new Event('oncloseWS'))

      this.ws = null

      // 自动重连
      this.reconnectTimer = setTimeout(() => {
        if (this.token) {
          this.connect(this.token)
        }
      }, 3000)
    }

    this.ws.onerror = () => {
      window.dispatchEvent(new Event('onerrorWS'))
    }
  }

  send(type: string, data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }))
    }
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    this.ws?.close()
    this.ws = null
  }
}

export const wsService = new WSService()
