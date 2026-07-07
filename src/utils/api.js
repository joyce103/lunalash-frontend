// src/utils/api.js
import axios from 'axios';

// 建立 Axios 實體
const api = axios.create({
  // baseURL: 'http://localhost:8080', 
  baseURL: '/api',
  timeout: 10000, // 請求超時時間 (10秒)
});

// Request 攔截器：發送請求前自動帶入 Token
api.interceptors.request.use(
  (config) => {
    // 從 localStorage 中取得 token (如果你最後決定存 cookie，這裡就改成讀取 cookie)
    const token = localStorage.getItem('token');

    if (token) {
      // 將 Token 放入 Header。
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // 請求建立失敗時的處理
    return Promise.reject(error);
  }
);

// Response 攔截器：處理後端回傳的資料
api.interceptors.response.use(
  (response) => {
    const res = response.data;
    return res;
  },
  (error) => {
    // 完全沒有收到回應 (斷線、逾時、後端沒開)
    if (!error.response) {
      alert('網路異常或伺服器無回應，請稍後再試');
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const isLoginRequest = error.config?.url?.includes('/auth/login');

    // 登入 API 本身回傳的 401 (帳號密碼錯誤) 交給呼叫端 (auth.js) 顯示訊息，
    // 這裡不重複跳 alert，也不能當成「已登入過的 session 過期」去清 token、強制導頁
    if (status === 401 && !isLoginRequest) {
      alert(data?.resultMsg || '登入已過期，請重新登入');
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      window.location.href = '/';
      return Promise.reject(error);
    }

    if (status !== 401) {
      // 其他 HTTP 錯誤：優先顯示後端提供的訊息，讓使用者知道實際發生什麼事
      alert(data?.resultMsg || `發生錯誤 (${status})，請稍後再試`);
    }
    return Promise.reject(error);
  }
);

export default api;