<template>
  <section class="bg-gray-50 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
    <h2 class="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
      <span class="text-lotus-500">📸</span> 施作照片記錄
    </h2>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">上傳施作前/後照片 (可多選)</label>
      
      <input 
        type="file" 
        ref="fileInput"
        accept="image/*"
        multiple
        @change="handleFileChange"
        class="hidden"
      />
      
      <button 
        type="button"
        @click="$refs.fileInput.click()"
        class="px-5 py-2.5 bg-white text-lotus-600 border border-lotus-200 rounded-xl hover:bg-lotus-50 transition-colors text-sm font-medium flex items-center gap-2 shadow-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        選擇照片
      </button>

      <div v-if="previewUrls.length > 0" class="mt-5 flex flex-wrap gap-4">
        <div 
          v-for="(url, index) in previewUrls" 
          :key="index"
          class="relative w-28 h-28 group"
        >
          <img :src="url" class="w-full h-full object-cover rounded-xl border border-gray-200 shadow-sm" />
          
          <button 
            @click.prevent="removeImage(index)"
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
            title="移除照片"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)
const previewUrls = ref([])

// 處理檔案選擇
const handleFileChange = (event) => {
  const files = Array.from(event.target.files)
  if (!files.length) return

  const currentFiles = [...props.modelValue]
  
  files.forEach(file => {
    currentFiles.push(file)
    // 產生本地預覽網址
    previewUrls.value.push(URL.createObjectURL(file))
  })
  
  // 更新外層的 v-model
  emit('update:modelValue', currentFiles)
  
  // 清空 input，確保下次選同一張圖也能觸發
  event.target.value = '' 
}

// 移除照片
const removeImage = (index) => {
  const currentFiles = [...props.modelValue]
  currentFiles.splice(index, 1)
  emit('update:modelValue', currentFiles)

  // 釋放記憶體
  URL.revokeObjectURL(previewUrls.value[index])
  previewUrls.value.splice(index, 1)
}
</script>