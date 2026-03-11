// src/utils/api.js
import axios from 'axios';

// 建立 Axios 實體
const api = axios.create({
  baseURL: 'http://localhost:8080', 
  timeout: 10000, // 請求超時時間 (10秒)
});

// Response 攔截器：處理後端回傳的資料
api.interceptors.response.use(
  (response) => {
    // 這裡的 response.data 就是你後端回傳的 JSON 信封
    const res = response.data;

    // 判斷你自訂的 resultCode (假設 200 代表成功)
    if (res.resultCode !== 0) {      
      // 阻斷 Promise，讓頁面上的程式碼不會繼續往下執行
      return Promise.reject(new Error(res.resultMsg || 'Error'));
    }

    return res;
  },
  (error) => {
    // 處理 HTTP 層級的錯誤 (例如 404, 500, 或後端根本沒開)
    console.error('API 請求失敗:', error);
    alert('網路異常或伺服器無回應');
    return Promise.reject(error);
  }
);

export default api;