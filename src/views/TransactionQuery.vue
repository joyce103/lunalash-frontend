<template>
  <div class="max-w-3xl mx-auto space-y-6 font-sans">
    <PageTitle 
      title="交易查詢" 
      subtitle="查詢交易資料" 
    />

    <SearchBar 
      v-model="transactionId"
      placeholder="請輸入交易編號"
      :loading="loading"
      @search="getTransactionById"
    />
    
    <div v-if="loading" class="text-center text-lotus-400 py-8 animate-pulse">
      資料載入中，請稍候...
    </div>

    <div v-else-if="details" class="space-y-5">
     <div class="border border-lotus-200 rounded-2xl overflow-hidden bg-white shadow-sm font-sans">
    
      <div class="bg-lotus-50/50 p-5 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-lotus-100">
        <div>
          <span class="block text-s text-lotus-400 mb-1">消費時間</span>
          <span class="font-medium text-gray-700">{{ formatTime(details.transactionTime) }}</span>
        </div>
        <div>
          <span class="block text-s text-lotus-400 mb-1">美睫師</span>
          <span class="font-medium text-gray-700">{{ details.lashArtist }}</span>
        </div>
        <div>
          <span class="block text-s text-lotus-400 mb-1">交易單號</span>
          <span class="font-mono text-gray-700">#{{ details.transactionId }}</span>
        </div>
        <div>
          <span class="block text-s text-lotus-400 mb-1">付款方式</span>
          <span class="inline-block bg-white border border-lotus-200 text-lotus-600 px-2.5 py-0.5 rounded-md text-sm font-medium">
            {{ details.paymentMethod }}
          </span>
        </div>
      </div>

      <div class="p-5 md:p-6">
        <h4 class="text-lotus-600 font-bold mb-4 flex items-center gap-2">
          施作紀錄與眼型配置
        </h4>
        <div class="rounded-xl border border-lotus-100">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-lotus-100/50 text-lotus-700">
              <tr>
                <th class="px-4 py-3 font-medium">項目名稱</th>
                <th class="px-4 py-3 font-medium">款式 / 粗度</th>
                <th class="px-4 py-3 font-medium">品牌 / 膠水 / 分類</th>
                <th class="px-4 py-3 font-medium">總根數</th>
                <th class="px-4 py-3 font-medium min-w-[300px]">部位詳細配置</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-lotus-50">
              <tr v-for="op in details.operationItems" :key="op.operationItemId" class="hover:bg-lotus-50/30 transition-colors">
                <td class="px-4 py-4 font-bold text-gray-800">{{ op.operationName }}</td>
                <td class="px-4 py-4 text-gray-600">{{ op.style }} <br> <span class="text-s text-gray-400">{{ op.thickness }}</span></td>
                <td class="px-4 py-4 text-gray-600">{{ op.brand }} <br> <span class="text-s text-gray-400">{{ op.glueType }} / {{ op.category }}</span></td>
                <td class="px-4 py-4 font-bold text-lotus-600">{{ op.totalLashCount }}</td>
                <td class="px-4 py-4">
                  <div class="space-y-2">
                    <div 
                      v-for="area in op.eyelashAreaDetails" 
                      :key="area.eyelashAreaDetailId" 
                      class="bg-lotus-50 px-3 py-2 rounded-lg text-s flex flex-col flex-wrap gap-4 border border-lotus-100"
                    >
                      <div class="flex flex-wrap gap-4">
                        <span class="font-bold text-lotus-700">📍 {{ area.position }}</span>
                        <span class="text-gray-500">根數: <b class="text-gray-700">{{ area.lashCount }}</b></span>
                      </div>
                      <div class="flex flex-col flex-wrap gap-4">
                        <span class="text-gray-500">長度: <b class="text-gray-700">{{ area.lashLengths.join(', ') }}</b></span>
                        <span class="text-gray-500">捲度: <b class="text-gray-700">{{ area.lashCurls.join(', ') }}</b></span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="p-5 md:p-6 bg-gray-50/50 border-t border-lotus-100">
        <h4 class="text-lotus-600 font-bold mb-4 flex items-center gap-2">
          <span>🧾</span> 結帳明細
        </h4>
        <div class="rounded-xl border border-gray-200 bg-white">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-gray-100 text-gray-600">
              <tr>
                <th class="px-4 py-3 font-medium">品項名稱</th>
                <th class="px-4 py-3 font-medium text-right">單價</th>
                <th class="px-4 py-3 font-medium text-right">數量</th>
                <th class="px-4 py-3 font-medium text-right">折扣活動</th>
                <th class="px-4 py-3 font-medium text-right">小計</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="detail in details.transactionDetails" :key="detail.transactionDetailId" class="hover:bg-gray-50">
                <td class="px-4 py-3 font-medium text-gray-800">{{ detail.itemName }}</td>
                <td class="px-4 py-3 text-right text-gray-600">${{ detail.itemPrice }}</td>
                <td class="px-4 py-3 text-right text-gray-600">x {{ detail.quantity }}</td>
                <td class="px-4 py-3 text-right">
                  <span v-if="detail.discountType" class="text-s bg-lotus-100 text-lotus-600 px-2 py-1 rounded">
                    {{ detail.discountType }} (-${{ (detail.itemPrice - detail.actualPrice)*detail.quantity }})
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-4 py-3 text-right font-bold text-gray-700">${{ detail.actualPrice*detail.quantity }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="p-5 md:p-6 border-t border-lotus-100 bg-white flex flex-col md:flex-row justify-between items-end gap-6">
        <div class="text-sm text-gray-500 w-full md:w-1/2 bg-gray-50 p-3 rounded-xl border border-gray-100">
          <p class="flex gap-2">
            <span class="text-lotus-400 font-medium whitespace-nowrap">整筆備註：</span>
            <span>{{ details.remark || '無備註' }}</span>
          </p>
        </div>
        
        <div class="w-full md:w-auto space-y-2 text-right">
          <div class="flex justify-between md:justify-end gap-8 text-sm text-gray-500">
            <span>原價總計</span>
            <span>${{ details.amountBeforeDiscount }}</span>
          </div>
          <div v-if="details.discountType" class="flex justify-between md:justify-end gap-8 text-sm text-lotus-500">
            <span>整筆折扣 ({{ details.discountType }})</span>
            <span class="font-medium">{{ formatDiscount(details.discountRate) }} 折</span>
          </div>
          <div class="flex justify-between md:justify-end items-end gap-8 pt-3 border-t border-gray-100">
            <span class="font-medium text-gray-700 pb-1">實付總額</span>
            <span class="font-bold text-red-400 text-3xl tracking-tight">${{ details.amountAfterDiscount }}</span>
          </div>
        </div>
      </div>

    </div>
    </div>

    <div v-else-if="!loading && hasSearched" class="text-center py-12 bg-white rounded-2xl border border-lotus-100 border-dashed">
      <p class="text-lotus-400">找不到這筆交易的明細，請確認單號是否正確。</p>
    </div>

  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import transaction from '../utils/transaction'
import PageTitle from '@/components/common/PageTitle.vue'
import SearchBar from '@/components/common/SearchBar.vue'
const transactionId = ref('')
const loading = ref(false)
const hasSearched = ref(false)
const details = ref(null)

const getTransactionById = async () => {
  if (!transactionId.value) return // 防呆：沒單號就不打 API
  
  loading.value = true // 開啟 loading 狀態
  try {
    const res = await transaction.getTransactionById(transactionId.value)
    details.value = res?.length > 0 ? res : null
  } catch (error) {
    console.error('查詢失敗:', error)
    details.value = null
  } finally {
    loading.value = false
    hasSearched.value = true
  }
}

// 處理時間格式
const formatTime = (timeString) => {
  if (!timeString) return '-'
  const date = new Date(timeString)
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 處理折扣顯示
const formatDiscount = (rate) => {
  if (!rate) return ''
  return Number((rate * 10).toFixed(1))
}

onMounted(() => {
  // 解析網址列的 query string
  const urlParams = new URLSearchParams(window.location.search)
  const idFromUrl = urlParams.get('transactionId')
  
  // 如果網址有帶交易id，立刻觸發查詢
  if (idFromUrl) {
    transactionId.value = idFromUrl
    getTransactionById()
  }
})
</script>