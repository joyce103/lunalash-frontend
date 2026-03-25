import api from './api';

export default {
  /**
   * 登入 API
   * @param {Object} data - 登入資料
   * @param {string} data.account - 帳號或手機號碼
   * @param {string} data.password - 密碼
   * @returns {Promise<Object>} 回傳 API 的 resultData (包含 token 與 name)
   */
  async login(data) {
    const response = await api.post('/api/auth/login', data);
    return response.resultData;
  },

  /**
   * 登出處理 (前端清除 Token)
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
  }
};