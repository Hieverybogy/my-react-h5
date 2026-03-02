import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store, persistor } from './store'
import RouteGuard from './components/RouteGuard'
import { PersistGate } from 'redux-persist/integration/react'

// 引入unocss
import '@/plugins/unocss'

import './styles/index.scss'
import './styles/nprogress.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <HashRouter>
          <RouteGuard>
            <App />
          </RouteGuard>
        </HashRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
