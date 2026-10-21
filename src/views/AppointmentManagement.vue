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
            <th class="px-4 py-3 font-medium">會員</th>
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
              <div v-if="a.memberId" class="flex items-center gap-1.5">
                <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-lotus-50 text-lotus-600 whitespace-nowrap">
                  👤 {{ a.memberName }}
                </span>
                <button @click="handleUnlinkMember(a)" class="text-xs text-gray-400 hover:text-red-500 whitespace-nowrap">
                  取消連結
                </button>
              </div>
              <select
                v-else
                @change="handleLinkMember(a, $event.target.value)"
                class="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-500 focus:outline-none focus:ring-1 focus:ring-lotus-400"
              >
                <option value="">未連結會員</option>
                <option v-for="m in members" :key="m.memberId" :value="m.memberId">
                  {{ m.name }}（{{ m.phone }}）
                </option>
              </select>
            </td>
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
              <div class="flex gap-2">
                <template v-if="a.status === 'PENDING'">
                  <button @click="handleApprove(a)"
                    class="px-3 py-1 rounded-full text-xs font-medium bg-lotus-50 text-lotus-600 border border-lotus-200 hover:bg-lotus-100">
                    同意
                  </button>
                  <button @click="handleReject(a)"
                    class="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200">
                    拒絕
                  </button>
                </template>
                <button
                  v-if="a.status === 'PENDING' || a.status === 'APPROVED'"
                  @click="openRescheduleModal(a)"
                  class="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                >
                  改期
                </button>
                <span v-if="a.status === 'REJECTED'" class="text-xs text-gray-300">-</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :isOpen="rescheduleModalOpen" title="調整預約時間" @close="closeRescheduleModal">
      <div v-if="reschedulingAppointment" class="space-y-4">
        <p class="text-sm text-gray-600">
          {{ reschedulingAppointment.customerName }} 目前預約：{{ reschedulingAppointment.date }}
          {{ formatTimeRange(reschedulingAppointment.time, reschedulingAppointment.totalDurationMinutes) }}
        </p>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">新日期</label>
          <VueDatePicker
            v-model="rescheduleDate"
            :enable-time-picker="false"
            :min-date="new Date()"
            model-type="yyyy-MM-dd"
            format="yyyy-MM-dd"
            auto-apply
            :clearable="false"
          />
        </div>

        <div v-if="rescheduleDate">
          <label class="block text-sm font-medium text-gray-700 mb-1">新時段</label>
          <div v-if="loadingRescheduleSlots" class="text-center py-4 text-lotus-400 text-sm animate-pulse">時段載入中...</div>
          <div v-else-if="rescheduleSlots.length === 0" class="text-center py-4 text-sm text-gray-400">此日期沒有可改期的時段</div>
          <div v-else class="grid grid-cols-3 sm:grid-cols-4 gap-2">
            <button
              v-for="time in rescheduleSlots"
              :key="time"
              @click="rescheduleTime = time"
              :class="[
                'px-3 py-2 rounded-lg text-sm font-medium border transition-colors',
                rescheduleTime === time ? 'bg-lotus-400 border-lotus-400 text-white' : 'bg-white border-lotus-200 text-lotus-600 hover:bg-lotus-50'
              ]"
            >
              {{ time.slice(0, 5) }}
            </button>
          </div>
        </div>

        <p v-if="rescheduleError" class="text-sm text-red-400">{{ rescheduleError }}</p>

        <div class="pt-4 flex justify-end gap-3 border-t border-lotus-100 mt-4">
          <button @click="closeRescheduleModal"
            class="px-5 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl font-medium transition-colors text-sm">
            取消
          </button>
          <button
            :disabled="!rescheduleDate || !rescheduleTime || submittingReschedule"
            @click="handleRescheduleSubmit"
            class="px-5 py-2 bg-lotus-400 hover:bg-lotus-500 disabled:bg-lotus-300 text-white rounded-xl font-medium shadow-sm transition-colors text-sm"
          >
            {{ submittingReschedule ? '送出中...' : '確認改期' }}
          </button>
        </div>
      </div>
    </BaseModal>

  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import adminBooking from '@/utils/adminBooking'
import member from '@/utils/member'
import PageTitle from '@/components/common/PageTitle.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

// 支援從外部帶 ?date=yyyy-MM-dd 進來直接篩選 (例如從儀表板月曆點某一天過來)
const initialDate = new URLSearchParams(window.location.search).get('date') || ''

const filters = ref({ name: '', phone: '', date: initialDate, status: '' })
const appointments = ref([])
const loading = ref(false)
const members = ref([]) // 給「連結會員」下拉選單用

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

const handleLinkMember = async (a, memberId) => {
  if (!memberId) return
  const result = await adminBooking.linkMember(a.appointmentId, Number(memberId))
  if (!result.success) {
    alert(result.message || '連結會員失敗，請稍後再試')
    return
  }
  await handleSearch()
}

const handleUnlinkMember = async (a) => {
  if (!confirm(`確定要取消 ${a.customerName} 這筆預約的會員連結嗎？`)) return
  const result = await adminBooking.linkMember(a.appointmentId, null)
  if (!result.success) alert(result.message || '取消連結失敗，請稍後再試')
  await handleSearch()
}

// ===== 改期 =====
const rescheduleModalOpen = ref(false)
const reschedulingAppointment = ref(null)
const rescheduleDate = ref('')
const rescheduleTime = ref('')
const rescheduleSlots = ref([])
const loadingRescheduleSlots = ref(false)
const submittingReschedule = ref(false)
const rescheduleError = ref('')

const openRescheduleModal = (a) => {
  reschedulingAppointment.value = a
  rescheduleDate.value = ''
  rescheduleTime.value = ''
  rescheduleSlots.value = []
  rescheduleError.value = ''
  rescheduleModalOpen.value = true
}

const closeRescheduleModal = () => {
  rescheduleModalOpen.value = false
  reschedulingAppointment.value = null
}

const loadRescheduleSlots = async () => {
  if (!reschedulingAppointment.value || !rescheduleDate.value) return
  loadingRescheduleSlots.value = true
  rescheduleTime.value = ''
  rescheduleSlots.value = await adminBooking.getRescheduleSlots(reschedulingAppointment.value.appointmentId, rescheduleDate.value)
  loadingRescheduleSlots.value = false
}

watch(rescheduleDate, loadRescheduleSlots)

const handleRescheduleSubmit = async () => {
  if (!reschedulingAppointment.value || !rescheduleDate.value || !rescheduleTime.value) return
  submittingReschedule.value = true
  rescheduleError.value = ''
  const result = await adminBooking.rescheduleAppointment(
    reschedulingAppointment.value.appointmentId, rescheduleDate.value, rescheduleTime.value
  )
  submittingReschedule.value = false

  if (result.success) {
    closeRescheduleModal()
    await handleSearch()
  } else {
    // 時段衝突 (409) 或其他業務錯誤：提示管理員重新選擇時段，並重新整理該日期的可用時段
    rescheduleError.value = result.message || '此時段已被其他預約占用，請重新選擇時段'
    await loadRescheduleSlots()
  }
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

onMounted(async () => {
  members.value = (await member.getAllMembers()) || []
  await handleSearch()
})
</script>
