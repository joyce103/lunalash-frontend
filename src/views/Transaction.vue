<template>
  <div class="max-w-3xl mx-auto space-y-6 font-sans">
    <PageTitle 
      title="交易查詢" 
      subtitle="查詢交易資料" 
    />

    <SearchBar 
      v-model="searchKeyword"
      placeholder="請輸入交易編號"
      :loading="loading"
      @search="fetchDetails"
    />
    
    <div v-if="loading" class="text-center text-lotus-400 py-8 animate-pulse">
      資料載入中，請稍候...
    </div>

    <div v-else-if="details.length > 0" class="bg-white rounded-2xl shadow-sm border border-lotus-100 overflow-hidden">
      <div class="bg-lotus-100 px-6 py-4 border-b border-lotus-300">
        <h2 class="text-lotus-600 font-semibold">單號 #{{ transactionId }} 的明細清單</h2>
      </div>
      
      <ul class="divide-y divide-lotus-100">
        <li v-for="item in details" :key="item.detailId" class="px-6 py-4 hover:bg-lotus-50 transition-colors flex justify-between items-center">
          
          <div>
            <p class="font-medium text-gray-800">{{ item.itemName }}</p>
            <p class="text-sm text-lotus-500 mt-1">數量: {{ item.quantity }}</p>
          </div>
          
          <div class="text-right">
            <p class="text-lg font-bold text-lotus-600">${{ item.itemPrice }}</p>
            <p v-if="item.discountPrice" class="text-xs text-red-400 line-through">
              折扣前: ${{ item.itemPrice + item.discountPrice }}
            </p>
          </div>
        </li>
      </ul>
    </div>

    <div v-else-if="!loading && hasSearched" class="text-center py-12 bg-white rounded-2xl border border-lotus-100 border-dashed">
      <p class="text-lotus-400">找不到這筆交易的明細，請確認單號是否正確。</p>
    </div>

  </div>
</template>
<script setup>
import PageTitle from '@/components/common/PageTitle.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import { ref } from 'vue'
const transactionId = ref(0)
const loading = ref(false)
const hasSearched = ref(false)
const details = ref([])

const fetchDetails = () => {

}


</script>