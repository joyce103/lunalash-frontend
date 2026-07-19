<template>
  <div class="max-w-5xl mx-auto space-y-6 font-sans">

    <PageTitle title="儀表板" subtitle="預約系統總覽" />

    <div v-if="loading" class="text-center text-lotus-400 py-8 animate-pulse">資料載入中，請稍候...</div>

    <div v-else-if="!stats" class="text-center py-12 bg-white rounded-2xl border border-lotus-100 border-dashed">
      <p class="text-lotus-400">資料載入失敗，請重新整理頁面。</p>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-lotus-100 shadow-sm text-center space-y-1">
        <p class="text-xs text-gray-400">今日預約數</p>
        <p class="text-3xl font-bold text-lotus-600">{{ stats.todayCount }}</p>
      </div>
      <div class="bg-white p-5 rounded-2xl border border-lotus-100 shadow-sm text-center space-y-1">
        <p class="text-xs text-gray-400">待審核</p>
        <p class="text-3xl font-bold text-yellow-500">{{ stats.pendingCount }}</p>
      </div>
      <div class="bg-white p-5 rounded-2xl border border-lotus-100 shadow-sm text-center space-y-1">
        <p class="text-xs text-gray-400">本月預約數</p>
        <p class="text-3xl font-bold text-lotus-600">{{ stats.monthCount }}</p>
      </div>
      <div class="bg-white p-5 rounded-2xl border border-lotus-100 shadow-sm text-center space-y-1">
        <p class="text-xs text-gray-400">已核准數</p>
        <p class="text-3xl font-bold text-green-500">{{ stats.approvedCount }}</p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-2xl border border-lotus-100 shadow-sm">
      <p class="text-sm text-gray-500">
        有 <span class="font-bold text-yellow-500">{{ stats?.pendingCount ?? 0 }}</span> 筆預約正在等待審核，
        前往
        <router-link to="/appointments" class="text-lotus-500 underline hover:text-lotus-600">預約管理</router-link>
        頁面查看並處理。
      </p>
    </div>

    <!-- 月曆總覽：每個日期標注是誰預約，點日期或項目可以直接跳到預約管理查看/處理 -->
    <div class="bg-white p-6 rounded-2xl border border-lotus-100 shadow-sm space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-700">預約月曆</h2>
        <div class="flex items-center gap-2">
          <button @click="changeMonth(-1)" class="px-3 py-1 rounded-lg text-gray-500 hover:bg-gray-100">‹</button>
          <span class="font-medium text-gray-700 w-24 text-center">{{ currentYear }} 年 {{ currentMonth }} 月</span>
          <button @click="changeMonth(1)" class="px-3 py-1 rounded-lg text-gray-500 hover:bg-gray-100">›</button>
        </div>
      </div>

      <div class="flex gap-4 text-xs text-gray-400">
        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-yellow-400"></span>待審核</span>
        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-500"></span>已核准</span>
        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-gray-300"></span>已拒絕</span>
      </div>

      <div v-if="loadingCalendar" class="text-center py-8 text-lotus-400 text-sm animate-pulse">月曆載入中...</div>

      <div v-else>
        <div class="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-1">
          <span v-for="d in ['日','一','二','三','四','五','六']" :key="d">{{ d }}</span>
        </div>
        <div class="grid grid-cols-7 gap-1">
          <div v-for="n in leadingBlanks" :key="'blank-' + n" class="min-h-[6.5rem] sm:min-h-[7.5rem]"></div>
          <div
            v-for="day in daysInMonth"
            :key="day.date"
            @click="goToAppointments(day.date)"
            :class="[
              'min-h-[6.5rem] sm:min-h-[7.5rem] rounded-lg border p-1 text-left cursor-pointer transition-colors overflow-hidden',
              day.isToday ? 'border-lotus-300 bg-lotus-50/40' : 'border-gray-100 hover:border-lotus-200 hover:bg-lotus-50/20'
            ]"
          >
            <p :class="['text-xs font-medium mb-1', day.isToday ? 'text-lotus-600' : 'text-gray-500']">{{ day.day }}</p>
            <div class="space-y-0.5">
              <div
                v-for="a in day.items.slice(0, 3)"
                :key="a.appointmentId"
                :class="['px-1.5 py-0.5 rounded text-[11px] truncate', statusChipClass(a.status)]"
                :title="`${a.time?.slice(0,5)} ${a.customerName}（${statusLabel(a.status)}）`"
              >
                {{ a.time?.slice(0, 5) }} {{ a.customerName }}
              </div>
              <div v-if="day.items.length > 3" class="text-[11px] text-gray-400 px-1.5">
                +{{ day.items.length - 3 }} 筆
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import adminBooking from '@/utils/adminBooking'
import PageTitle from '@/components/common/PageTitle.vue'

const router = useRouter()

const stats = ref(null)
const loading = ref(true)

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth() + 1)
const monthAppointments = ref([])
const loadingCalendar = ref(false)

const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

const leadingBlanks = computed(() => new Date(currentYear.value, currentMonth.value - 1, 1).getDay())

const daysInMonth = computed(() => {
  const byDate = new Map()
  for (const a of monthAppointments.value) {
    if (!byDate.has(a.date)) byDate.set(a.date, [])
    byDate.get(a.date).push(a)
  }

  const total = new Date(currentYear.value, currentMonth.value, 0).getDate()
  const days = []
  for (let i = 1; i <= total; i++) {
    const dateStr = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    days.push({
      day: i,
      date: dateStr,
      isToday: dateStr === todayStr,
      items: byDate.get(dateStr) || [],
    })
  }
  return days
})

const loadCalendar = async () => {
  loadingCalendar.value = true
  monthAppointments.value = await adminBooking.getMonthAppointments(currentYear.value, currentMonth.value)
  loadingCalendar.value = false
}

const changeMonth = (delta) => {
  let m = currentMonth.value + delta
  let y = currentYear.value
  if (m < 1) { m = 12; y -= 1 }
  if (m > 12) { m = 1; y += 1 }
  currentMonth.value = m
  currentYear.value = y
}

const goToAppointments = (date) => {
  router.push({ path: '/appointments', query: { date } })
}

const statusLabel = (status) => ({ PENDING: '待審核', APPROVED: '已核准', REJECTED: '已拒絕' })[status] || status
const statusChipClass = (status) => {
  if (status === 'PENDING') return 'bg-yellow-50 text-yellow-600'
  if (status === 'APPROVED') return 'bg-green-50 text-green-600'
  return 'bg-gray-100 text-gray-400'
}

watch([currentYear, currentMonth], loadCalendar)

onMounted(async () => {
  stats.value = await adminBooking.getStats()
  loading.value = false
  await loadCalendar()
})
</script>
