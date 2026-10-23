<template>
  <div class="max-w-3xl mx-auto space-y-6 font-sans">

    <PageTitle
      title="線上預約"
      subtitle="選擇操作項目、日期與時段，填寫姓名電話即可完成預約"
    />

    <!-- Google 登入：純粹是選項，不登入一樣可以用姓名+電話+查詢碼完成預約 -->
    <div v-if="!submitted" class="bg-white p-4 rounded-2xl border border-lotus-100 shadow-sm flex items-center justify-between gap-3 flex-wrap">
      <template v-if="isGuestLoggedIn">
        <p class="text-sm text-gray-600">您好，{{ guestName }}，已用 Google 帳號登入</p>
        <router-link to="/booking/my" class="text-sm text-lotus-600 hover:text-lotus-500 underline whitespace-nowrap">
          查看我的預約
        </router-link>
      </template>
      <template v-else>
        <p class="text-xs text-gray-400">登入後可用 Google 帳號查詢預約，不用記查詢碼（也可以跳過，直接用下方表單預約）</p>
        <div ref="googleButtonEl"></div>
      </template>
    </div>

    <!-- 送出成功後顯示確認訊息，其餘表單隱藏 -->
    <div v-if="submitted" class="bg-white p-8 rounded-2xl border border-lotus-100 shadow-sm text-center space-y-4">
      <div class="text-4xl">🌸</div>
      <p class="text-lotus-600 font-medium">
        已收到您的預約申請，待店家確認後即可使用電話與查詢碼查詢結果。
      </p>

      <div class="bg-lotus-50 border border-lotus-200 rounded-xl p-4 space-y-2">
        <p class="text-xs text-gray-500">您的查詢碼</p>
        <div class="flex items-center justify-center gap-2">
          <span class="text-2xl font-bold tracking-widest text-lotus-600">{{ submittedQueryCode }}</span>
          <button
            @click="copyQueryCode"
            class="px-3 py-1 rounded-lg text-xs font-medium bg-white border border-lotus-200 text-lotus-600 hover:bg-lotus-100 transition-colors"
          >
            {{ copied ? '已複製' : '複製' }}
          </button>
        </div>
        <p class="text-xs text-red-400">請截圖或記下查詢碼，之後要用電話+查詢碼查詢預約結果</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <router-link
          :to="`/booking/lookup?code=${submittedQueryCode}`"
          class="px-5 py-2 rounded-xl bg-lotus-400 hover:bg-lotus-500 text-white text-sm font-medium transition-colors"
        >
          前往查詢預約結果
        </router-link>
        <button
          @click="resetForm"
          class="px-5 py-2 rounded-xl bg-lotus-50 text-lotus-600 border border-lotus-200 hover:bg-lotus-100 text-sm font-medium transition-colors"
        >
          再預約一次
        </button>
      </div>
    </div>

    <template v-else>
      <!-- 1. 選擇操作項目 (可複選) -->
      <div class="bg-white p-6 rounded-2xl border border-lotus-100 shadow-sm space-y-4">
        <h2 class="text-lg font-semibold text-gray-700">1. 選擇操作項目（可複選）</h2>
        <div v-if="operationItems.length === 0" class="text-center py-6 text-lotus-400 text-sm">目前沒有可預約的操作項目</div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            v-for="item in operationItems"
            :key="item.operationCatalogItemId"
            @click="toggleItem(item)"
            :class="[
              'px-4 py-3 rounded-xl border text-sm font-medium text-left transition-colors flex justify-between items-center gap-2',
              selectedItemIds.has(item.operationCatalogItemId)
                ? 'bg-lotus-400 border-lotus-400 text-white'
                : 'bg-white border-gray-200 text-gray-700 hover:border-lotus-300'
            ]"
          >
            <span>{{ item.name }}</span>
            <span class="text-xs opacity-80 whitespace-nowrap">{{ item.durationMinutes }} 分鐘</span>
          </button>
        </div>
        <p v-if="selectedItemIds.size > 0" class="text-xs text-lotus-500">
          已選擇 {{ selectedItemIds.size }} 項，共 {{ totalDurationMinutes }} 分鐘（將占用 {{ occupiedSlotCount }} 個時段）
        </p>
      </div>

      <!-- 2. 選擇日期 -->
      <div class="bg-white p-6 rounded-2xl border border-lotus-100 shadow-sm space-y-4">
        <h2 class="text-lg font-semibold text-gray-700">2. 選擇日期</h2>
        <p v-if="selectedItemIds.size === 0" class="text-xs text-lotus-400">請先選擇操作項目，才能選擇日期</p>

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
              :disabled="selectedItemIds.size === 0 || !day.isOpen || day.isPast"
              @click="selectDate(day.date)"
              :class="[
                'aspect-square rounded-lg text-sm flex items-center justify-center transition-colors',
                selectedDate === day.date ? 'bg-lotus-400 text-white font-bold' :
                (selectedItemIds.size > 0 && day.isOpen && !day.isPast) ? 'bg-lotus-50 text-lotus-600 hover:bg-lotus-100' : 'text-gray-300'
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
import guestAuth from '@/utils/guestAuth'
import { isGuestLoggedIn, guestName } from '@/stores/guestAuthState'
import PageTitle from '@/components/common/PageTitle.vue'

