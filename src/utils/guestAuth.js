import api from './api'
import guestApi from './guestApi'
import { setGuestAuthState } from '@/stores/guestAuthState'

export default {
  // 用 Google Sign-In 拿到的 idToken 換站內 JWT；這支本身不需要帶任何 token，用一般 api.js 即可
  async loginWithGoogle(idToken) {
    try {
      const response = await api.post('/auth/google', { idToken })
      if (response.resultData?.token) {
        const { token, name } = response.resultData
        localStorage.setItem('guestToken', token)
        localStorage.setItem('guestName', name || '')
        setGuestAuthState(true, name || '')
        return true
      }
      return false
    } catch (error) {
      console.error('Google 登入失敗:', error)
      alert(error.response?.data?.resultMsg || 'Google 登入失敗，請稍後再試')
      return false
    }
  },

  // 查詢目前登入身分底下的所有預約
  async fetchMyAppointments() {
    try {
      const res = await guestApi.get('/appointments/my')
      return res?.resultCode === 0 && res.resultData ? res.resultData : []
    } catch (error) {
      console.error(error)
      return []
    }
  },

  logout() {
    localStorage.removeItem('guestToken')
    localStorage.removeItem('guestName')
    localStorage.removeItem('guestEmail')
    setGuestAuthState(false, '', '')
  },
}
