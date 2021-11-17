import { StrictMode } from 'react'
import { ConfigProvider } from 'antd'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { store } from './app/store'
import './index.css'
import * as serviceWorker from './serviceWorker'
import cs from 'antd/lib/locale/cs_CZ'
import moment from 'moment'
import 'moment/locale/cs'

moment.locale('cs')

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ConfigProvider locale={cs}>
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
