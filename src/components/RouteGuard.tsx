import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置 NProgress
NProgress.configure({ 
  showSpinner: false,
  minimum: 0.1,
  easing: 'ease',
  speed: 500
})

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()

  useEffect(() => {
    NProgress.start()
    
    // 模拟异步操作完成
    const timer = setTimeout(() => {
      NProgress.done()
    }, 500)

    return () => {
      clearTimeout(timer)
      NProgress.done()
    }
  }, [location])

  return <>{children}</>
}

export default RouteGuard 