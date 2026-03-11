import api from './api'

const transaction = {
  // 取得會員交易紀錄
  async getTransactionsByMemberId(memberId) {
    try {
      const res = await api.get(`transactions/member/${memberId}`)
      return res?.resultData ? res.resultData : null
    } catch (error) {
      console.error(error)
      return []
    }
  },
  // 查詢單筆交易
  async getTransactionById(transactionId) {
    try {
      const res = await api.get(`transactions/${transactionId}`)
      return res?.resultData ? res.resultData : []
    } catch (error) {
      console.error(error)
      return null
    }
  },
  // 新增交易
  async createTransaction(postData) {
    try {
      const res = await api.post(`transactions`, postData)
      if (res.resultCode === 0) {
        return true
      } else {
        console.error('新增交易失敗:', res.resultMsg)
        return false
      }
      return res
    } catch (error) {
      console.error(error)
      return false
    }
  },
  // 刪除交易
  async deleteTransaction(transactionId) {
    try {
      const res = await api.delete(`transactions/${transactionId}`)
      if (res.resultCode === 0) {
        return true
      } else {
        console.error('刪除交易失敗:', res.resultMsg)
        return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
  },
}

export default transaction
