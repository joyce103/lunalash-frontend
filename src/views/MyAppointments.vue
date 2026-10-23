<template>
  <div class="max-w-xl mx-auto space-y-6 font-sans">

    <PageTitle title="我的預約" :subtitle="`已用 Google 帳號登入：${guestName}`" />

    <div v-if="loading" class="text-center py-10 text-lotus-400 text-sm animate-pulse">載入中...</div>

    <div v-else-if="appointments.length === 0" class="bg-white p-8 rounded-2xl border border-lotus-100 shadow-sm text-center space-y-3">
      <p class="text-gray-500 text-sm">目前沒有任何用這個 Google 帳號建立的預約</p>
      <router-link to="/booking" class="inline-block text-sm text-lotus-600 hover:text-lotus-500 underline">
        前往線上預約
      </router-link>
    </div>

    <div
      v-else
      v-for="item in appointments"
      :key="item.queryCode"
      class="bg-white p-6 rounded-2xl border border-lotus-100 shadow-sm space-y-3"
    >
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold text-gray-700">{{ item.date }}</h3>
        <span :class="statusBadgeClass(item.status)">{{ statusLabel(item.status) }}</span>
      </div>
      <div class="text-sm text-gray-600 space-y-1">
        <p>操作項目：{{ item.operationItemNames?.join('、') || '-' }}</p>
        <p>時段：{{ formatTime(item.startTime) }} - {{ formatTime(item.endTime) }}</p>
      </div>
    </div>

    <button
      @click="handleLogout"
      class="w-full px-5 py-3 bg-lotus-50 text-lotus-600 border border-lotus-200 hover:bg-lotus-100 rounded-xl text-sm font-medium transition-colors"
    >
      登出
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import guestAuth from '@/utils/guestAuth'
import { guestName } from '@/stores/guestAuthState'
import PageTitle from '@/components/common/PageTitle.vue'

const router = useRouter()
const appointments = ref([])
const loading = ref(true)

onMounted(async () => {
  appointments.value = await guestAuth.fetchMyAppointments()
  loading.value = false
})

const handleLogout = () => {
  guestAuth.logout()
  router.push('/booking')
}

const statusLabel = (status) => ({
  PENDING: '審核中',
  APPROVED: '預約成功',
  REJECTED: '預約未成功',
}[status] || status)

const statusBadgeClass = (status) => {
  const base = 'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap '
  if (status === 'PENDING') return base + 'bg-yellow-50 text-yellow-600'
  if (status === 'APPROVED') return base + 'bg-green-50 text-green-600'
  return base + 'bg-gray-100 text-gray-500'
}

const formatTime = (t) => (t ? t.slice(0, 5) : '-')
</script>
