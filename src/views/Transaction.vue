<template>
  <div class="max-w-3xl mx-auto space-y-6 font-sans">
    <PageTitle 
      title="會員交易" 
      subtitle="會員交易清單" 
    />
    
    <div v-if="loading" class="text-center text-lotus-400 py-8 animate-pulse">
      資料載入中，請稍候...
    </div>

    <div v-else-if="details.length > 0" class="space-y-5">
      <TransactionCard 
        v-for="tx in details" 
        :key="tx.transactionId" 
        :transaction="tx" 
      />
    </div>

  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import transaction from '../utils/transaction'
import PageTitle from '@/components/common/PageTitle.vue'
import TransactionCard from '@/components/common/TransactionCard.vue'
const memberId = ref(0)
const loading = ref(true)
const details = ref([])

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const memberIdParam = params.get('memberId')
  if (memberIdParam) {
    const id = Number(memberIdParam)
    if (!Number.isNaN(id)) memberId.value = id
    getTransactionsByMemberId()
  } else {
    // 沒有 memberId 時返回上一頁
    loading.value = false
    window.history.back()
  }
})

const getTransactionsByMemberId = async () => {
  if (!memberId.value) return

  try {
    const res = await transaction.getTransactionsByMemberId(memberId.value)
    details.value = res || []
  } finally {
    loading.value = false
  }
}

</script>