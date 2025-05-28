import DefaultLayout from '@/layouts/DefaultLayout'
import Home from '@/views/Home'
import About from '@/views/About'
import Login from '@/views/Login'
import Record from '@/views/record'
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
]

export default routes
