import api from './api';
import { setAuthState } from '@/stores/authState';

export default {
  /**
   * 登入 API
   * @param {Object} data - 登入資料
   * @param {string} data.account - 帳號或手機號碼
   * @param {string} data.password - 密碼
   * @returns {Promise<Object>} 回傳 API 的 resultData (包含 token 與 name)
   */
async login(data) {
    try {
      const response = await api.post('/auth/login', data);
      if (response.resultData?.token) {
        localStorage.setItem('token', response.resultData.token);
        localStorage.setItem('userName', response.resultData.name || '');
        setAuthState(true, response.resultData.name);
        return true;
      }
      return false;

    } catch (error) {
      // 判斷是不是後端回傳的 401 (帳號或密碼錯誤)
      if (error.response && error.response.status === 401) {
        const errorData = error.response.data;
        
        console.warn('登入失敗:', errorData.resultMsg);
        alert(errorData.resultMsg); // 顯示後端傳來的錯誤訊息
        
        return false;
      }

      // 其他系統異常
      console.error('系統錯誤:', error.message);
      alert('系統發生異常，請稍後重試');
      return false;
    }
  },

  /**
   * 登出處理 (前端清除 Token)
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
  }
};