<template>
  <div class="max-w-md mx-auto space-y-6 font-sans mt-12">
    
    <PageTitle 
      title="系統登入" 
      subtitle="請輸入您的帳號與密碼以繼續" 
    />

    <div class="bg-white p-6 sm:p-8 rounded-2xl border border-lotus-100 shadow-sm">
      <form @submit.prevent="handleLogin" class="space-y-5">
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">帳號 / 手機號碼</label>
          <input 
            v-model="loginForm.username"
            type="text" 
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lotus-400 focus:border-transparent transition-colors text-sm"
            placeholder="請輸入帳號"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">密碼</label>
          <input 
            v-model="loginForm.password"
            type="password" 
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lotus-400 focus:border-transparent transition-colors text-sm"
            placeholder="請輸入密碼"
            required
          />
        </div>

        <div class="flex items-center justify-end">
          <a href="#" class="text-sm text-lotus-400 hover:text-lotus-500 transition-colors">忘記密碼？</a>
        </div>

        <button 
          type="submit"
          :disabled="loading"
          class="w-full mt-2 px-5 py-2.5 bg-lotus-400 hover:bg-lotus-500 text-white rounded-xl shadow-sm transition-colors font-medium flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="animate-pulse">登入中...</span>
          <span v-else>登入</span>
        </button>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import auth from '../utils/auth'
import PageTitle from '@/components/common/PageTitle.vue'

const router = useRouter()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) return

  loading.value = true
  // 呼叫 API 取得資料
  const result = await auth.login(loginForm)
  // 登入失敗即返回
  if (!result) {
    loginForm.username = ''
    loginForm.password = ''
    loading.value = false
    return
  }
  
  router.push('/about')
}
</script>