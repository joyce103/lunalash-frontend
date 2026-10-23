// src/utils/guestApi.js
// 跟 api.js 是完全獨立的 axios instance，專門給「訪客 Google 登入後」的請求用，
// 帶的是 guestToken，401 處理方式也跟管理員那套不一樣 (不會導去管理員登入頁 '/')
import axios from 'axios'
import { setGuestAuthState } from '@/stores/guestAuthState'

const guestApi = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

guestApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('guestToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

guestApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) {
      alert('網路異常或伺服器無回應，請稍後再試')
      return Promise.reject(error)
    }

    const { status, data } = error.response

    // 訪客 session 過期或 token 無效：只清訪客狀態，留在原頁面變成未登入訪客，
    // 不像管理員那套攔截器一樣整頁導回 '/'（那是管理員登入頁，訪客不該被導去那裡）
    if (status === 401) {
      localStorage.removeItem('guestToken')
      localStorage.removeItem('guestName')
      localStorage.removeItem('guestEmail')
      setGuestAuthState(false, '', '')
      alert(data?.resultMsg || '登入已過期，請重新登入')
      return Promise.reject(error)
    }

    if (status !== 401) {
      alert(data?.resultMsg || `發生錯誤 (${status})，請稍後再試`)
    }
    return Promise.reject(error)
  }
)

export default guestApi
