<template>
  <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    <div
      v-for="member in memberList"
      :key="member.memberId"
      class="bg-white p-6 rounded-2xl shadow-sm border border-lotus-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col"
    >
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-xl font-bold text-gray-800">{{ member.name }}</h3>
          <p class="text-xs text-lotus-400 mt-1">#{{ member.memberId }}</p>
        </div>
        
        <div class="flex items-center gap-2">
          <span class="bg-lotus-100 text-lotus-600 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
            {{ member.memberLevel || '一般會員' }}
          </span>
          
          <button 
            @click="handleEdit(member)"
            class="p-1.5 text-gray-400 hover:text-lotus-500 hover:bg-lotus-50 rounded-lg transition-colors cursor-pointer"
            title="編輯會員資料"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>

      <div class="space-y-2 text-sm text-gray-600 mb-6 flex-1">
        <p class="flex items-center gap-2"><span>📱</span> {{ member.phone }}</p>
        <p class="flex items-center gap-2"><span>📅</span> 加入：{{ formatDate(member.createdAt) }}</p>
        <p class="flex items-center gap-2"><span>🎂</span> 生日：{{ formatDate(member.birthday) }}</p>
        <p class="flex items-center gap-2"><span>📅</span> 最近消費：{{ member.updatedAt }}</p>
      </div>

      <div class="flex gap-3 mt-auto">
        <button 
          @click="goDetail(member.memberId)"
          class="flex-1 bg-lotus-50 hover:bg-lotus-100 text-lotus-600 border border-lotus-200 py-2.5 px-4 rounded-xl font-medium transition-colors text-sm"
        >
          查看紀錄
        </button>
        <button 
          @click="createTransaction(member.memberId)"
          class="flex-1 bg-lotus-400 hover:bg-lotus-500 text-white py-2.5 px-4 rounded-xl font-medium transition-colors text-sm shadow-sm"
        >
          新增交易
        </button>
      </div>
    </div>
    
  </section>
</template>

<script setup>
const props = defineProps({
  memberList: {
    type: Array,
    default: () => []
  }
})

// 🚀 定義要對外發送的事件
const emit = defineEmits(['edit'])

// 處理編輯按鈕點擊
const handleEdit = (member) => {
  // 將被點擊的整包 member 資料傳遞給父元件
  emit('edit', member)
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString()
}

const goDetail = (memberId) => {
  location.href = `/transaction?memberId=${memberId}`
}

const createTransaction = (memberId) => {
  location.href = `/createTransaction?memberId=${memberId}`
}
</script>