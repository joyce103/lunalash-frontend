import { ref } from 'vue'

// 跟 authState.js 是完全獨立的兩套狀態，用不同的 localStorage key，
// 避免訪客登入跟管理員登入互相影響 (訪客 session 過期不該清到管理員的 token)
export const isGuestLoggedIn = ref(!!localStorage.getItem('guestToken'))
export const guestName = ref(localStorage.getItem('guestName') || '')
export const guestEmail = ref(localStorage.getItem('guestEmail') || '')

export const setGuestAuthState = (status, name = '', email = '') => {
  isGuestLoggedIn.value = status
  guestName.value = name
  guestEmail.value = email
}
