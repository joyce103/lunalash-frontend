<template>
  <div class="space-y-3 font-sans">
    <label class="block text-sm font-medium text-gray-700">LumeLash 諮詢記錄同意書 Agreement</label>
    
    <div class="relative border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
      <div 
        ref="termsContainer"
        @scroll="handleScroll"
        class="h-56 overflow-y-auto p-5 text-sm text-gray-600 leading-relaxed custom-scrollbar"
      >
        <!-- <h4 class="font-bold text-gray-800 mb-4 text-base">LumeLash 美睫服務同意書</h4> -->
        <div class="space-y-4">
          <!-- <section>
            <h5 class="font-semibold text-lotus-600 mb-1">一、 預約與取消政策</h5>
            <p>1. 為保障雙方權益，預約保留 15 分鐘，逾時視同取消並可能影響未來預約權益。</p>
            <p>2. 若需更改時間或取消，請於預約時間 24 小時前主動告知。</p>
          </section>

          <section>
            <h5 class="font-semibold text-lotus-600 mb-1">二、 健康狀況與過敏評估</h5>
            <p>1. 若您有眼部疾病（如結膜炎、針眼等）、近期進行過眼部手術，或對黑膠、膠帶有過敏史，請務必於施作前主動告知美睫師。</p>
            <p>2. 施作過程中如有任何不適（如熏眼、刺痛），請立即反映，美睫師將立即為您處理。</p>
            <p>3. 孕婦或特殊體質者，建議先諮詢專業醫師意見後再進行施作。</p>
          </section>

          <section>
            <h5 class="font-semibold text-lotus-600 mb-1">三、 施作後保養與維修</h5>
            <p>1. 施作後 4-6 小時內請盡量避免碰水、遠離高溫高濕環境（如溫泉、蒸氣室），以利黑膠完全固化。</p>
            <p>2. 洗臉時請避開含油性成分之卸妝產品，並輕柔按壓擦乾水分。</p>
            <p>3. 本店提供施作後 3 日內免費微調服務（非人為因素掉落），逾期將酌收補睫費用。</p>
          </section> -->

          <section>
            <h5 class="font-semibold text-lotus-600 mb-1">請詳閱以下各項目並完全同意下列之敘述者，若有不確定請詢問服務人員。</h5>
            <p>1. 我同意接睫最後成果會因個人的睫毛生長、健康程度、濃密度和眼型而有所不同，所以無法加以保證及預見最後的呈現外觀為何，服務完成後故無法做任何退費要求。</p>
            <p>2. 如果我本身有任何眼疾、過敏或動過眼部手術、紋繡服務，將會主動告知美睫師，並斟酌是否接受接睫服務，若接睫後因個人體質關係或後續衛生問題產生不適現象，服務店家可免責。</p>
            <p>3. 我了解接睫操作過程可能會帶來潛在不適感，如流淚、些許紅眼或過敏現象。</p>
            <p>4. 接受接睫後，會因個人體質、生活習慣關係與保養方式不同，睫毛脫落速度也不盡相同，故店家無法提供保固期。</p>
            <p>5. 想卸除睫毛必須經由專業美睫師使用專業卸除產品與技術，任何自行卸除動作都會對真睫毛造成傷害。</p>
          </section>
        </div>

        <div class="mt-8 pb-2 text-center">
          <span v-if="!hasReadToBottom" class="text-lotus-400 animate-pulse font-medium">
            ↓ 請繼續向下滑動閱讀完整條款 ↓
          </span>
          <span v-else class="text-gray-400 font-medium">
            --- 您已閱讀至底部 ---
          </span>
        </div>
      </div>
      
      <div v-if="!hasReadToBottom" class="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
    </div>

    <div class="flex items-start gap-2 pt-1">
      <div class="flex items-center h-5 mt-0.5">
        <input 
          id="terms-checkbox" 
          type="checkbox" 
          :checked="modelValue"
          @change="toggleAgreement"
          :disabled="!hasReadToBottom"
          class="w-4.5 h-4.5 text-lotus-500 border-gray-300 rounded focus:ring-lotus-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        />
      </div>
      <label 
        for="terms-checkbox" 
        class="text-sm transition-colors select-none"
        :class="hasReadToBottom ? 'text-gray-700 cursor-pointer' : 'text-gray-400 cursor-not-allowed'"
      >
        我已詳閱並同意 LumeLash 服務條款與隱私權政策
        <p v-if="!hasReadToBottom" class="text-xs text-lotus-400 mt-0.5">
          * 請先將上方條款滑動至最底部以解鎖
        </p>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 支援 v-model 的寫法
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const termsContainer = ref(null)
const hasReadToBottom = ref(false)

// 監聽滾動事件
const handleScroll = () => {
  const el = termsContainer.value
  if (!el) return

  // 計算是否滑到底部 (設定 5px 的容錯範圍，避免跨瀏覽器小數點計算問題)
  const isBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 5
  
  if (isBottom && !hasReadToBottom.value) {
    hasReadToBottom.value = true
  }
}

// 點擊 Checkbox 時更新父元件的 v-model
const toggleAgreement = (event) => {
  emit('update:modelValue', event.target.checked)
}

// 如果一開始進來就已經是同意狀態 (例如編輯舊會員)，直接解鎖底部限制
onMounted(() => {
  if (props.modelValue) {
    hasReadToBottom.value = true
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f9fafb; 
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1; 
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; 
}
</style>