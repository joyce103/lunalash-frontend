<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-lotus-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
    
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-xl font-bold text-gray-700 flex items-center gap-2">
          {{ formatTime(transaction.transactionTime) }}
        </h3>
        
        <div class="text-m text-lotus-500 mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
          <p class="font-mono">單號 #{{ transaction.transactionId }}</p>
          <p class="flex items-center gap-1">
            美睫師：{{ transaction.lashArtist }}
          </p>
        </div>
      </div>
      
      <div class="flex flex-col items-end gap-2 shrink-0">
        <span class="bg-lotus-50 text-lotus-600 px-3.5 py-1.5 rounded-full text-s font-semibold tracking-wide border border-lotus-200">
          {{ transaction.paymentMethod }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-4 bg-lotus-50/40 p-4 rounded-xl border border-lotus-100/60">
      <div class="space-y-3">
        <div>
          <span class="text-sm text-lotus-400 block mb-0.5">原價</span>
          <span class="text-lg font-medium line-through text-gray-400">${{ transaction.amountBeforeDiscount }}</span>
        </div>
      </div>

      <div class="flex flex-col justify-end items-end border-l border-lotus-100/50 pl-4">
        <span class="text-sm text-lotus-400 mb-1">實付金額</span>
        <span class="text-3xl font-bold text-red-400 tracking-tight">
          ${{ transaction.amountAfterDiscount }}
        </span>
      </div>
    </div>

    <div class="flex gap-3 justify-between items-center mt-2">
      <div v-if="transaction.remark" class="flex-1 text-sm text-gray-500 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
        <p class="leading-relaxed">備註：{{ transaction.remark }}</p>
      </div>

      <button 
        @click="handleDelete" 
        class="shrink-0 text-s text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
        title="刪除此筆交易"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        刪除
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete'])

// 刪除點擊的邏輯
const handleDelete = () => {
  if (confirm(`確定要刪除單號 #${props.transaction.transactionId} 的交易紀錄嗎？`)) {
    // 點擊確認後，將 transactionId emit給父組件
    emit('delete', props.transaction.transactionId)
  }
}

// 處理折扣率的小工具：把 0.9 變成 9，把 0.85 變成 8.5
const formatDiscount = (rate) => {
  if (!rate) return ''
  return Number((rate * 10).toFixed(1)) 
}

// 處理時間格式化的小工具：把 "2026-02-11T22:30:00" 變成 "2026/02/11 22:30"
const formatTime = (timeString) => {
  if (!timeString) return '無時間紀錄'
  
  const date = new Date(timeString)
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  
  return `${yyyy}/${mm}/${dd} ${hh}:${min}`
}
</script>