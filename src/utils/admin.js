import api from './api'

const admin = {
  // 取得所有管理員帳號
  async getAllAdmins() {
    try {
      const res = await api.get('/admin/list')
      return res?.resultCode === 0 && res.resultData ? res.resultData : []
    } catch (error) {
      console.error(error)
      return []
    }
  },
  // 新增管理員帳號：最高管理員會直接生效，一般管理員只會送出待審核申請
  async register(postData) {
    try {
      const res = await api.post('/admin/register', postData)
      if (res.resultCode === 0) {
        if (res.resultData?.status === 'PENDING_APPROVAL') {
          alert('已送出新增帳號的申請，待最高管理員核准後才會生效')
        } else {
          alert('帳號新增成功！')
        }
        return true
      } else {
        alert('帳號新增失敗: ' + res.resultMsg)
        return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
  },
  // 刪除管理員帳號：最高管理員會直接生效，一般管理員只會送出待審核申請
  async deleteAdmin(adminId) {
    try {
      const res = await api.delete(`/admin/${adminId}`)
      if (res.resultCode === 0) {
        if (res.resultData?.status === 'PENDING_APPROVAL') {
          alert('已送出刪除帳號的申請，待最高管理員核准後才會生效')
        } else {
          alert('帳號刪除成功！')
        }
        return true
      } else {
        alert('帳號刪除失敗: ' + res.resultMsg)
        return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
  },
  // 修改自己的密碼
  async changePassword(postData) {
    try {
      const res = await api.put('/admin/password', postData)
      if (res.resultCode === 0) {
        alert('密碼修改成功，請重新登入')
        return true
      } else {
        alert('密碼修改失敗: ' + res.resultMsg)
        return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
  },
  // 取得待審核的帳號申請（僅限最高管理員，其他人呼叫會被後端擋 403）
  async getPendingRequests() {
    try {
      const res = await api.get('/admin/requests')
      return res?.resultCode === 0 && res.resultData ? res.resultData : []
    } catch (error) {
      console.error(error)
      return []
    }
  },
  // 核准申請
  async approveRequest(requestId) {
    try {
      const res = await api.post(`/admin/requests/${requestId}/approve`)
      if (res.resultCode === 0) {
        alert('已核准此申請')
        return true
      } else {
        alert('核准失敗: ' + res.resultMsg)
        return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
  },
  // 駁回申請
  async rejectRequest(requestId) {
    try {
      const res = await api.post(`/admin/requests/${requestId}/reject`)
      if (res.resultCode === 0) {
        alert('已駁回此申請')
        return true
      } else {
        alert('駁回失敗: ' + res.resultMsg)
        return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
  },
}

export default admin
