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

export default api;