import React, { useState, useEffect } from 'react'
import { Avatar, List } from 'antd'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch'
import { getChatRecordList } from '@/store/modules/chat'
import { selectChatUserInfo, selectChatToken } from '@/store/modules/chatUser'

interface Props {
  curActiveId: any
  handleCurActiveId: (id?: number) => void
}

const ChatRecordList: React.FC<Props> = ({ curActiveId, handleCurActiveId }) => {
  // 用户信息
  const chatToken = useAppSelector(selectChatToken)
  const chatUserInfo = useAppSelector(selectChatUserInfo)

  const dispatch = useAppDispatch()
  const dataList = useAppSelector(state => state.chat?.chatRecordLists ?? [])

  useEffect(() => {
    if (chatToken) {
      dispatch(getChatRecordList({ chatToken, chatUserId: chatUserInfo?.id }))
    }
  }, [chatToken])

  return (
    <List
      itemLayout="horizontal"
      dataSource={dataList}
      renderItem={(item, index) => (
        <List.Item
          className="!pl-[10px]"
          style={{
            backgroundColor: curActiveId === item.id ? '#e6f4ff' : '',
            color: curActiveId === item.id ? '#1677ff !important' : '',
          }}
          onClick={() => handleCurActiveId(item.chatUser?.userId)}
        >
          <List.Item.Meta
            avatar={
              <Avatar src={item.avatar || `https://api.dicebear.com/7.x/miniavs/svg?seed=0`} />
            }
            title={
              <div className="flex items-center pr-[10px]">
                {/* 左边用户名 */}
                <div className="min-w-0 truncate">{item.chatUser?.username}</div>

                {/* 右边红点 + 时间 */}
                <div className="ml-[10px] flex items-center gap-[5px] flex-1">
                  {!!(item.unreadCount && item.unreadCount > 0) && (
                    <div className="w-[15px] h-[15px] text-[10px] text-white bg-[#b12423] rounded-full flex items-center justify-center">
                      {item.unreadCount}
                    </div>
                  )}
                  <div className="text-[10px] text-[#999] whitespace-nowrap flex-1 text-right">
                    {item.createdAt}
                  </div>
                </div>
              </div>
            }
            description="say something"
          />
        </List.Item>
      )}
    />
  )
}

export default ChatRecordList
