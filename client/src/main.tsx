import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const envApiUrl = import.meta.env.VITE_API_URL
const fallbackApiBase = `${window.location.protocol}//${window.location.hostname}:5174`

let apiUrl: string = (envApiUrl || fallbackApiBase).replace(/\/+$/, '')
if(!apiUrl.endsWith('/api')) {
  apiUrl = `${apiUrl}/api`
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App apiUrl={apiUrl} />
)
