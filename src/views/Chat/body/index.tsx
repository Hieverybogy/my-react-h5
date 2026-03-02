import React, { useCallback, useEffect } from 'react'
import { Tabs } from 'antd'
import ChatRecordList from './chatRecordList'
import ChatUserList from './chatUserList'
import ChatView from './chatView'
import { setCurrentTargetUserId, getChatRecordList } from '@/store/modules/chat'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch'
import { wsService } from '@/services/websocket'
import { selectChatUserInfo, selectChatToken } from '@/store/modules/chatUser'

const leftTabsOpts = [
  { key: '1', label: '聊天记录' },
  { key: '2', label: '好友列表' },
]

const ChatBody: React.FC = () => {
  const chatToken = useAppSelector(selectChatToken)
  const chatUserInfo = useAppSelector(selectChatUserInfo)

  const dispatch = useAppDispatch()
  const currentTargetUserId = useAppSelector(state => state.chat?.currentTargetUserId)

  const [activeTabKey, setActiveTabKey] = React.useState('1')

  const handleTabChange = (key: string) => {
    console.log(key)
    setActiveTabKey(key)
  }

  const handleCurActiveId = useCallback((id?: number) => {
    id && dispatch(setCurrentTargetUserId(id))
  }, [])

  /********************
   * ws
   */
  useEffect(() => {
    if (!chatToken) return
    wsService.connect(chatToken)

    return () => {
      wsService.disconnect()
    }
  }, [chatToken])
  useEffect(() => {
    const handleMessageWS = (event: Event) => {
      const customEvent = event as CustomEvent
      const data = customEvent.detail
      if (data.type === 'new_message') {
        console.log('收到新消息:', data.data)
        const timer = setTimeout(() => {
          if (chatToken && chatUserInfo?.id) {
            dispatch(getChatRecordList({ chatToken, chatUserId: chatUserInfo.id }))
          }
        }, 500)
        return () => clearTimeout(timer)
      }
    }

    window.addEventListener('onmessageWS', handleMessageWS)
    return () => {
      window.removeEventListener('onmessageWS', handleMessageWS)
    }
  }, [chatToken, chatUserInfo, dispatch])

  return (
    <div className="flex h-100%">
      <div className="w-[300px] b-r-[1px] b-r-solid b-r-[#ccc] flex flex-col">
        <Tabs
          defaultActiveKey="1"
          items={leftTabsOpts}
          onChange={handleTabChange}
          centered
          styles={{ header: { backgroundColor: '#e6e6e6' } }}
        />
        <div className="flex-1 overflow-scroll">
          <div style={{ display: activeTabKey === '1' ? 'block' : 'none' }}>
            <ChatRecordList
              curActiveId={currentTargetUserId}
              handleCurActiveId={handleCurActiveId}
            />
          </div>

          <div style={{ display: activeTabKey === '2' ? 'block' : 'none' }}>
            <ChatUserList curActiveId={currentTargetUserId} handleCurActiveId={handleCurActiveId} />
          </div>
        </div>
      </div>
      <div className="flex-1 h-full">
        {!currentTargetUserId && (
          <div className="flex items-center text-center h-full w-full">
            <div className="m-auto">请选择聊天对象</div>
          </div>
        )}
        {currentTargetUserId && <ChatView curActiveId={currentTargetUserId} />}
      </div>
    </div>
  )
}
export default ChatBody
