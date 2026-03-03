import api from './api'

const member = {
  // 取得所有會員
  async getAllMembers() {
    try {
      const res = await api.get('/member/getAllMembers')
      return res.resultData
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
      return res ? res : null
    } catch (error) {
      console.error(error)
      return null
    }
  },
  // 新增會員
  async addMember(postData) {
    try {
      const res = await api.post('/member/addMember', postData)
      return res ? res : null
    } catch (error) {
      console.error(error)
      return null
    }
  },
  // 編輯會員資料
  async updateMember(postData) {
    try {
      const res = await api.put('/member/updateMember', postData)
      return res ? res : null
    } catch (error) {
      console.error(error)
      return null
    }
  },

}

export default member
