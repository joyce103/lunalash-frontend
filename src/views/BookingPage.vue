<template>
  <div class="max-w-3xl mx-auto space-y-6 font-sans">

    <PageTitle
      title="線上預約"
      subtitle="選擇服務項目、日期與時段，填寫姓名電話即可完成預約"
    />

    <!-- 送出成功後顯示確認訊息，其餘表單隱藏 -->
    <div v-if="submitted" class="bg-white p-8 rounded-2xl border border-lotus-100 shadow-sm text-center space-y-3">
      <div class="text-4xl">🌸</div>
      <p class="text-lotus-600 font-medium">
        已收到您的預約申請，待管理者確認，我們將透過 LINE 官方帳號通知您預約結果。
      </p>
      <button
        @click="resetForm"
        class="mt-2 px-5 py-2 rounded-xl bg-lotus-50 text-lotus-600 border border-lotus-200 hover:bg-lotus-100 text-sm font-medium transition-colors"
      >
        再預約一次
      </button>
    </div>

    <template v-else>
      <!-- 1. 選擇服務項目 -->
      <div class="bg-white p-6 rounded-2xl border border-lotus-100 shadow-sm space-y-4">
        <h2 class="text-lg font-semibold text-gray-700">1. 選擇服務項目</h2>
        <div v-if="services.length === 0" class="text-center py-6 text-lotus-400 text-sm">目前沒有可預約的服務項目</div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            v-for="service in services"
            :key="service.serviceItemId"
            @click="selectService(service)"
            :class="[
              'px-4 py-3 rounded-xl border text-sm font-medium text-left transition-colors',
              selectedService?.serviceItemId === service.serviceItemId
                ? 'bg-lotus-400 border-lotus-400 text-white'
                : 'bg-white border-gray-200 text-gray-700 hover:border-lotus-300'
            ]"
          >
            {{ service.name }}
          </button>
        </div>
      </div>

      <!-- 2. 選擇日期 -->
      <div class="bg-white p-6 rounded-2xl border border-lotus-100 shadow-sm space-y-4">
        <h2 class="text-lg font-semibold text-gray-700">2. 選擇日期</h2>
        <p v-if="!selectedService" class="text-xs text-lotus-400">請先選擇服務項目，才能選擇日期</p>

        <div>
          <div class="flex items-center justify-between mb-3">
            <button @click="changeMonth(-1)" class="px-3 py-1 rounded-lg text-gray-500 hover:bg-gray-100">‹</button>
            <span class="font-medium text-gray-700">{{ currentYear }} 年 {{ currentMonth }} 月</span>
            <button @click="changeMonth(1)" class="px-3 py-1 rounded-lg text-gray-500 hover:bg-gray-100">›</button>
          </div>

          <div class="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-1">
            <span v-for="d in ['日','一','二','三','四','五','六']" :key="d">{{ d }}</span>
          </div>
          <div class="grid grid-cols-7 gap-1">
            <div v-for="n in leadingBlanks" :key="'blank-' + n"></div>
            <button
              v-for="day in daysInMonth"
              :key="day.date"
              :disabled="!selectedService || !day.isOpen || day.isPast"
              @click="selectDate(day.date)"
              :class="[
                'aspect-square rounded-lg text-sm flex items-center justify-center transition-colors',
                selectedDate === day.date ? 'bg-lotus-400 text-white font-bold' :
                (selectedService && day.isOpen && !day.isPast) ? 'bg-lotus-50 text-lotus-600 hover:bg-lotus-100' : 'text-gray-300'
              ]"
            >
              {{ day.day }}
            </button>
          </div>
          <p class="text-xs text-gray-400 mt-2">藕粉色代表開放預約的日期，其餘日期尚未開放</p>
        </div>
      </div>

      <!-- 3. 選擇時段 -->
      <div class="bg-white p-6 rounded-2xl border border-lotus-100 shadow-sm space-y-4">
        <h2 class="text-lg font-semibold text-gray-700">3. 選擇時段</h2>
        <p v-if="!selectedDate" class="text-xs text-lotus-400">請先選擇日期</p>

        <div v-else-if="loadingSlots" class="text-center py-6 text-lotus-400 text-sm animate-pulse">時段載入中...</div>

        <div v-else class="grid grid-cols-3 sm:grid-cols-4 gap-2">
          <button
            v-for="slot in slots"
            :key="slot.time"
            :disabled="slot.status !== 'AVAILABLE'"
            @click="selectedTime = slot.time"
            :class="[
              'px-3 py-2 rounded-lg text-sm font-medium border transition-colors',
              selectedTime === slot.time ? 'bg-lotus-400 border-lotus-400 text-white' :
              slot.status === 'AVAILABLE' ? 'bg-white border-lotus-200 text-lotus-600 hover:bg-lotus-50' :
              slot.status === 'BOOKED' ? 'bg-red-50 border-red-100 text-red-300' :
              'bg-gray-50 border-gray-100 text-gray-300'
            ]"
          >
            {{ formatTime(slot.time) }}
          </button>
        </div>
        <div class="flex gap-4 text-xs text-gray-400">
          <span>🟢 可預約</span>
          <span>🔴 已預約</span>
          <span>⚪ 未開放</span>
        </div>
      </div>

      <!-- 4~5. 姓名電話 -->
      <div class="bg-white p-6 rounded-2xl border border-lotus-100 shadow-sm space-y-4">
        <h2 class="text-lg font-semibold text-gray-700">4. 填寫聯絡資訊</h2>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
          <input
            v-model="customerName"
            type="text"
            placeholder="請輸入姓名"
            maxlength="50"
            @blur="nameTouched = true"
            :class="[
              'w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 text-sm',
              nameTouched && nameError ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-lotus-400'
            ]"
          />
          <p v-if="nameTouched && nameError" class="text-xs text-red-400 mt-1">{{ nameError }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">電話</label>
          <input
            v-model="customerPhone"
            type="tel"
            placeholder="請輸入手機號碼"
            maxlength="20"
            @blur="phoneTouched = true"
            :class="[
              'w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 text-sm',
              phoneTouched && phoneError ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-lotus-400'
            ]"
          />
          <p v-if="phoneTouched && phoneError" class="text-xs text-red-400 mt-1">{{ phoneError }}</p>
        </div>
      </div>

      <!-- 6. 送出 -->
      <button
        :disabled="!canAttemptSubmit || submitting"
        @click="handleSubmit"
        class="w-full px-5 py-3 bg-lotus-400 hover:bg-lotus-500 text-white rounded-xl shadow-sm transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {{ submitting ? '送出中...' : '確認送出預約' }}
      </button>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import booking from '@/utils/booking'
