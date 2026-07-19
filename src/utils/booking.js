import api from './api'

const booking = {
  // 查詢所有啟用中的操作項目 (訪客用，可複選，完全公開)
  async getOperationCatalogItems() {
    try {
      const res = await api.get('/operation-catalog')
      return res?.resultCode === 0 && res.resultData ? res.resultData : []
    } catch (error) {
      console.error(error)
      return []
    }
  },
  // 查詢某個月份哪些日期開放
  async getCalendar(year, month) {
    try {
      const res = await api.get('/calendar', { params: { year, month } })
      return res?.resultCode === 0 && res.resultData ? res.resultData : []
    } catch (error) {
      console.error(error)
      return []
    }
  },
  // 查詢某一天各時段狀態，operationItemIds 用來讓後端依選擇項目的時間加總判斷時段是否能容納
  async getAvailableSlots(date, operationItemIds) {
    try {
      const res = await api.get('/available-slots', { params: { date, operationItemIds } })
      return res?.resultCode === 0 && res.resultData ? res.resultData : []
    } catch (error) {
      console.error(error)
      return []
    }
  },
  // 送出預約申請
  async createAppointment(postData) {
    try {
      const res = await api.post('/appointments', postData)
      if (res.resultCode === 0) {
        return { success: true }
      }
      return { success: false, message: res.resultMsg }
    } catch (error) {
      const message = error.response?.data?.resultMsg || '系統發生異常，請稍後再試'
      return { success: false, message }
    }
  },
}

export default booking