const googleButtonEl = ref(null)

const operationItems = ref([])
const selectedItemIds = ref(new Set())

const totalDurationMinutes = computed(() => {
  return operationItems.value
    .filter((item) => selectedItemIds.value.has(item.operationCatalogItemId))
    .reduce((sum, item) => sum + item.durationMinutes, 0)
})
// 固定時段是每小時一個，時間加總無條件進位換算成要占用幾個時段，要跟後端 AvailableSlotService 的邏輯保持一致
const occupiedSlotCount = computed(() => Math.ceil(totalDurationMinutes.value / 60))

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
const submittedQueryCode = ref('')
const copied = ref(false)

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

// 選完操作項目/日期/時段就可以點送出；姓名電話的格式錯誤在送出時用行內錯誤訊息呈現，而不是讓按鈕一直無法點擊卻不說明原因
const canAttemptSubmit = computed(() =>
  selectedItemIds.value.size > 0 && selectedDate.value && selectedTime.value
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

const toggleItem = (item) => {
  const next = new Set(selectedItemIds.value)
  if (next.has(item.operationCatalogItemId)) {
    next.delete(item.operationCatalogItemId)
  } else {
    next.add(item.operationCatalogItemId)
  }
  selectedItemIds.value = next
  // 選擇的項目變了，時間加總也會變，已經選過的日期要重新查一次時段狀態
  if (selectedDate.value) selectDate(selectedDate.value)
}

const loadSlots = async () => {
  if (!selectedDate.value || selectedItemIds.value.size === 0) return
  loadingSlots.value = true
  slots.value = await booking.getAvailableSlots(selectedDate.value, [...selectedItemIds.value])
  loadingSlots.value = false
}

const selectDate = async (date) => {
  selectedDate.value = date
  selectedTime.value = ''
  await loadSlots()
}

const handleSubmit = async () => {
  if (!canAttemptSubmit.value) return

  // 送出前顯示姓名/電話的行內錯誤，格式不對就不打 API
  nameTouched.value = true
  phoneTouched.value = true
  if (nameError.value || phoneError.value) return

  submitting.value = true
  const result = await booking.createAppointment({
    operationItemIds: [...selectedItemIds.value],
    date: selectedDate.value,
    time: selectedTime.value,
    customerName: customerName.value.trim(),
    customerPhone: customerPhone.value.trim(),
  })
  submitting.value = false

  if (result.success) {
    submittedQueryCode.value = result.data?.queryCode || ''
    submitted.value = true
  } else {
    alert(result.message || '預約失敗，請稍後再試')
    // 失敗有可能是時段被搶先預約，重新整理一次該日時段狀態
    if (selectedDate.value) await selectDate(selectedDate.value)
  }
}

const copyQueryCode = async () => {
  try {
    await navigator.clipboard.writeText(submittedQueryCode.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (error) {
    console.error(error)
  }
}

const resetForm = () => {
  submitted.value = false
  submittedQueryCode.value = ''
  copied.value = false
  selectedItemIds.value = new Set()
  selectedDate.value = ''
  selectedTime.value = ''
  slots.value = []
  customerName.value = ''
  customerPhone.value = ''
  nameTouched.value = false
  phoneTouched.value = false
}

watch([currentYear, currentMonth], loadCalendar)

// Google Sign-In 的官方 script 是在 index.html 用 <script async defer> 載入的全域變數
// window.google，不是 npm 套件；因為是 async，掛載時機不保證跑在這個 component mount 之前，
// 所以用短暫重試而不是假設它一定已經存在。credential 是 Google 簽過的 ID Token，
// 直接丟給後端驗證換站內 JWT，前端不解析也不信任它的內容
const initGoogleSignIn = (retriesLeft = 20) => {
  if (!googleButtonEl.value) return
  if (!window.google) {
    if (retriesLeft > 0) setTimeout(() => initGoogleSignIn(retriesLeft - 1), 200)
    return
  }
  window.google.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: async (response) => {
      await guestAuth.loginWithGoogle(response.credential)
    },
  })
  window.google.accounts.id.renderButton(googleButtonEl.value, { theme: 'outline', size: 'medium' })
}

onMounted(async () => {
  operationItems.value = await booking.getOperationCatalogItems()
  await loadCalendar()
  initGoogleSignIn()
})
</script>
