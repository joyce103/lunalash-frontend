// JWT 的內容沒有加密，只是簽章防竄改，所以前端可以直接解 payload 來讀取帳號等資訊，
// 不需要額外呼叫 API，也不需要引入第三方套件
export function getUsernameFromToken(token) {
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    const json = decodeURIComponent(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    )
    return JSON.parse(json).sub || null
  } catch (error) {
    console.error('解析 token 失敗:', error)
    return null
  }
}
