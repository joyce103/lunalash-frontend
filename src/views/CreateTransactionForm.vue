<template>
  <div class="max-w-4xl mx-auto space-y-8 font-sans pb-20">
    
    <div class="text-center space-y-2 mb-8">
      <h1 class="text-3xl font-bold text-lotus-600 tracking-wider">新增交易紀錄</h1>
      <p class="text-lotus-500 text-sm">請依序填寫基本資料、施作項目與收費明細</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      
      <section class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-lotus-100">
        <h2 class="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
          <span class="text-lotus-500">📝</span> 基本資料
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">消費時間 <span class="text-red-400">*</span></label>
            <VueDatePicker 
              v-model="formData.transactionTime" 
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
            <input v-model="formData.lashArtist" type="text" required placeholder="例如：Luna" class="w-full px-4 py-2 bg-lotus-50 border border-lotus-300 rounded-xl focus:ring-2 focus:ring-lotus-400 text-lotus-600 outline-none transition-colors" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">付款方式 <span class="text-red-400">*</span></label>
            <select v-model="formData.paymentMethod" required class="w-full px-4 py-2 bg-lotus-50 border border-lotus-300 rounded-xl focus:ring-2 focus:ring-lotus-400 text-lotus-600 outline-none transition-colors appearance-none">
              <option value="現金">現金</option>
              <option value="信用卡">信用卡</option>
              <option value="LinePay">LinePay</option>
              <option value="匯款">匯款</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">會員編號 (Member ID)</label>
            <input v-model.number="formData.memberId" type="number" placeholder="若無可留空" readonly="true" class="w-full px-4 py-2 bg-lotus-50 border border-lotus-300 rounded-xl focus:ring-2 focus:ring-lotus-400 text-lotus-600 outline-none transition-colors" />
          </div>
        </div>
      </section>

      <section class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-lotus-100">
        <div class="flex justify-between items-center mb-5">
          <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span class="text-lotus-500">👁️</span> 施作項目
          </h2>
          <button type="button" @click="addOperation" class="px-4 py-2 bg-lotus-100 text-lotus-600 hover:bg-lotus-200 rounded-xl text-sm font-medium transition-colors">
            + 新增施作項目
          </button>
        </div>

        <div class="space-y-6">
          <div v-for="(op, opIndex) in formData.operationItems" :key="opIndex" class="p-5 border border-lotus-200 rounded-xl bg-lotus-50/30 relative">
            <button type="button" @click="removeOperation(opIndex)" class="absolute top-4 right-4 text-red-400 hover:text-red-600" title="移除此項目">✖</button>
            <h3 class="font-bold text-lotus-700 mb-4">項目 {{ opIndex + 1 }}</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label class="block text-xs text-gray-500 mb-1">項目名稱</label>
                <select v-model="op.operationName" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-lotus-400 bg-white">
                  <option value="" disabled>請選擇</option>
                  <option value="3D 自然單根">3D 自然單根</option>
                  <option value="6D 濃密開花">6D 濃密開花</option>
                  <option value="角蛋白美睫">角蛋白美睫</option>
                  <option value="下睫毛設計">下睫毛設計</option>
                </select>
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">款式</label>
                <select v-model="op.style" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-lotus-400 bg-white">
                  <option value="" disabled>請選擇</option>
                  <option value="圓眼放大">圓眼放大</option>
                  <option value="眼尾加長(性感)">眼尾加長(性感)</option>
                  <option value="自然順型">自然順型</option>
                  <option value="客製化混搭">客製化混搭</option>
                </select>
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">總根數</label>
                <input v-model.number="op.totalLashCount" type="number" placeholder="例如：120" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-lotus-400" />
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">粗度</label>
                <select v-model="op.thickness" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-lotus-400 bg-white">
                  <option value="" disabled>請選擇</option>
                  <option value="0.05">0.05</option>
                  <option value="0.07">0.07</option>
                  <option value="0.10">0.10</option>
                  <option value="0.15">0.15</option>
                </select>
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">品牌</label>
                <select v-model="op.brand" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-lotus-400 bg-white">
                  <option value="" disabled>請選擇</option>
                  <option value="LunaLash">LunaLash</option>
                  <option value="Jovisa">Jovisa</option>
                  <option value="BiaLash">BiaLash</option>
                </select>
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">膠水</label>
                <select v-model="op.glueType" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-lotus-400 bg-white">
                  <option value="" disabled>請選擇</option>
                  <option value="秒乾黑膠">秒乾黑膠</option>
                  <option value="抗敏黑膠">抗敏黑膠</option>
                  <option value="溫和透膠">溫和透膠</option>
                </select>
              </div>
            </div>

            <div class="mt-4 p-4 bg-white rounded-lg border border-lotus-100">
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm font-bold text-gray-700">部位配置 (Area Details)</span>
                <button type="button" @click="addArea(opIndex)" class="text-xs text-lotus-500 hover:text-lotus-700 font-medium">+ 新增部位</button>
              </div>
              <div class="space-y-3">
                <div v-for="(area, areaIndex) in op.eyelashAreaDetail" :key="areaIndex" class="flex flex-wrap gap-2 items-end bg-gray-50 p-3 rounded-lg border border-gray-100 relative">
                  <div class="w-full md:w-1/5"><label class="block text-[10px] text-gray-400">位置</label><input v-model="area.position" placeholder="如: 眼中" type="text" class="w-full px-2 py-1 text-sm border rounded" /></div>
                  <div class="w-full md:w-1/6"><label class="block text-[10px] text-gray-400">根數</label><input v-model.number="area.lashCount" type="number" class="w-full px-2 py-1 text-sm border rounded" /></div>
                  <div class="w-full md:w-1/4"><label class="block text-[10px] text-gray-400">長度 (用逗號分隔)</label><input v-model="area._lengthsStr" placeholder="如: 9,10,11" type="text" class="w-full px-2 py-1 text-sm border rounded" /></div>
                  <div class="w-full md:w-1/4"><label class="block text-[10px] text-gray-400">捲度 (用逗號分隔)</label><input v-model="area._curlsStr" placeholder="如: C,CC" type="text" class="w-full px-2 py-1 text-sm border rounded" /></div>
                  <button type="button" @click="removeArea(opIndex, areaIndex)" class="text-red-400 hover:text-red-600 text-sm p-1 ml-auto">刪除</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              <tr v-for="(detail, dIndex) in formData.transactionDetails" :key="dIndex">
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
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

