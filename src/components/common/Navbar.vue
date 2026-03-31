<template>
  <nav class="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-lotus-100 z-50 shadow-sm transition-all duration-300">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        
        <router-link to="/" class="flex-shrink-0 flex items-center cursor-pointer">
          <span class="text-2xl font-bold text-lotus-600 tracking-widest">LumeLash</span>
        </router-link>

        <div class="flex items-center space-x-6">
          <router-link to="/" class="text-gray-500 hover:text-lotus-500 px-3 py-2 text-sm font-medium transition-colors duration-200">
            首頁
          </router-link>
          <router-link to="/about" class="text-gray-500 hover:text-lotus-500 px-3 py-2 text-sm font-medium transition-colors duration-200">
            關於 LumeLash
          </router-link>
          
          <div v-if="isLoggedIn" class="flex items-center gap-4 ml-4">
            <span class="text-sm text-gray-700 font-medium">
              歡迎，<span class="text-lotus-600">{{ userName }}</span>
            </span>
            <button 
              @click="handleLogout"
              class="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 transition-all duration-200"
            >
              登出
            </button>
          </div>

          <router-link 
            v-else
            to="/member" 
            class="ml-4 px-5 py-2 rounded-full bg-lotus-50 text-lotus-600 border border-lotus-200 hover:bg-lotus-100 hover:shadow-sm font-medium text-sm transition-all duration-200"
          >
            查詢會員
          </router-link>

          </div>
        
      </div>
    </div>
  </nav>
  <div class="h-16"></div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { isLoggedIn, userName, setAuthState } from '@/stores/authState'

const router = useRouter()

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