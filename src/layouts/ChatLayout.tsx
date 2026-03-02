import React, { useEffect } from 'react'
import { useLocation, Outlet, useNavigate } from 'react-router-dom'
import 'antd/dist/reset.css' // PC 版 Ant Design 样式
import { Layout, Avatar, Button, Dropdown } from 'antd'
import ReactLogo from '../assets/images/react.svg'
import { useAppSelector } from '@/hooks/useAppDispatch'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { selectChatUserInfo, resetChatUserInfo } from '@/store/modules/chatUser'

const { Header, Content } = Layout

const ChatLayout: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const dispatch = useAppDispatch()
  const chatUserInfo = useAppSelector(selectChatUserInfo)

  useEffect(() => {
    if (
      location.pathname !== '/chat/login' &&
      location.pathname !== '/chat/register' &&
      !chatUserInfo
    ) {
      navigate('/chat/login')
    }
  }, [])

  const handleLoginRegister = () => {
    navigate(location.pathname === '/chat/login' ? '/chat/register' : '/chat/login')
  }

  const handleLogout = () => {
    dispatch(resetChatUserInfo())
    navigate('/chat/login')
  }

  return (
    <Layout className="h-[100vh] flex flex-col">
      <Header className="flex items-center bg-#fff h-[50px] leading-[50px] pl-[0] pr-0">
        <div className="flex-1 mr-[20px] h-[50px] flex items-center pl-[10px]">
          <img className="w-[30px] h-[30px] mr-[10px]" src={ReactLogo} alt="" />
          Chat Room
        </div>
        {chatUserInfo && (
          <Dropdown
            menu={{ items: [{ key: '1', label: '退出登录', onClick: handleLogout }] }}
            placement="bottom"
            arrow
            className="text-center"
          >
            <div className="flex items-center cursor-pointer hover:bg-[#e6f4ff] px-[20px]">
              <Avatar
                src={chatUserInfo.avatar || `https://api.dicebear.com/7.x/miniavs/svg?seed=0`}
              />
              <div className="ml-[10px]">
                <div>{chatUserInfo.username}</div>
              </div>
            </div>
          </Dropdown>
        )}
        {!chatUserInfo && (
          <Button type="primary" onClick={handleLoginRegister} className="mr-[20px]">
            {location.pathname === '/chat/login' ? '注册' : '登录'}
          </Button>
        )}
      </Header>
      <Content className="flex-1">
        <Outlet />
      </Content>
    </Layout>
  )
}

export default ChatLayout
