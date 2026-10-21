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
  // 送出預約申請，成功時 data 裡會帶查詢碼 (queryCode)，供之後查詢預約狀態用
  async createAppointment(postData) {
    try {
      const res = await api.post('/appointments', postData)
      if (res.resultCode === 0) {
        return { success: true, data: res.resultData }
      }
      return { success: false, message: res.resultMsg }
    } catch (error) {
      const message = error.response?.data?.resultMsg || '系統發生異常，請稍後再試'
      return { success: false, message }
    }
  },
  // 客人用電話+查詢碼查詢預約狀態；查無資料時後端用 resultCode 非 0 但 HTTP 200 表示，
  // 不會被 api.js 的攔截器當成錯誤跳 alert，由呼叫端自己決定怎麼顯示
  async lookupAppointment(phone, queryCode) {
    try {
      const res = await api.post('/appointments/lookup', { phone, queryCode })
      if (res.resultCode === 0) {
        return { success: true, data: res.resultData }
      }
      return { success: false, message: res.resultMsg }
    } catch (error) {
      // 這裡的錯誤 (非 401) api.js 攔截器已經跳過 alert 了，這裡只回傳訊息讓畫面顯示，不要再 alert 一次
      const message = error.response?.data?.resultMsg || '系統發生異常，請稍後再試'
      return { success: false, message }
    }
  },
}

export default booking
