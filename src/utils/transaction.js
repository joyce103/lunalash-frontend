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
  // 查詢單筆交易
  async getTransactionById(transactionId) {
    try {
      const res = await api.get(`transactions/${transactionId}`)
      return res ? res : []
    } catch (error) {
      console.error(error)
      return null
    }
  },
  // 新增交易
  async createTransaction(postData) {
    try {
      const res = await api.post(`transactions`, postData)
      return res
    } catch (error) {
      console.error(error)
      return false
    }
  },
}

export default transaction
