<template>
  <nav class="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-lotus-100 z-50 shadow-sm transition-all duration-300">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">

        <router-link to="/" class="flex-shrink-0 flex items-center cursor-pointer whitespace-nowrap">
          <span class="text-2xl font-bold text-lotus-600 tracking-widest">LumeLash</span>
        </router-link>

        <div class="flex items-center gap-1 sm:gap-2">
          <router-link v-if="!isLoggedIn" to="/" class="whitespace-nowrap text-gray-500 hover:text-lotus-500 px-2 py-2 text-sm font-medium transition-colors duration-200">
            首頁
          </router-link>
          <router-link v-else to="/member" class="whitespace-nowrap text-gray-500 hover:text-lotus-500 px-2 py-2 text-sm font-medium transition-colors duration-200">
            會員查詢
          </router-link>
          <router-link to="/about" class="whitespace-nowrap text-gray-500 hover:text-lotus-500 px-2 py-2 text-sm font-medium transition-colors duration-200">
            關於 LumeLash
          </router-link>
          <router-link to="/booking" class="whitespace-nowrap text-gray-500 hover:text-lotus-500 px-2 py-2 text-sm font-medium transition-colors duration-200">
            線上預約
          </router-link>

          <!-- 預約系統後台相關頁面收進下拉選單，避免導覽列項目太多跑版 -->
          <div v-if="isLoggedIn" class="relative" @keydown.escape="bookingMenuOpen = false">
            <button
              @click="bookingMenuOpen = !bookingMenuOpen"
              class="whitespace-nowrap text-gray-500 hover:text-lotus-500 px-2 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
            >
              預約系統管理
              <span class="text-xs transition-transform" :class="{ 'rotate-180': bookingMenuOpen }">▾</span>
            </button>
            <div
              v-if="bookingMenuOpen"
              v-click-outside="() => (bookingMenuOpen = false)"
              class="absolute right-0 mt-1 w-40 bg-white rounded-xl border border-lotus-100 shadow-lg py-1 flex flex-col"
            >
              <router-link @click="bookingMenuOpen = false" to="/appointments" class="px-4 py-2 text-sm text-gray-600 hover:bg-lotus-50 hover:text-lotus-600 whitespace-nowrap">預約管理</router-link>
              <router-link @click="bookingMenuOpen = false" to="/scheduleManagement" class="px-4 py-2 text-sm text-gray-600 hover:bg-lotus-50 hover:text-lotus-600 whitespace-nowrap">時段管理</router-link>
              <router-link @click="bookingMenuOpen = false" to="/operationCatalogManagement" class="px-4 py-2 text-sm text-gray-600 hover:bg-lotus-50 hover:text-lotus-600 whitespace-nowrap">操作項目管理</router-link>
            </div>
          </div>

          <router-link v-if="isLoggedIn" to="/account" class="whitespace-nowrap text-gray-500 hover:text-lotus-500 px-2 py-2 text-sm font-medium transition-colors duration-200">
            帳號管理
          </router-link>

          <div v-if="isLoggedIn" class="flex items-center gap-3 ml-2">
            <span class="whitespace-nowrap text-sm text-gray-700 font-medium hidden sm:inline">
              歡迎，<span class="text-lotus-600">{{ userName }}</span>
            </span>
            <button
              @click="handleLogout"
              class="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 transition-all duration-200"
            >
              登出
            </button>
          </div>

          <router-link
            v-else
            to="/"
            class="whitespace-nowrap ml-2 px-5 py-2 rounded-full bg-lotus-50 text-lotus-600 border border-lotus-200 hover:bg-lotus-100 hover:shadow-sm font-medium text-sm transition-all duration-200"
          >
            登入 / 註冊
          </router-link>

        </div>

      </div>
    </div>
  </nav>
  <div class="h-16"></div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { isLoggedIn, userName, setAuthState } from '@/stores/authState'

const router = useRouter()
const bookingMenuOpen = ref(false)

// 點擊下拉選單以外的地方就關閉選單
// 注意：一定要延後到下一個 tick 才註冊監聽，不然「打開選單」那次點擊本身冒泡到 document 時，
// 會被剛掛上去的這個監聽器誤判成「點了選單外面」，選單一開就立刻被關掉
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutsideHandler = (event) => {
      if (!el.contains(event.target)) binding.value(event)
    }
    setTimeout(() => {
      document.addEventListener('click', el._clickOutsideHandler)
    }, 0)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutsideHandler)
  },
}

// 登出邏輯
const handleLogout = () => {
  // 清除 LocalStorage
  localStorage.removeItem('token')
  localStorage.removeItem('userName')
  // auth.logout()

  // 更新全域狀態為「未登入」
  setAuthState(false, '')

  console.log('已登出')

  // 跳轉至登入頁
  router.push('/')
}
</script>