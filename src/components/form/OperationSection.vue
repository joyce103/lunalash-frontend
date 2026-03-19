<template>
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
      <div v-for="(op, opIndex) in items" :key="opIndex" class="p-5 border border-lotus-200 rounded-xl bg-lotus-50/30 relative">
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
</template>

<script setup>
// 接收父組件傳進來的 operationItems 陣列
const items = defineModel({ type: Array, required: true, default: () => [] })

const addOperation = () => {
  items.value.push({
    operationName: '', style: '', thickness: '', brand: '', glueType: '', 
    totalLashCount: 0, category: '一般', remark: '',
    eyelashAreaDetail: []
  })
}
const removeOperation = (index) => items.value.splice(index, 1)

const addArea = (opIndex) => {
  items.value[opIndex].eyelashAreaDetail.push({
    position: '', lashCount: 0, _lengthsStr: '', _curlsStr: ''
  })
}
const removeArea = (opIndex, areaIndex) => items.value[opIndex].eyelashAreaDetail.splice(areaIndex, 1)
</script>