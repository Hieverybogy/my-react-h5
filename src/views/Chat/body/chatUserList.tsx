import React, { useState, useEffect } from 'react'
import { Avatar, List } from 'antd'
import axios from 'axios'
import { useAppSelector } from '@/hooks/useAppDispatch'
import { selectChatUserInfo, selectChatToken } from '@/store/modules/chatUser'

interface Props {
  curActiveId: any
  handleCurActiveId: (id?: number) => void
}

const ChatUserList: React.FC<Props> = ({ curActiveId, handleCurActiveId }) => {
  // 用户信息
  const chatToken = useAppSelector(selectChatToken)
  const chatUserInfo = useAppSelector(selectChatUserInfo)

  const [dataList, setDataList] = useState([])

  const getData = async () => {
    try {
      const res = await axios.get('/api/chat/user', {
        headers: {
          Authorization: 'Bearer ' + chatToken,
        },
      })
      if (res.data.code === 0) {
        const data = (res.data.result || []).filter((k: any) => k.id !== chatUserInfo?.id)
        setDataList(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (chatToken) {
      getData()
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
          onClick={() => handleCurActiveId(item.id)}
        >
          <List.Item.Meta
            avatar={
              <Avatar src={item.avatar || `https://api.dicebear.com/7.x/miniavs/svg?seed=0`} />
            }
            title={item.username}
          />
        </List.Item>
      )}
    />
  )
}

export default ChatUserList
