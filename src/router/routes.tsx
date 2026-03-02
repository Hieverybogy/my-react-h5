import DefaultLayout from '@/layouts/DefaultLayout'
import ChatLayout from '@/layouts/ChatLayout'
import Home from '@/views/Home'
import About from '@/views/About'
import Login from '@/views/Login'
import Record from '@/views/Record'
import Chat from '@/views/Chat/body/index'
import ChatLogin from '@/views/Chat/login'
import ChatRegister from '@/views/Chat/register'
import RequireAuth from '@/components/RequireAuth'

const routes = [
  {
    path: '/login',
    element: <Login />,
    meta: { title: '登录' },
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <DefaultLayout />
      </RequireAuth>
    ),
    children: [
      {
        path: '',
        element: <Home />,
        meta: { title: '首页' },
      },
      {
        path: 'about',
        element: <About />,
        meta: { title: '关于我们' },
      },
      {
        path: 'record',
        element: <Record />,
        meta: { title: '打卡记录' },
      },
    ],
  },
  {
    path: 'chat',
    element: <ChatLayout />,
    children: [
      {
        path: '',
        element: <Chat />,
        meta: { title: '聊天室' },
      },
      {
        path: 'login',
        element: <ChatLogin />,
        meta: { title: '聊天室 - 登录' },
      },
      {
        path: 'register',
        element: <ChatRegister />,
        meta: { title: '聊天室 - 注册' },
      },
    ],
  },
]

export default routes
