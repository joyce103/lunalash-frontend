import api from './api'

const member = {
  // 取得所有會員
  async getAllMembers() {
    try {
      const res = await api.get('/member/getAllMembers')
      const { resultCode, resultData } = res || {}
      return resultCode === 0 && resultData ? res.resultData : null
    } catch (error) {
      console.error(error)
      return []
    }
  },
  // 手機號碼查會員
  async getMemberByPhone(phone) {
    try {
      const res = await api.post('/member/getMemberByPhone', {
        phone
      })
      const { resultCode, resultData } = res || {}
      return resultCode === 0 && resultData ? res.resultData : null
    } catch (error) {
      console.error(error)
      return null
    }
  },
  // 新增會員
  async addMember(postData) {
    try {
      const res = await api.post('/member/addMember', postData)
      if (res.resultCode === 0) {
        alert('會員資料新增成功！')
        return true
      } else {
        alert('會員資料新增失敗: ' + res.resultMsg)
      }
    } catch (error) {
      console.error(error)
      return null
    }
  },
  // 編輯會員資料
  async updateMember(postData) {
    try {
      const res = await api.put('/member/updateMember', postData)
      if (res.resultCode === 0) {
        alert('會員資料更新成功！')
        return true
      } else {
        alert('會員資料更新失敗: ' + res.resultMsg)
      }
    } catch (error) {
      console.error(error)
      return null
    }
  },

}

export default member
