<template>
  <div v-if="images.length > 0 || showEmpty" class="p-5 md:p-6 bg-white rounded-xl">
    
    <slot name="header">
      <h4 v-if="title" class="text-lotus-600 font-bold mb-4 flex items-center gap-2">
        <span v-if="icon">{{ icon }}</span>
        {{ title }}
      </h4>
    </slot>
    
    <div v-if="images.length > 0" class="flex flex-wrap gap-4">
      <div 
        v-for="(url, idx) in images" 
        :key="idx"
        class="relative group cursor-pointer overflow-hidden rounded-xl border border-lotus-100 shadow-sm transition-all hover:shadow-md hover:scale-[1.02]"
        :style="{ width: imageSize, height: imageSize }"
        @click="openLightbox(url)"
      >
        <img 
          :src="url" 
          class="w-full h-full object-cover" 
          :alt="`${altText} - ${idx + 1}`"
        />
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
          <svg class="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
          </svg>
        </div>
      </div>
    </div>

    <div v-else class="text-sm text-gray-400 italic py-2">
      {{ emptyText }}
    </div>

    <Teleport to="body">
      <div 
        v-if="selectedImage" 
        class="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
        @click="selectedImage = null"
      >
        <img 
          :src="selectedImage" 
          class="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform animate-in fade-in zoom-in duration-300"
          :alt="altText"
        />
        <button class="absolute top-6 right-6 text-white/70 hover:text-white transition-colors" title="關閉">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  // 圖片網址陣列 (唯一必填)
  images: {
    type: Array,
    default: () => []
  },
  // 標題文字
  title: {
    type: String,
    default: '照片藝廊'
  },
  // 標題圖示
  icon: {
    type: String,
    default: '📸'
  },
  // 圖片的 alt 屬性，對 SEO 與無障礙閱讀有幫助
  altText: {
    type: String,
    default: '圖片'
  },
  // 縮圖的長寬大小 (可傳入 '100px', '6rem', '20%' 等)
  imageSize: {
    type: String,
    default: '6rem' // 相當於 Tailwind 的 w-24 h-24
  },
  // 如果沒有圖片，是否還要顯示整個區塊？(預設不顯示)
  showEmpty: {
    type: Boolean,
    default: false
  },
  // 沒有圖片時顯示的提示文字
  emptyText: {
    type: String,
    default: '目前尚無照片'
  }
})

const selectedImage = ref(null)

const openLightbox = (url) => {
  selectedImage.value = url
}
</script>

<style scoped>
.animate-in { animation-duration: 0.3s; animation-fill-mode: both; }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes zoom-in { from { transform: scale(0.95); } to { transform: scale(1); } }
.fade-in { animation-name: fade-in; }
.zoom-in { animation-name: zoom-in; }
</style>