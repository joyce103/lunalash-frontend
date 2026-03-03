<template>
  <nav class="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-lotus-100 z-50 shadow-sm transition-all duration-300">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        
        <div class="flex-shrink-0 flex items-center cursor-pointer">
          <span class="text-2xl font-bold text-lotus-600 tracking-widest">LumeLash</span>
        </div>

        <div class="flex space-x-6 items-center">
          <a href="/home" class="text-gray-500 hover:text-lotus-500 px-3 py-2 text-sm font-medium transition-colors duration-200">
            首頁
          </a>
          <a href="/about" class="text-gray-500 hover:text-lotus-500 px-3 py-2 text-sm font-medium transition-colors duration-200">
            關於 LumeLash
          </a>
          
          <a href="/member" class="ml-4 px-5 py-2 rounded-full bg-lotus-50 text-lotus-600 border border-lotus-200 hover:bg-lotus-100 hover:shadow-sm font-medium text-sm transition-all duration-200">
            查詢會員
          </a>
        </div>
        
      </div>
    </div>
  </nav>
</template>

<script setup>
// 目前先專注在畫面排版，未來我們可以把 href="#" 換成 Vue Router 的 <router-link>
</script>