import PageTitle from '@/components/common/PageTitle.vue'

const services = ref([])
const selectedService = ref(null)

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth() + 1)
const calendarDays = ref([]) // 後端回傳的開放日期設定
const selectedDate = ref('') // yyyy-MM-dd

const slots = ref([])
const loadingSlots = ref(false)
const selectedTime = ref('')

const customerName = ref('')
const customerPhone = ref('')
const nameTouched = ref(false)
const phoneTouched = ref(false)
const submitting = ref(false)
const submitted = ref(false)

// 電話只允許數字、+、-、空格、括號，且去掉這些符號後至少要有 8 碼數字 (涵蓋市話/手機常見格式)
const PHONE_FORMAT = /^[0-9+\-\s()]+$/

const nameError = computed(() => {
  const v = customerName.value.trim()
  if (!v) return '請輸入姓名'
  if (v.length < 2) return '姓名至少需要 2 個字'
  if (v.length > 50) return '姓名長度不能超過 50 字'
  return ''
})

const phoneError = computed(() => {
  const v = customerPhone.value.trim()
  if (!v) return '請輸入電話'
  if (!PHONE_FORMAT.test(v)) return '電話只能包含數字、+、-、空格、括號'
  const digitCount = v.replace(/\D/g, '').length
  if (digitCount < 8 || digitCount > 15) return '請輸入正確的電話號碼'
  return ''
})

// 選完服務/日期/時段就可以點送出；姓名電話的格式錯誤在送出時用行內錯誤訊息呈現，而不是讓按鈕一直無法點擊卻不說明原因
const canAttemptSubmit = computed(() =>
  selectedService.value && selectedDate.value && selectedTime.value
)

const todayStr = formatDate(today)

function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function formatTime(t) {
  return t.slice(0, 5)
}

const leadingBlanks = computed(() => new Date(currentYear.value, currentMonth.value - 1, 1).getDay())

const daysInMonth = computed(() => {
  const openMap = new Map(calendarDays.value.map((d) => [d.date, d.isOpen]))
  const total = new Date(currentYear.value, currentMonth.value, 0).getDate()
  const days = []
  for (let i = 1; i <= total; i++) {
    const dateStr = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    days.push({
      day: i,
      date: dateStr,
      isOpen: !!openMap.get(dateStr),
      isPast: dateStr < todayStr,
    })
  }
  return days
})

const loadCalendar = async () => {
  calendarDays.value = await booking.getCalendar(currentYear.value, currentMonth.value)
}

const changeMonth = (delta) => {
  let m = currentMonth.value + delta
  let y = currentYear.value
  if (m < 1) { m = 12; y -= 1 }
  if (m > 12) { m = 1; y += 1 }
  currentMonth.value = m
  currentYear.value = y
  selectedDate.value = ''
  selectedTime.value = ''
  slots.value = []
}

const selectService = (service) => {
  selectedService.value = service
}

const selectDate = async (date) => {
  selectedDate.value = date
  selectedTime.value = ''
  loadingSlots.value = true
  slots.value = await booking.getAvailableSlots(date)
  loadingSlots.value = false
}

const handleSubmit = async () => {
  if (!canAttemptSubmit.value) return

  // 送出前顯示姓名/電話的行內錯誤，格式不對就不打 API
  nameTouched.value = true
  phoneTouched.value = true
  if (nameError.value || phoneError.value) return

  submitting.value = true
  const result = await booking.createAppointment({
    serviceId: selectedService.value.serviceItemId,
    date: selectedDate.value,
    time: selectedTime.value,
    customerName: customerName.value.trim(),
    customerPhone: customerPhone.value.trim(),
  })
  submitting.value = false

  if (result.success) {
    submitted.value = true
  } else {
    alert(result.message || '預約失敗，請稍後再試')
    // 失敗有可能是時段被搶先預約，重新整理一次該日時段狀態
    if (selectedDate.value) await selectDate(selectedDate.value)
  }
}

const resetForm = () => {
  submitted.value = false
  selectedService.value = null
  selectedDate.value = ''
  selectedTime.value = ''
  slots.value = []
  customerName.value = ''
  customerPhone.value = ''
  nameTouched.value = false
  phoneTouched.value = false
}

watch([currentYear, currentMonth], loadCalendar)

onMounted(async () => {
  services.value = await booking.getServices()
  await loadCalendar()
})
</script>
