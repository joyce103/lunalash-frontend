import { ref } from 'vue'

export const isLoggedIn = ref(!!localStorage.getItem('token'))
export const userName = ref(localStorage.getItem('userName') || '')

export const setAuthState = (status, name = '') => {
  isLoggedIn.value = status
  userName.value = name
}