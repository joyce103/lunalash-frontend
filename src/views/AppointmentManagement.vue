<template>
  <div class="max-w-5xl mx-auto space-y-6 font-sans">

    <PageTitle title="預約管理" subtitle="搜尋、審核所有預約申請" />

    <!-- 搜尋條件 -->
    <div class="bg-white p-6 rounded-2xl border border-lotus-100 shadow-sm">
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input v-model="filters.name" type="text" placeholder="姓名"
          class="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lotus-400" />
        <input v-model="filters.phone" type="text" placeholder="電話"
          class="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lotus-400" />
        <input v-model="filters.date" type="date"
          class="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lotus-400" />
        <select v-model="filters.status"
          class="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lotus-400">
          <option value="">全部狀態</option>
          <option value="PENDING">待審核</option>
          <option value="APPROVED">已核准</option>
          <option value="REJECTED">已拒絕</option>
        </select>
      </div>
      <div class="flex gap-3 mt-4">
        <button @click="handleSearch"
          class="px-5 py-2 bg-lotus-400 hover:bg-lotus-500 text-white rounded-xl text-sm font-medium transition-colors">
          搜尋
        </button>
        <button @click="resetFilters"
          class="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-medium transition-colors">
          清除條件
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center text-lotus-400 py-8 animate-pulse">資料載入中，請稍候...</div>

    <div v-else-if="appointments.length === 0" class="text-center py-12 bg-white rounded-2xl border border-lotus-100 border-dashed">
      <p class="text-lotus-400">查無符合條件的預約資料。</p>
    </div>

    <div v-else class="bg-white rounded-2xl border border-lotus-100 shadow-sm overflow-x-auto">
      <table class="w-full text-left text-sm whitespace-nowrap">
        <thead class="bg-lotus-50/50 text-lotus-700">
          <tr>
            <th class="px-4 py-3 font-medium">姓名</th>
            <th class="px-4 py-3 font-medium">電話</th>
            <th class="px-4 py-3 font-medium">操作項目</th>
            <th class="px-4 py-3 font-medium">日期</th>
            <th class="px-4 py-3 font-medium">時間</th>
            <th class="px-4 py-3 font-medium">建立時間</th>
            <th class="px-4 py-3 font-medium">狀態</th>
            <th class="px-4 py-3 font-medium">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-lotus-50">
          <tr v-for="a in appointments" :key="a.appointmentId" class="hover:bg-lotus-50/30">
            <td class="px-4 py-3">{{ a.customerName }}</td>
            <td class="px-4 py-3">{{ a.customerPhone }}</td>
            <td class="px-4 py-3">
              <div>{{ a.operationItems?.map(i => i.name).join('、') }}</div>
              <div class="text-xs text-gray-400">共 {{ a.totalDurationMinutes }} 分鐘</div>
            </td>
            <td class="px-4 py-3">{{ a.date }}</td>
            <td class="px-4 py-3">{{ formatTimeRange(a.time, a.totalDurationMinutes) }}</td>
            <td class="px-4 py-3 text-gray-400">{{ formatDateTime(a.createdAt) }}</td>
            <td class="px-4 py-3">
              <span :class="statusBadgeClass(a.status)">{{ statusLabel(a.status) }}</span>
            </td>
            <td class="px-4 py-3">
              <div v-if="a.status === 'PENDING'" class="flex gap-2">
                <button @click="handleApprove(a)"
                  class="px-3 py-1 rounded-full text-xs font-medium bg-lotus-50 text-lotus-600 border border-lotus-200 hover:bg-lotus-100">
                  同意
                </button>
                <button @click="handleReject(a)"
                  class="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200">
                  拒絕
                </button>
              </div>
              <span v-else class="text-xs text-gray-300">-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import adminBooking from '@/utils/adminBooking'
import PageTitle from '@/components/common/PageTitle.vue'

const filters = ref({ name: '', phone: '', date: '', status: '' })
const appointments = ref([])
const loading = ref(false)

const buildParams = () => {
  const params = {}
  if (filters.value.name) params.name = filters.value.name
  if (filters.value.phone) params.phone = filters.value.phone
  if (filters.value.date) params.date = filters.value.date
  if (filters.value.status) params.status = filters.value.status
  return params
}

const handleSearch = async () => {
  loading.value = true
  appointments.value = await adminBooking.searchAppointments(buildParams())
  loading.value = false
}

const resetFilters = async () => {
  filters.value = { name: '', phone: '', date: '', status: '' }
  await handleSearch()
}

const handleApprove = async (a) => {
  if (!confirm(`確定要核准 ${a.customerName} 的預約嗎？`)) return
  const result = await adminBooking.approveAppointment(a.appointmentId)
  if (!result.success) {
    // 若同一時段已被其他預約搶先核准，後端會回傳明確的衝突訊息
    alert(result.message || '此時段已被其他預約占用。')
  }
  await handleSearch()
}

const handleReject = async (a) => {
  if (!confirm(`確定要拒絕 ${a.customerName} 的預約嗎？`)) return
  const result = await adminBooking.rejectAppointment(a.appointmentId)
  if (!result.success) alert(result.message)
  await handleSearch()
}

const statusLabel = (status) => ({ PENDING: '待審核', APPROVED: '已核准', REJECTED: '已拒絕' })[status] || status
const statusBadgeClass = (status) => {
  const base = 'px-2 py-0.5 rounded-full text-xs font-medium '
  if (status === 'PENDING') return base + 'bg-yellow-50 text-yellow-600'
  if (status === 'APPROVED') return base + 'bg-green-50 text-green-600'
  return base + 'bg-gray-100 text-gray-500'
}
const formatDateTime = (value) => {
  if (!value) return '-'
  const d = new Date(value)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// 現在一筆預約可能因為操作項目時間加總橫跨好幾個固定時段，這裡顯示開始~結束時間比較清楚
const formatTimeRange = (time, totalDurationMinutes) => {
  if (!time) return '-'
  const [h, m] = time.split(':').map(Number)
  const start = new Date(2000, 0, 1, h, m)
  const end = new Date(start.getTime() + (totalDurationMinutes || 0) * 60000)
  const fmt = (d) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  return `${fmt(start)}-${fmt(end)}`
}

onMounted(handleSearch)
</script>
