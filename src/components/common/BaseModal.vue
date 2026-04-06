<template>
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm px-4"
        @click.self="closeModal"
      >
        <div :class="['bg-white rounded-xl shadow-lg w-full rounded-2xl shadow-xl overflow-hidden transform transition-all', maxWidth]">
          
          <div class="px-6 py-4 border-b border-lotus-100 flex justify-between items-center bg-lotus-50/50">
            <h3 class="text-lg font-bold text-lotus-600">{{ title }}</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-lotus-500 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6">
            <slot></slot>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, default: '提示' },
  maxWidth: { // 設定彈窗寬度參數 預設約 512px
    type: String,
    default: 'max-w-lg' 
  }
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
/* 淡入淡出動畫 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>