<template>
  <NavBar />
  <div class="min-h-screen bg-lotus-50 pt-24 pb-12 px-4 font-sans text-gray-700">
    <router-view />
  </div>
</template>

<script setup>
import NavBar from './components/common/NavBar.vue';
</script>