// 預設收費品項與價格清單
const predefinedItems = [
  { name: '睫毛雨衣(黑)', price: 500 },
  { name: '睫毛雨衣(透明)', price: 450 },
  { name: '嫁接', price: 1200 },
  { name: '卸睫', price: 500 }
]

// 取得現在時間，並自動歸零到「整點」作為 Datepicker 的預設值
const defaultDate = new Date()
defaultDate.setMinutes(0, 0, 0)

const formData = ref({
  memberId: Number(new URLSearchParams(window.location.search).get('memberId')) || null,
  transactionTime: defaultDate,
  lashArtist: 'Ava',
  paymentMethod: '現金',
  remark: '',
  amountBeforeDiscount: 0,
  amountAfterDiscount: 0,
  operationItems: [],
  transactionDetails: []
})

// === 動態操作方法 ===
const addOperation = () => {
  formData.value.operationItems.push({
    operationName: '', style: '', thickness: '', brand: '', glueType: '', 
    totalLashCount: 0, category: '一般', remark: '',
    eyelashAreaDetail: []
  })
}
const removeOperation = (index) => formData.value.operationItems.splice(index, 1)

const addArea = (opIndex) => {
  formData.value.operationItems[opIndex].eyelashAreaDetail.push({
    position: '', lashCount: 0, _lengthsStr: '', _curlsStr: ''
  })
}
const removeArea = (opIndex, areaIndex) => formData.value.operationItems[opIndex].eyelashAreaDetail.splice(areaIndex, 1)

// 新增收費明細時，加上 isCustom 屬性來控制畫面切換
const addTransactionDetail = () => {
  formData.value.transactionDetails.push({
    itemName: '', itemPrice: 0, quantity: 1, 
    discountType: 'N', // 預設無折扣
    discountRate: 1, discountPrice: 0,
    isCustom: false // 標記是否為自訂模式
  })
}
const removeTransactionDetail = (index) => formData.value.transactionDetails.splice(index, 1)

// 下拉選單改變時的邏輯：如果選自訂，就變身成輸入框
const handleItemChange = (detail) => {
  if (detail.itemName === '自訂') {
    detail.isCustom = true   // 畫面切換為輸入框
    detail.itemName = ''     // 清空字串讓使用者自己輸入
    detail.itemPrice = 0     // 價格歸零讓使用者自己填
  } else {
    // 如果選了預設項目，自動帶入單價
    const selected = predefinedItems.find(item => item.name === detail.itemName)
    if (selected) {
      detail.itemPrice = selected.price
    }
  }
}

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
  const payload = JSON.parse(JSON.stringify(formData.value))
  
  // 送出前，把 Date 物件轉換成後端要的 ISO 格式字串
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

  // 確保傳給後端的資料乾淨 (選 N 的時候把 rate 跟 price 歸零)
  payload.transactionDetails.forEach(detail => {
    // 送出前，把輔助畫面的 isCustom 屬性刪掉，不讓後端收到不需要的資料
    delete detail.isCustom

    if (detail.discountType === 'N') {
      detail.discountRate = 1
      detail.discountPrice = 0
    } else if (detail.discountType === 'A') {
      detail.discountRate = 1 // 折錢時，折數應為原價
    } else if (detail.discountType === 'R') {
      detail.discountPrice = 0 // 打折時，不該有固定折抵金額
    }
  })

  try {
    const res = await transaction.createTransaction(payload)
    if (res) {
      alert('交易新增成功！')
      // 新增成功後導回會員交易頁
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