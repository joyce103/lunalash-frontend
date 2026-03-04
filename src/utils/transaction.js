import api from './api'

const transaction = {
  // 取得會員交易紀錄
  async getTransactionsByMemberId(memberId) {
    try {
      const res = await api.get(`transactions/member/${memberId}`)
      return res ? res : null
    } catch (error) {
      console.error(error)
      return []
    }
  },

}

export default transaction
