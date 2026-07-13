<template>
  <div class="max-w-3xl mx-auto space-y-6 font-sans">

    <PageTitle title="預約時段管理" subtitle="設定哪些日期開放預約，以及每天哪些時段可預約" />

    <!-- 一鍵開放本月 -->
    <div class="bg-white p-6 rounded-2xl border border-lotus-100 shadow-sm space-y-3">
      <h2 class="text-lg font-semibold text-gray-700">快速設定</h2>
      <p class="text-xs text-gray-400">
        把「今天」到「本月月底」的每一天都開放，並把每天固定的 11 個時段（10:00~20:00）全部設為開放，
        之後仍可以到下面的清單針對個別日期關閉或調整時段。
      </p>
      <button
        @click="handleOpenWholeMonth"
        :disabled="openingMonth"
        class="px-5 py-2.5 bg-lotus-400 hover:bg-lotus-500 text-white rounded-xl shadow-sm transition-colors font-medium text-sm disabled:opacity-50"
      >
        {{ openingMonth ? `開放中... (${monthProgress})` : '一鍵開放本月剩餘日期與所有時段' }}
      </button>
    </div>

    <!-- 新增可預約日期 -->
    <div class="bg-white p-6 rounded-2xl border border-lotus-100 shadow-sm space-y-4">
      <h2 class="text-lg font-semibold text-gray-700">新增可預約日期</h2>
      <form @submit.prevent="handleAddDate" class="flex gap-3 items-end">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">日期</label>
          <input v-model="newDate" type="date" required
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lotus-400 text-sm" />
        </div>
        <button type="submit"
          class="px-5 py-2.5 bg-lotus-400 hover:bg-lotus-500 text-white rounded-xl shadow-sm transition-colors font-medium text-sm">
          新增日期
        </button>
      </form>
    </div>

    <!-- 日期清單 -->
    <div class="bg-white p-6 rounded-2xl border border-lotus-100 shadow-sm space-y-4">
      <h2 class="text-lg font-semibold text-gray-700">已設定的日期</h2>

      <div v-if="dates.length === 0" class="text-center py-8 text-lotus-400 text-sm">尚未設定任何日期</div>

      <div v-else class="divide-y divide-lotus-100">
        <div v-for="d in dates" :key="d.availableDateId" class="flex items-center justify-between py-3 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-700">
              {{ d.date }}
              <span :class="d.isOpen ? 'text-green-500' : 'text-gray-400'" class="ml-2 text-xs">
                {{ d.isOpen ? '開放中' : '已關閉' }}
              </span>
            </p>
          </div>
          <div class="flex gap-2 shrink-0">
            <button @click="editSlots(d.date)"
              class="px-4 py-1.5 rounded-full text-sm font-medium bg-lotus-50 text-lotus-600 border border-lotus-200 hover:bg-lotus-100">
              編輯時段
            </button>
            <button @click="toggleOpen(d)"
              class="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200">
              {{ d.isOpen ? '關閉此日' : '開放此日' }}
            </button>
            <button @click="handleDeleteDate(d)"
              class="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200">
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 編輯時段 -->
    <div v-if="editingDate" class="bg-white p-6 rounded-2xl border border-lotus-100 shadow-sm space-y-4">
      <h2 class="text-lg font-semibold text-gray-700">編輯 {{ editingDate }} 的開放時段</h2>

      <div v-if="loadingSlots" class="text-center py-6 text-lotus-400 text-sm animate-pulse">載入中...</div>

      <div v-else class="grid grid-cols-3 sm:grid-cols-4 gap-3">
        <label
          v-for="slot in slotConfig"
          :key="slot.time"
          :class="[
            'flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors',
            slot.isOpen ? 'bg-lotus-50 border-lotus-300 text-lotus-600' : 'bg-white border-gray-200 text-gray-500'
          ]"
        >
          <input type="checkbox" v-model="slot.isOpen" class="rounded border-gray-300 text-lotus-500" />
          {{ slot.time.slice(0, 5) }}
        </label>
      </div>

      <div class="flex gap-3">
        <button @click="handleSaveSlots" :disabled="savingSlots"
          class="px-5 py-2.5 bg-lotus-400 hover:bg-lotus-500 text-white rounded-xl shadow-sm transition-colors font-medium text-sm disabled:opacity-50">
          {{ savingSlots ? '儲存中...' : '儲存時段設定' }}
        </button>
        <button @click="editingDate = ''" class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-medium">
          關閉
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import adminBooking from '@/utils/adminBooking'
import PageTitle from '@/components/common/PageTitle.vue'

const dates = ref([])
const loadDates = async () => {
  dates.value = await adminBooking.getAllDates()
}

// 固定的 11 個時段 (10:00~20:00)，要跟後端 AvailableSlotService.FIXED_SLOT_TIMES 保持一致
const ALL_SLOT_TIMES = Array.from({ length: 11 }, (_, i) => `${String(i + 10).padStart(2, '0')}:00:00`)

const openingMonth = ref(false)
const monthProgress = ref('')

const handleOpenWholeMonth = async () => {
  if (!confirm('確定要把今天到本月月底的每一天都開放，並開放所有時段嗎？')) return

  openingMonth.value = true
  const today = new Date()
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const toDateStr = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  const targetDates = []
  for (let day = today.getDate(); day <= lastDay; day++) {
    targetDates.push(toDateStr(new Date(today.getFullYear(), today.getMonth(), day)))
  }

  for (let i = 0; i < targetDates.length; i++) {
    monthProgress.value = `${i + 1}/${targetDates.length}`
    await adminBooking.addDate(targetDates[i])
    await adminBooking.setSlots(targetDates[i], ALL_SLOT_TIMES)
  }

  openingMonth.value = false
  monthProgress.value = ''
  alert(`已開放 ${targetDates.length} 天，每天 11 個時段全部開放`)
  await loadDates()
}

const newDate = ref('')
const handleAddDate = async () => {
  if (!newDate.value) return
  const result = await adminBooking.addDate(newDate.value)
  if (!result.success) {
    alert(result.message || '新增失敗，請稍後再試')
    return
  }
  newDate.value = ''
  await loadDates()
}

const toggleOpen = async (d) => {
  if (d.isOpen) {
    await adminBooking.closeDate(d.availableDateId)
  } else {
    await adminBooking.openDate(d.availableDateId)
  }
  await loadDates()
}

const handleDeleteDate = async (d) => {
  if (!confirm(`確定要刪除 ${d.date} 的日期設定嗎？這天所有時段設定也會一併刪除。`)) return
  const result = await adminBooking.deleteDate(d.availableDateId)
  if (!result.success) {
    alert(result.message || '刪除失敗，請稍後再試')
    return
  }
  if (editingDate.value === d.date) editingDate.value = ''
  await loadDates()
}

// 編輯某天的時段
const editingDate = ref('')
const slotConfig = ref([])
const loadingSlots = ref(false)
const savingSlots = ref(false)

const editSlots = async (date) => {
  editingDate.value = date
  loadingSlots.value = true
  slotConfig.value = await adminBooking.getSlotConfig(date)
  loadingSlots.value = false
}

const handleSaveSlots = async () => {
  savingSlots.value = true
  const openTimes = slotConfig.value.filter((s) => s.isOpen).map((s) => s.time)
  const result = await adminBooking.setSlots(editingDate.value, openTimes)
  savingSlots.value = false

  if (!result.success) {
    alert(result.message || '設定失敗，請稍後再試')
    return
  }
  alert('時段設定已儲存')
  await loadDates()
}

onMounted(loadDates)
</script>
