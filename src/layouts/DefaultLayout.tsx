import React from 'react'
import { NavBar } from 'antd-mobile'
import { useLocation, Outlet } from 'react-router-dom'
import routes from '@/router/routes'
import { useNavigate } from 'react-router-dom'

const DefaultLayout: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // 扁平化 routes 结构（支持嵌套 children）
  const flattenRoutes = (routes: any[], parentPath = ''): any[] => {
    return routes.flatMap(route => {
      const fullPath = `${parentPath}/${route.path}`.replace(/\/+/g, '/')
      const self = { ...route, fullPath }
      if (route.children) {
        return [self, ...flattenRoutes(route.children, fullPath)]
      }
      return [self]
    })
  }

  const flatRoutes = flattenRoutes(routes)

  // 匹配当前路由的 title
  const currentRoute = flatRoutes.find(route => route.fullPath === location.pathname)
  const title = currentRoute?.meta?.title || 'welcome'

  return (
    <div>
      <NavBar onBack={() => navigate(-1)}>{title}</NavBar>
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default DefaultLayout
