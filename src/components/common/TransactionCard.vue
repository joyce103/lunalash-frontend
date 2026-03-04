<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-lotus-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
    
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-xl font-bold text-gray-700 flex items-center gap-2">
          {{ formatTime(transaction.transactionTime) }}
        </h3>
        
        <div class="text-sm text-lotus-500 mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
          <p class="font-mono">單號 #{{ transaction.transactionId }}</p>
          <p class="flex items-center gap-1">
            美睫師：{{ transaction.lashArtist }}
          </p>
        </div>
      </div>
      
      <span class="bg-lotus-50 text-lotus-600 px-3.5 py-1.5 rounded-full text-sm font-semibold tracking-wide border border-lotus-200 shrink-0">
        {{ transaction.paymentMethod }}
      </span>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-4 bg-lotus-50/40 p-4 rounded-xl border border-lotus-100/60">
      
      <div class="space-y-3">
        <div>
          <span class="text-sm text-lotus-400 block mb-0.5">原價</span>
          <span class="text-lg font-medium line-through text-gray-400">${{ transaction.amountBeforeDiscount }}</span>
        </div>
        
        <div v-if="transaction.discountType">
          <span class="text-sm text-lotus-400 block mb-1">折扣活動</span>
          <div class="flex items-center gap-2">
            <span class="bg-lotus-200 text-lotus-700 text-xs px-2 py-1 rounded-md font-medium">
              {{ transaction.discountType }}
            </span>
            <span class="text-lotus-500 text-sm font-bold">({{ formatDiscount(transaction.discountRate) }} 折)</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col justify-end items-end border-l border-lotus-100/50 pl-4">
        <span class="text-sm text-lotus-400 mb-1">實付金額</span>
        <span class="text-3xl font-bold text-red-400 tracking-tight">
          ${{ transaction.amountAfterDiscount }}
        </span>
      </div>

    </div>

    <div v-if="transaction.remark" class="text-sm text-gray-500 bg-gray-50 px-4 py-3 rounded-xl flex gap-2 items-start border border-gray-100 mt-2">
      <p class="leading-relaxed">備註：{{ transaction.remark }}</p>
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