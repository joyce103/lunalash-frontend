<template>
  <section class="bg-white p-6 rounded-2xl shadow-sm border border-lotus-100 flex gap-4 items-center transition-all hover:shadow-md">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @keyup.enter="$emit('search')"
      type="text"
      :placeholder="placeholder"
      class="flex-1 px-4 py-2 bg-lotus-50 border border-lotus-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lotus-400 focus:border-transparent transition-colors text-lotus-600 placeholder-lotus-300"
    />
    <button
      :disabled="loading"
      @click="$emit('search')"
      class="px-6 py-2 bg-lotus-400 hover:bg-lotus-500 disabled:bg-lotus-300 disabled:cursor-not-allowed text-white font-medium rounded-xl shadow-sm transition-colors duration-200 whitespace-nowrap"
    >
      {{ loading ? loadingText : buttonText }}
    </button>
  </section>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' }, // 接收 v-model 的值
  placeholder: { type: String, default: '請輸入關鍵字...' },
  loading: { type: Boolean, default: false },
  buttonText: { type: String, default: '查詢' },
  loadingText: { type: String, default: '查詢中...' }
})

// 定義這個元件會對外發送的事件
defineEmits(['update:modelValue', 'search'])
</script>