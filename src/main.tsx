import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import RouteGuard from './components/RouteGuard'

// 引入unocss
import '@/plugins/unocss'

import 'antd-mobile/es/global'
import './styles/index.scss'
import './styles/nprogress.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <RouteGuard>
          <App />
        </RouteGuard>
      </HashRouter>
    </Provider>
  </React.StrictMode>
)
