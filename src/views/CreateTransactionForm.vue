<template>
  <div class="max-w-4xl mx-auto space-y-8 font-sans pb-20">
    
    <div class="text-center space-y-2 mb-8">
      <h1 class="text-3xl font-bold text-lotus-600 tracking-wider">新增交易紀錄</h1>
      <p class="text-lotus-500 text-sm">請依序填寫基本資料、施作項目與收費明細</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      
      <BasicInfoSection v-model="formData" />

      <OperationSection v-model="formData.operationItems" />

      <TransactionDetailSection v-model="formData.transactionDetails" />

      <section class="bg-gray-50 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
          <span class="text-lotus-500">💰</span> 結帳總計
        </h2>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">整筆備註事項</label>
          <textarea 
            v-model="formData.remark" 
            rows="3" 
            placeholder="如有其他特殊事項、客製化要求請填寫於此..."
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lotus-400 outline-none resize-none bg-white"
          ></textarea>
        </div>
      </section>

      <div class="flex justify-end gap-4 border-t border-gray-200 pt-6">
        <button type="button" class="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
          取消
        </button>
        <button type="submit" class="px-8 py-3 bg-lotus-400 hover:bg-lotus-500 text-white rounded-xl font-bold shadow-md transition-all hover:-translate-y-0.5">
          確認新增交易
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import transaction from '@/utils/transaction' 
import BasicInfoSection from '../components/form/BasicInfoSection.vue'
import OperationSection from '../components/form/OperationSection.vue'
import TransactionDetailSection from '../components/form/TransactionDetailSection.vue'

const defaultDate = new Date()
defaultDate.setMinutes(0, 0, 0)

const formData = ref({
  memberId: Number(new URLSearchParams(window.location.search).get('memberId')) || null,
  transactionTime: defaultDate,
  lashArtist: 'Ava',
  paymentMethod: '現金',
  remark: '',
  operationItems: [],
  transactionDetails: []
})

// === 送出處理 ===
const handleSubmit = async () => {
  if (!formData.value.transactionTime || !formData.value.lashArtist || !formData.value.paymentMethod) {
    alert('請填寫所有必填欄位')
    return
  }
  if (formData.value.transactionDetails.length === 0) {
    alert('請至少新增一筆收費明細')
    return
  }
  
  // 深拷貝一份乾淨的 payload
  const payload = JSON.parse(JSON.stringify(formData.value))
  
  // 時間格式轉換
  payload.transactionTime = formData.value.transactionTime.toISOString()

  // 整理陣列資料 & 清除無用的折扣值
  payload.operationItems.forEach(op => {
    op.eyelashAreaDetail.forEach(area => {
      area.lashLengths = area._lengthsStr ? area._lengthsStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)) : []
      area.lashCurls = area._curlsStr ? area._curlsStr.split(',').map(s => s.trim()).filter(s => s) : []
      delete area._lengthsStr
      delete area._curlsStr
    })
  })

  payload.transactionDetails.forEach(detail => {
    delete detail.isCustom
    if (detail.discountType === 'N') {
      detail.discountRate = 1
      detail.discountPrice = 0
    } else if (detail.discountType === 'A') {
      detail.discountRate = 1 
    } else if (detail.discountType === 'R') {
      detail.discountPrice = 0 
    }
  })

  // 打 API
  try {
    const res = await transaction.createTransaction(payload)
    if (res) {
      alert('交易新增成功！')
      window.location.href = `/transaction?memberId=${formData.value.memberId}`
    } else {
      alert('交易新增失敗，請確認資料後重試。')
    }
  } catch (error) {
    console.error('API 錯誤:', error)
    alert('交易新增失敗！')
  }
}
</script>