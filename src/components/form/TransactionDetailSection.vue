<template>
  <section class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-lotus-100">
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <span class="text-lotus-500">🧾</span> 收費明細
      </h2>
      <button type="button" @click="addTransactionDetail" class="px-4 py-2 bg-lotus-100 text-lotus-600 hover:bg-lotus-200 rounded-xl text-sm font-medium transition-colors">
        + 新增收費項目
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm whitespace-nowrap">
        <thead class="text-gray-500 border-b border-gray-200">
          <tr>
            <th class="pb-2 font-medium w-1/4">品項名稱</th>
            <th class="pb-2 font-medium">單價</th>
            <th class="pb-2 font-medium w-16">數量</th>
            <th class="pb-2 font-medium w-32">折扣設定</th>
            <th class="pb-2 font-medium w-32">折扣數值</th>
            <th class="pb-2"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(detail, dIndex) in details" :key="dIndex">
            <td class="py-3 pr-2">
              <select 
                v-if="!detail.isCustom"
                v-model="detail.itemName" 
                @change="handleItemChange(detail)"
                required
                class="w-full px-2 py-1.5 border rounded outline-none focus:border-lotus-400 bg-white"
              >
                <option value="" disabled>請選擇品項</option>
                <option v-for="item in predefinedItems" :key="item.name" :value="item.name">
                  {{ item.name }}
                </option>
                <option value="自訂">➕ 自訂項目...</option>
              </select>
              
              <div v-else class="flex items-center gap-1">
                <input 
                  v-model="detail.itemName" 
                  type="text" 
                  required
                  placeholder="請輸入自訂名稱" 
                  class="w-full px-2 py-1.5 border rounded outline-none focus:border-lotus-400 bg-lotus-50" 
                />
                <button 
                  type="button" 
                  @click="detail.isCustom = false; detail.itemName = ''; detail.itemPrice = 0" 
                  class="text-gray-400 hover:text-red-400 px-1" 
                  title="返回選單"
                >✖</button>
              </div>
            </td>
            
            <td class="py-3 pr-2">
              <input v-model.number="detail.itemPrice" type="number" required placeholder="單價" class="w-full px-2 py-1.5 border rounded outline-none focus:border-lotus-400" />
            </td>
            
            <td class="py-3 pr-2">
              <input v-model.number="detail.quantity" type="number" required class="w-full px-2 py-1.5 border rounded outline-none focus:border-lotus-400" />
            </td>
            
            <td class="py-3 pr-2">
              <select v-model="detail.discountType" class="w-full px-2 py-1.5 border rounded outline-none focus:border-lotus-400 bg-white">
                <option value="N">N: 無折扣</option>
                <option value="R">R: 打折 (Rate)</option>
                <option value="A">A: 折錢 (Amount)</option>
              </select>
            </td>
            
            <td class="py-3 pr-2">
              <div v-if="detail.discountType === 'R'">
                <input 
                  v-model.number="detail.discountRate" 
                  type="number" 
                  max="1" 
                  min="0" 
                  step="0.01" 
                  placeholder="如: 0.9 (九折)" 
                  class="w-full px-2 py-1.5 border rounded outline-none focus:border-lotus-400 bg-lotus-50" 
                />
              </div>
              <div v-else-if="detail.discountType === 'A'">
                <input v-model.number="detail.discountPrice" type="number" min="0" placeholder="如: 100" class="w-full px-2 py-1.5 border rounded outline-none focus:border-lotus-400 bg-lotus-50" />
              </div>
              <div v-else class="text-gray-300 px-2 py-1.5 text-center bg-gray-50 rounded">
                -
              </div>
            </td>
            
            <td class="py-3 text-right">
              <button type="button" @click="removeTransactionDetail(dIndex)" class="text-red-400 hover:text-red-600 px-2">✖</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
// 接收父組件傳進來的 transactionDetails 陣列
const details = defineModel({ type: Array, required: true, default: () => [] })

const predefinedItems = [
  { name: '睫毛雨衣(黑)', price: 500 },
  { name: '睫毛雨衣(透明)', price: 450 },
  { name: '嫁接', price: 1200 },
  { name: '卸睫', price: 500 }
]

const addTransactionDetail = () => {
  details.value.push({
    itemName: '', itemPrice: 0, quantity: 1, 
    discountType: 'N',
    discountRate: 1, discountPrice: 0,
    isCustom: false
  })
}
const removeTransactionDetail = (index) => details.value.splice(index, 1)

const handleItemChange = (detail) => {
  if (detail.itemName === '自訂') {
    detail.isCustom = true   
    detail.itemName = ''     
    detail.itemPrice = 0     
  } else {
    const selected = predefinedItems.find(item => item.name === detail.itemName)
    if (selected) {
      detail.itemPrice = selected.price
    }
  }
}
</script>