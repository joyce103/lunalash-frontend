// src/utils/api.js
import axios from 'axios';

// 建立 Axios 實體
const api = axios.create({
  baseURL: 'http://localhost:8080', 
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
    // 這裡的 response.data 就是你後端回傳的 JSON 信封
    const res = response.data;

    if (res.resultCode !== 0) {      
      // 阻斷 Promise，讓頁面上的程式碼不會繼續往下執行
      return Promise.reject(new Error(res.resultMsg || 'Error'));
    }

    return res;
  },
  (error) => {
    // 處理 HTTP 層級的錯誤 (例如 401 未授權, 404, 500)
    console.error('API 請求失敗:', error);

    if (error.response && error.response.status === 401) {
      alert('登入已過期，請重新登入');
      // 這裡可以加上清除 Token 與導向登入頁的邏輯
      localStorage.removeItem('token');
      window.location.href = '/';
    } else {
      alert('網路異常或伺服器無回應');
    }
    return Promise.reject(error);
  }
);

export default api;