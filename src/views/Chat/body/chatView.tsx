import React, { useState, useEffect, useRef, useMemo } from 'react'
import axios from 'axios'
import { Input, Button, Avatar } from 'antd'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch'
import { setChatRecordLists, currentConversationId, getChatRecordList } from '@/store/modules/chat'
import { selectChatUserInfo, selectChatToken } from '@/store/modules/chatUser'

interface Props {
  curActiveId: any
}

const ChatView: React.FC<Props> = ({ curActiveId }) => {
  const dispatch = useAppDispatch()
  const chatRecordLists = useAppSelector(state => state.chat?.chatRecordLists ?? [])
  const conversationId = useAppSelector(currentConversationId)

  // 用户信息
  const chatToken = useAppSelector(selectChatToken)
  const chatUserInfo = useAppSelector(selectChatUserInfo)

  const scrollView = useRef<HTMLDivElement>(null)

  const [dataList, setDataList] = useState<any[]>([])
  const [chatInfo, setChatInfo] = useState<any>({})
  const members = useMemo(() => {
    return (chatInfo?.members || []).reduce((acc: any, cur: any) => {
      acc[cur.userId] = cur
      return acc
    }, {})
  }, [chatInfo])
  /**
   * 获取聊天记录
   */
  const getMessageData = async () => {
    try {
      const res = await axios.get(`/api/chat/message/${conversationId}`, {
        headers: {
          Authorization: 'Bearer ' + chatToken,
        },
      })
      if (res.data.code === 0) {
        const data = res.data.result?.messages || []
        setDataList(data)

        setTimeout(() => {
          if (data.filter(k => k.sender.id !== chatUserInfo?.id).some(k => !k.isRead)) {
            setMsgRead()
          }
        })
      }
    } catch (error) {
      console.error(error)
    }
  }
  const getChatInfo = async () => {
    try {
      const res = await axios.get(`/api/chat/conversation/${conversationId}`, {
        headers: {
          Authorization: 'Bearer ' + chatToken,
        },
      })
      if (res.data.code === 0) {
        setChatInfo(res.data.result || {})
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (!chatToken || !conversationId) return
    getMessageData()
    getChatInfo()
  }, [chatToken, conversationId])

  /**
   * 创建聊天
   */
  const createChat = async () => {
    try {
      const res = await axios.post(
        '/api/chat/conversation',
        {
          targetUserId: curActiveId,
        },
        {
          headers: {
            Authorization: 'Bearer ' + chatToken,
          },
        }
      )
      if (res.data.code === 0) {
        chatToken && dispatch(getChatRecordList({ chatToken, chatUserId: chatUserInfo?.id }))
      }
      return res.data.result?.id
    } catch (error) {
      console.error(error)
    }
  }

  const hasCreatedRef = useRef(false)
  useEffect(() => {
    if (!curActiveId || !chatToken || hasCreatedRef.current) return
    hasCreatedRef.current = true

    setTimeout(() => {
      hasCreatedRef.current = false
    }, 100)

    setDataList([])
    setChatInfo({})
  }, [curActiveId, chatToken])

  /**
   * 发送消息
   */
  const [inputValue, setInputValue] = useState('')
  const sendChat = async () => {
    let _conversationId = conversationId
    if (!_conversationId) {
      _conversationId = await createChat()
    }
    const res = await axios.post(
      '/api/chat/message',
      {
        conversationId: _conversationId,
        content: inputValue,
        type: 'text',
      },
      {
        headers: {
          Authorization: 'Bearer ' + chatToken,
        },
      }
    )
    if (res.data.code === 0) {
      setInputValue('')
      setDataList([...dataList, res.data.result])
    }
  }

  /**
   * 标记指定会话的所有消息为已读状态
   */
  const setMsgRead = async () => {
    if (!conversationId) return
    const res = await axios.put(
      '/api/chat/message/read/' + conversationId,
      {},
      {
        headers: {
          Authorization: 'Bearer ' + chatToken,
        },
      }
    )
    if (res.data.code === 0) {
      const arr = chatRecordLists.map((item: any) => {
        if (item.id === conversationId) {
          return {
            ...item,
            unreadCount: 0,
          }
        } else {
          return item
        }
      })
      dispatch(setChatRecordLists(arr))
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [dataList])

  const scrollToBottom = () => {
    if (scrollView.current) {
      scrollView.current.scrollTop = scrollView.current.scrollHeight
    }
  }

  /********************
   * ws
   */
  useEffect(() => {
    const handleMessageWS = (event: Event) => {
      const customEvent = event as CustomEvent
      const data = customEvent.detail
      if (data.type === 'new_message') {
        const newMessages = data.data
        if (newMessages?.conversationId === conversationId) {
          setDataList(prev => {
            return [...prev, newMessages]
          })
          setMsgRead()
        }
      }
    }
    window.addEventListener('onmessageWS', handleMessageWS)

    return () => {
      window.removeEventListener('onmessageWS', handleMessageWS)
    }
  }, [conversationId])

  return (
    <div className="h-full">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-scroll p-[15px]" ref={scrollView}>
          {dataList.map((item: any, index: number) => (
            <div
              key={item.id}
              className="flex gap-[10px] mb-[10px]"
              style={{ flexDirection: chatUserInfo.id === item.senderId ? 'row-reverse' : 'row' }}
            >
              <Avatar
                src={
                  members[item.senderId]?.avatar ||
                  `https://api.dicebear.com/7.x/miniavs/svg?seed=0`
                }
              />
              <div className="p-[15px] rounded-[6px] bg-[#eee]">{item.content}</div>
            </div>
          ))}
        </div>
        <div className="px-[15px] py-[10px] bg-[#eee] flex">
          <Input
            className="flex-1 mr-[10px]"
            placeholder="请输入消息"
            value={inputValue}
            onChange={e => {
              setInputValue(e.target.value)
            }}
            onPressEnter={sendChat}
          />
          <Button type="primary" onClick={sendChat}>
            发送
          </Button>
        </div>
      </div>
    </div>
  )
}
export default ChatView
