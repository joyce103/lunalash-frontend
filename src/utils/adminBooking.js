import api from './api'

const adminBooking = {
  // ===== Dashboard =====
  async getStats() {
    try {
      const res = await api.get('/admin/dashboard/stats')
      return res?.resultCode === 0 ? res.resultData : null
    } catch (error) {
      console.error(error)
      return null
    }
  },

  // ===== 預約管理 =====
  async searchAppointments(params) {
    try {
      const res = await api.get('/admin/appointments', { params })
      return res?.resultCode === 0 && res.resultData ? res.resultData : []
    } catch (error) {
      console.error(error)
      return []
    }
  },
  async approveAppointment(appointmentId) {
    try {
      const res = await api.patch(`/admin/appointments/${appointmentId}/approve`)
      if (res.resultCode === 0) return { success: true }
      return { success: false, message: res.resultMsg }
    } catch (error) {
      return { success: false, message: error.response?.data?.resultMsg || '核准失敗，請稍後再試' }
    }
  },
  async rejectAppointment(appointmentId) {
    try {
      const res = await api.patch(`/admin/appointments/${appointmentId}/reject`)
      if (res.resultCode === 0) return { success: true }
      return { success: false, message: res.resultMsg }
    } catch (error) {
      return { success: false, message: error.response?.data?.resultMsg || '拒絕失敗，請稍後再試' }
    }
  },

  // ===== 服務項目管理 =====
  async getAllServices() {
    try {
      const res = await api.get('/admin/services')
      return res?.resultCode === 0 && res.resultData ? res.resultData : []
    } catch (error) {
      console.error(error)
      return []
    }
  },
  async createService(postData) {
    try {
      const res = await api.post('/admin/services', postData)
      if (res.resultCode === 0) return { success: true }
      return { success: false, message: res.resultMsg }
    } catch (error) {
      return { success: false, message: error.response?.data?.resultMsg || '新增失敗，請稍後再試' }
    }
  },
  async updateService(serviceItemId, postData) {
    try {
      const res = await api.put(`/admin/services/${serviceItemId}`, postData)
      if (res.resultCode === 0) return { success: true }
      return { success: false, message: res.resultMsg }
    } catch (error) {
      return { success: false, message: error.response?.data?.resultMsg || '更新失敗，請稍後再試' }
    }
  },
  async deleteService(serviceItemId) {
    try {
      const res = await api.delete(`/admin/services/${serviceItemId}`)
      if (res.resultCode === 0) return { success: true }
      return { success: false, message: res.resultMsg }
    } catch (error) {
      return { success: false, message: error.response?.data?.resultMsg || '刪除失敗，請稍後再試' }
    }
  },

  // ===== 日期管理 =====
  async getAllDates() {
    try {
      const res = await api.get('/admin/calendar')
      return res?.resultCode === 0 && res.resultData ? res.resultData : []
    } catch (error) {
      console.error(error)
      return []
    }
  },
  async addDate(date) {
    try {
      const res = await api.post('/admin/calendar', { date })
      if (res.resultCode === 0) return { success: true }
      return { success: false, message: res.resultMsg }
    } catch (error) {
      return { success: false, message: error.response?.data?.resultMsg || '新增失敗，請稍後再試' }
    }
  },
  async openDate(availableDateId) {
    const res = await api.patch(`/admin/calendar/${availableDateId}/open`)
    return res
  },
  async closeDate(availableDateId) {
    const res = await api.patch(`/admin/calendar/${availableDateId}/close`)
    return res
  },
  async deleteDate(availableDateId) {
    try {
      const res = await api.delete(`/admin/calendar/${availableDateId}`)
      if (res.resultCode === 0) return { success: true }
      return { success: false, message: res.resultMsg }
    } catch (error) {
      return { success: false, message: error.response?.data?.resultMsg || '刪除失敗，請稍後再試' }
    }
  },

  // ===== 操作項目管理 =====
  async getAllOperationCatalogItems() {
    try {
      const res = await api.get('/admin/operation-catalog')
      return res?.resultCode === 0 && res.resultData ? res.resultData : []
    } catch (error) {
      console.error(error)
      return []
    }
  },
  async createOperationCatalogItem(postData) {
    try {
      const res = await api.post('/admin/operation-catalog', postData)
      if (res.resultCode === 0) return { success: true }
      return { success: false, message: res.resultMsg }
    } catch (error) {
      return { success: false, message: error.response?.data?.resultMsg || '新增失敗，請稍後再試' }
    }
  },
  async updateOperationCatalogItem(operationCatalogItemId, postData) {
    try {
      const res = await api.put(`/admin/operation-catalog/${operationCatalogItemId}`, postData)
      if (res.resultCode === 0) return { success: true }
      return { success: false, message: res.resultMsg }
    } catch (error) {
      return { success: false, message: error.response?.data?.resultMsg || '更新失敗，請稍後再試' }
    }
  },
  async deleteOperationCatalogItem(operationCatalogItemId) {
    try {
      const res = await api.delete(`/admin/operation-catalog/${operationCatalogItemId}`)
      if (res.resultCode === 0) return { success: true }
      return { success: false, message: res.resultMsg }
    } catch (error) {
      return { success: false, message: error.response?.data?.resultMsg || '刪除失敗，請稍後再試' }
    }
  },

  // ===== 時段管理 =====
  async getSlotConfig(date) {
    try {
      const res = await api.get('/admin/slots', { params: { date } })
      return res?.resultCode === 0 && res.resultData ? res.resultData : []
    } catch (error) {
      console.error(error)
      return []
    }
  },
  async setSlots(date, openTimes) {
    try {
      const res = await api.put('/admin/slots', { date, openTimes })
      if (res.resultCode === 0) return { success: true }
      return { success: false, message: res.resultMsg }
    } catch (error) {
      return { success: false, message: error.response?.data?.resultMsg || '設定失敗，請稍後再試' }
    }
  },
}

export default adminBooking
