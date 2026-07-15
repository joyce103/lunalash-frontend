<template>
  <div class="max-w-3xl mx-auto space-y-6 font-sans">

    <PageTitle title="操作項目管理" subtitle="新增、修改、刪除、排序、啟用/停用預約可選的操作項目" />

    <!-- 項目清單 -->
    <div class="bg-white p-6 rounded-2xl border border-lotus-100 shadow-sm space-y-4">
      <h2 class="text-lg font-semibold text-gray-700">操作項目清單</h2>

      <div v-if="items.length === 0" class="text-center py-8 text-lotus-400 text-sm">尚無操作項目</div>

      <div v-else class="divide-y divide-lotus-100">
        <div v-for="item in items" :key="item.operationCatalogItemId" class="flex items-center justify-between py-3 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-700">
              {{ item.name }}
              <span :class="item.isActive ? 'text-green-500' : 'text-gray-400'" class="ml-2 text-xs">
                {{ item.isActive ? '啟用中' : '已停用' }}
              </span>
            </p>
            <p class="text-xs text-gray-400">排序：{{ item.sortOrder }}　操作時間：{{ item.durationMinutes }} 分鐘</p>
          </div>
          <div class="flex gap-2 shrink-0">
            <button @click="startEdit(item)"
              class="px-4 py-1.5 rounded-full text-sm font-medium bg-lotus-50 text-lotus-600 border border-lotus-200 hover:bg-lotus-100">
              編輯
            </button>
            <button @click="handleDelete(item)"
              class="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200">
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增 / 編輯 -->
    <div class="bg-white p-6 rounded-2xl border border-lotus-100 shadow-sm space-y-4">
      <h2 class="text-lg font-semibold text-gray-700">{{ editingId ? '編輯操作項目' : '新增操作項目' }}</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">名稱</label>
          <input v-model="form.name" type="text" required
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lotus-400 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">操作時間（分鐘）</label>
          <input v-model.number="form.durationMinutes" type="number" min="1" required
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lotus-400 text-sm" />
          <p class="text-xs text-gray-400 mt-1">預約時會把所選項目的時間加總，換算成要占用幾個固定時段（每小時一個）</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">排序 (數字越小越前面)</label>
          <input v-model.number="form.sortOrder" type="number" required
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lotus-400 text-sm" />
        </div>
        <label class="flex items-center gap-2 text-sm text-gray-700">
          <input v-model="form.isActive" type="checkbox" class="rounded border-gray-300 text-lotus-500" />
          啟用（訪客預約表單才看得到）
        </label>

        <div class="flex gap-3">
          <button type="submit" :disabled="submitting"
            class="px-5 py-2.5 bg-lotus-400 hover:bg-lotus-500 text-white rounded-xl shadow-sm transition-colors font-medium text-sm disabled:opacity-50">
            {{ submitting ? '處理中...' : (editingId ? '儲存修改' : '新增項目') }}
          </button>
          <button v-if="editingId" type="button" @click="cancelEdit"
            class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-medium">
            取消編輯
          </button>
        </div>
      </form>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import adminBooking from '@/utils/adminBooking'
import PageTitle from '@/components/common/PageTitle.vue'

const items = ref([])
const loadItems = async () => {
  items.value = await adminBooking.getAllOperationCatalogItems()
}

const editingId = ref(null)
const submitting = ref(false)
const form = ref({ name: '', durationMinutes: 30, sortOrder: 1, isActive: true })

const startEdit = (item) => {
  editingId.value = item.operationCatalogItemId
  form.value = {
    name: item.name,
    durationMinutes: item.durationMinutes,
    sortOrder: item.sortOrder,
    isActive: item.isActive,
  }
}

const cancelEdit = () => {
  editingId.value = null
  form.value = { name: '', durationMinutes: 30, sortOrder: items.value.length + 1, isActive: true }
}

const handleSubmit = async () => {
  submitting.value = true
  const result = editingId.value
    ? await adminBooking.updateOperationCatalogItem(editingId.value, form.value)
    : await adminBooking.createOperationCatalogItem(form.value)
  submitting.value = false

  if (!result.success) {
    alert(result.message || '操作失敗，請稍後再試')
    return
  }
  cancelEdit()
  await loadItems()
}

const handleDelete = async (item) => {
  if (!confirm(`確定要刪除操作項目「${item.name}」嗎？`)) return
  const result = await adminBooking.deleteOperationCatalogItem(item.operationCatalogItemId)
  if (!result.success) {
    alert(result.message || '刪除失敗，請稍後再試')
    return
  }
  await loadItems()
}

onMounted(async () => {
  await loadItems()
  form.value.sortOrder = items.value.length + 1
})
</script>
