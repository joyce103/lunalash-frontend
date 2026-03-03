<template>
  <div class="max-w-3xl mx-auto space-y-6 font-sans">

    <PageTitle 
      title="會員查詢" 
      subtitle="快速查詢與管理會員資料" 
    />
    <button 
      @click="isModalOpen = true"
      class="mt-4 sm:mt-0 px-5 py-2.5 bg-lotus-400 hover:bg-lotus-500 text-white rounded-xl shadow-sm transition-colors font-medium flex items-center gap-2 text-sm"
    >
      <span class="text-lg leading-none">+</span> 新增會員
    </button>

    <button 
      @click="getAllMembers"
      class="mt-4 sm:mt-0 px-5 py-2.5 bg-lotus-400 hover:bg-lotus-500 text-white rounded-xl shadow-sm transition-colors font-medium flex items-center text-sm"
    >
      <span class="text-lg leading-none"></span> 所有會員
    </button>

    <SearchBar 
      v-model="searchKeyword"
      placeholder="請輸入手機號碼"
      :loading="loading"
      @search="handleSearch"
    />

    <div v-if="(hasSearched || hasAllMembers) && (!memberList || memberList.length === 0) && !loading" class="text-center py-12 bg-white rounded-2xl border border-lotus-100 border-dashed">
      <p class="text-lotus-400">{{ hasSearched ? '查無此會員資料，請確認輸入是否正確。' : '查無會員資料，現在就新增第一位會員吧！' }}</p>
    </div>

    <MemberCard 
      v-if="memberList && memberList.length > 0" 
      :memberList="memberList" 
      @edit="openEditModal" 
    />
    <MemberFormModal 
      :isOpen="isModalOpen" 
      :memberData="currentEditingMember"
      @close="isModalOpen = false"
      @submit="handleFormSubmit"
    />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import member from '../utils/member' // 記得確認這條路徑對不對
import PageTitle from '@/components/common/PageTitle.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import MemberCard from '@/components/common/MemberCard.vue'
import MemberFormModal from '@/components/common/MemberFormModal.vue'

const searchKeyword = ref('')
const memberList = ref([])
const loading = ref(false)
const hasSearched = ref(false)
// 手機查詢會員
const handleSearch = async () => {
  if (!searchKeyword.value.trim()) return

  loading.value = true
  hasSearched.value = false

  try {
    const res = await member.getMemberByPhone(searchKeyword.value)
    memberList.value = res ? [res] : [] 
  } catch (error) {
    console.error(error)
    memberList.value = []
  } finally {
    loading.value = false
    hasSearched.value = true
  }
}
// 新增會員
const isModalOpen = ref(false)
const currentEditingMember = ref(null) // null 代表新增
const openCreateModal = () => {
  currentEditingMember.value = null // 清空舊資料
  isModalOpen.value = true
}

// 編輯會員
const openEditModal = (member) => {
  currentEditingMember.value = member // 塞入要編輯的資料
  isModalOpen.value = true
}

// 接收子元件傳回來的表單資料
const handleFormSubmit = async (formData) => {
  if (formData.memberId) {
    const res = await member.updateMember(formData);
  } else {
    const res = await member.addMember(formData);
  }
}

// 查詢所有會員
const hasAllMembers = ref(false)
const getAllMembers = async () => {
  const res = await member.getAllMembers()
  memberList.value = res || []
  hasAllMembers.value = true
}
</script>