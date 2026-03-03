<template>
  <header class="text-center space-y-2">
    <h1 class="text-3xl font-bold text-lotus-600 tracking-wider">{{ title }}</h1>
    
    <p v-if="subtitle" class="text-lotus-500 text-sm">{{ subtitle }}</p>
  </header>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: '' // 副標題預設為空
  }
})
</script>