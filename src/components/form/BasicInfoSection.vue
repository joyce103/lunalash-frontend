<template>
  <section class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-lotus-100">
    <h2 class="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
      <span class="text-lotus-500">📝</span> 基本資料
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">消費時間 <span class="text-red-400">*</span></label>
        <VueDatePicker 
          v-model="model.transactionTime" 
          format="yyyy/MM/dd HH:00"
          :is-24="true"
          :minutes-increment="60"
          :clearable="false"
          :enable-seconds="false"
          auto-apply
          input-class-name="w-full px-4 py-2 bg-lotus-50 border border-lotus-300 rounded-xl focus:ring-2 focus:ring-lotus-400 text-lotus-600 outline-none transition-colors"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">美睫師 <span class="text-red-400">*</span></label>
        <input v-model="model.lashArtist" type="text" required placeholder="例如：Luna" class="w-full px-4 py-2 bg-lotus-50 border border-lotus-300 rounded-xl focus:ring-2 focus:ring-lotus-400 text-lotus-600 outline-none transition-colors" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">付款方式 <span class="text-red-400">*</span></label>
        <select v-model="model.paymentMethod" required class="w-full px-4 py-2 bg-lotus-50 border border-lotus-300 rounded-xl focus:ring-2 focus:ring-lotus-400 text-lotus-600 outline-none transition-colors appearance-none">
          <option value="現金">現金</option>
          <option value="信用卡">信用卡</option>
          <option value="LinePay">LinePay</option>
          <option value="匯款">匯款</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">會員編號 (Member ID)</label>
        <input v-model.number="model.memberId" type="number" placeholder="若無可留空" readonly class="w-full px-4 py-2 bg-lotus-50 border border-lotus-300 rounded-xl focus:ring-2 focus:ring-lotus-400 text-lotus-600 outline-none transition-colors" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

// 接收父組件傳進來的 formData (只包含基本資料的部分)
const model = defineModel({ required: true })
</script>