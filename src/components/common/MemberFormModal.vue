<template>
  <BaseModal :isOpen="isOpen" :title="isEditMode ? '編輯會員資料' : '新增會員資料'" @close="handleClose">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      
      <div class="grid grid-cols-1 gap-5">
        
        <div v-if="isEditMode" class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">會員編號</label>
          <input 
            v-model="formData.memberId" 
            type="text" 
            disabled
            class="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none text-gray-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">姓名 <span class="text-red-400">*</span></label>
          <input 
            v-model="formData.name" 
            type="text" 
            required
            placeholder="例如：王小明"
            class="w-full px-4 py-2 bg-lotus-50 border border-lotus-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lotus-400 text-lotus-600 placeholder-lotus-300 transition-colors"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">手機號碼 <span class="text-red-400">*</span></label>
          <input 
            v-model="formData.phone" 
            type="tel" 
            required
            placeholder="例如：0912345678"
            class="w-full px-4 py-2 bg-lotus-50 border border-lotus-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lotus-400 text-lotus-600 placeholder-lotus-300 transition-colors"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">性別 <span class="text-red-400">*</span></label>
          <select 
            v-model="formData.gender" 
            required
            class="w-full px-4 py-2 bg-lotus-50 border border-lotus-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lotus-400 text-lotus-600 transition-colors appearance-none"
          >
            <option value="" disabled>請選擇性別</option>
            <option value="F">女 (F)</option>
            <option value="M">男 (M)</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">生日 <span class="text-red-400">*</span></label>
          <input 
            v-model="formData.birthday" 
            type="date" 
            required
            class="w-full px-4 py-2 bg-lotus-50 border border-lotus-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lotus-400 text-lotus-600 transition-colors"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">會員等級 <span class="text-red-400">*</span></label>
          <select 
            v-model="formData.memberLevel" 
            required
            class="w-full px-4 py-2 bg-lotus-50 border border-lotus-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lotus-400 text-lotus-600 transition-colors appearance-none"
          >
            <option value="" disabled>請選擇等級</option>
            <option value="一般會員">一般會員</option>
            <option value="VIP">VIP</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Line ID</label>
          <input 
            v-model="formData.lineId" 
            type="text" 
            placeholder="例如：@lunalash"
            class="w-full px-4 py-2 bg-lotus-50 border border-lotus-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lotus-400 text-lotus-600 placeholder-lotus-300 transition-colors"
          />
        </div>

      </div>

      <div class="pt-4 flex justify-end gap-3 border-t border-lotus-100 mt-6">
        <button 
          type="button" 
          @click="handleClose"
          class="px-5 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl font-medium transition-colors text-sm"
        >
          取消
        </button>
        <button 
          type="submit" 
          :disabled="isSubmitting"
          class="px-5 py-2 bg-lotus-400 hover:bg-lotus-500 disabled:bg-lotus-300 text-white rounded-xl font-medium shadow-sm transition-colors text-sm"
        >
          {{ isSubmitting ? '儲存中...' : (isEditMode ? '確認修改' : '確認新增') }}
        </button>
      </div>

    </form>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  // 💡 接收父元件傳來的資料：沒有傳就是 null (代表新增)
  memberData: { type: Object, default: () => null } 
})

const emit = defineEmits(['close', 'submit'])

// 💡 計算屬性：只要有傳入資料，就是編輯模式
const isEditMode = computed(() => !!props.memberData)

// 初始表單狀態
const defaultForm = {
  name: '',
  phone: '',
  gender: '',
  birthday: '',
  memberLevel: '',
  lineId: ''
}

const formData = ref({ ...defaultForm })
const isSubmitting = ref(false)

// 💡 監聽彈窗的開關：每次打開時都要重新決定表單的內容
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (isEditMode.value) {
      // 如果是編輯，將傳入的資料拷貝進表單 (淺拷貝，避免直接改到父元件的資料)
      formData.value = { ...props.memberData }
    } else {
      // 如果是新增，清空表單
      formData.value = { ...defaultForm }
    }
  }
})

const handleClose = () => {
  formData.value = { ...defaultForm }
  emit('close')
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    // 💡 這裡統一發送 submit 事件，並把目前的資料丟出去
    // 父元件可以透過檢查物件裡有沒有 memberId 來決定要打 POST(新增) 還是 PUT(修改) API
    emit('submit', { ...formData.value })
    handleClose()
  } catch (error) {
    console.error('儲存失敗', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>