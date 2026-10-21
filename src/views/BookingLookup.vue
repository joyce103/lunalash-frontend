<template>
  <div class="max-w-xl mx-auto space-y-6 font-sans">

    <PageTitle title="查詢預約結果" subtitle="輸入電話與查詢碼，查詢您的預約狀態" />

    <div class="bg-white p-6 rounded-2xl border border-lotus-100 shadow-sm space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">電話</label>
        <input
          v-model="phone"
          type="tel"
          placeholder="請輸入預約時填寫的電話"
          @blur="phoneTouched = true"
          :class="[
            'w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 text-sm',
            phoneTouched && phoneError ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-lotus-400'
          ]"
        />
        <p v-if="phoneTouched && phoneError" class="text-xs text-red-400 mt-1">{{ phoneError }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">查詢碼</label>
        <input
          v-model="queryCode"
          type="text"
          placeholder="請輸入 8 碼查詢碼"
          maxlength="16"
          @blur="codeTouched = true"
          :class="[
            'w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 text-sm uppercase',
            codeTouched && codeError ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-lotus-400'
          ]"
        />
        <p v-if="codeTouched && codeError" class="text-xs text-red-400 mt-1">{{ codeError }}</p>
      </div>

      <button
        :disabled="loading"
        @click="handleLookup"
        class="w-full px-5 py-3 bg-lotus-400 hover:bg-lotus-500 text-white rounded-xl shadow-sm transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {{ loading ? '查詢中...' : '查詢預約' }}
      </button>

      <!-- 查無資料或其他業務錯誤：api.js 的攔截器只會對「非 401 的 HTTP 錯誤」自動跳 alert，
           查無預約是用 resultCode (HTTP 200) 表示，不會被攔截器 alert 過，這裡用行內訊息顯示即可，不要再額外 alert -->
      <p v-if="errorMessage" class="text-sm text-red-400 text-center">{{ errorMessage }}</p>
    </div>

    <div v-if="result" class="bg-white p-6 rounded-2xl border border-lotus-100 shadow-sm space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-700">查詢結果</h3>
        <span :class="statusBadgeClass(result.status)">{{ statusLabel(result.status) }}</span>
      </div>
      <div class="text-sm text-gray-600 space-y-1">
        <p>操作項目：{{ result.operationItemNames?.join('、') || '-' }}</p>
        <p>日期：{{ result.date }}</p>
        <p>時段：{{ formatTime(result.startTime) }} - {{ formatTime(result.endTime) }}</p>
      </div>
      <router-link
        v-if="result.status === 'REJECTED'"
        to="/booking"
        class="inline-block mt-2 text-sm text-lotus-600 hover:text-lotus-500 underline"
      >
        前往重新預約
      </router-link>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import booking from '@/utils/booking'
import PageTitle from '@/components/common/PageTitle.vue'

const route = useRoute()

const phone = ref('')
const queryCode = ref(typeof route.query.code === 'string' ? route.query.code : '')
const phoneTouched = ref(false)
const codeTouched = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const result = ref(null)

const phoneError = computed(() => (phone.value.trim() ? '' : '請輸入電話'))
const codeError = computed(() => (queryCode.value.trim() ? '' : '請輸入查詢碼'))
const canSubmit = computed(() => !phoneError.value && !codeError.value)

const handleLookup = async () => {
  phoneTouched.value = true
  codeTouched.value = true
  if (!canSubmit.value) return

  loading.value = true
  errorMessage.value = ''
  result.value = null

  const res = await booking.lookupAppointment(phone.value.trim(), queryCode.value.trim())
  loading.value = false

  if (res.success) {
    result.value = res.data
  } else {
    errorMessage.value = res.message || '查無預約，請確認電話與查詢碼'
  }
}

const statusLabel = (status) => ({
  PENDING: '審核中',
  APPROVED: '預約成功',
  REJECTED: '預約未成功，歡迎重新預約',
}[status] || status)

const statusBadgeClass = (status) => {
  const base = 'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap '
  if (status === 'PENDING') return base + 'bg-yellow-50 text-yellow-600'
  if (status === 'APPROVED') return base + 'bg-green-50 text-green-600'
  return base + 'bg-gray-100 text-gray-500'
}

const formatTime = (t) => (t ? t.slice(0, 5) : '-')
</script>
