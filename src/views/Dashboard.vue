<template>
  <div class="max-w-3xl mx-auto space-y-6 font-sans">

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

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import adminBooking from '@/utils/adminBooking'
import PageTitle from '@/components/common/PageTitle.vue'

const stats = ref(null)
const loading = ref(true)

onMounted(async () => {
  stats.value = await adminBooking.getStats()
  loading.value = false
})
</script>
