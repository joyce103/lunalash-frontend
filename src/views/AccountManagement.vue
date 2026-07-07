<template>
  <div class="max-w-3xl mx-auto space-y-8 font-sans">

    <PageTitle
      title="帳號管理"
      subtitle="管理後台管理員帳號，或修改自己的登入密碼"
    />

    <!-- 管理員清單 -->
    <div class="bg-white p-6 sm:p-8 rounded-2xl border border-lotus-100 shadow-sm space-y-4">
      <h2 class="text-lg font-semibold text-gray-700">管理員帳號清單</h2>

      <div v-if="adminList.length === 0" class="text-center py-8 text-lotus-400">
        尚無資料
      </div>

      <div v-else class="divide-y divide-lotus-100">
        <div
          v-for="admin in adminList"
          :key="admin.adminId"
          class="flex items-center justify-between py-3"
        >
          <div>
            <p class="text-sm font-medium text-gray-700">
              {{ admin.name }}
              <span v-if="admin.role === 'SUPER_ADMIN'" class="ml-2 text-xs bg-lotus-100 text-lotus-600 px-2 py-0.5 rounded-full">最高管理員</span>
              <span v-if="admin.username === currentUsername" class="ml-2 text-xs text-lotus-500">(目前登入中)</span>
            </p>
            <p class="text-xs text-gray-400">帳號：{{ admin.username }}</p>
          </div>
          <button
            :disabled="admin.username === currentUsername"
            @click="handleDelete(admin)"
            class="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:hover:text-gray-600"
          >
            刪除
          </button>
        </div>
      </div>
    </div>

    <!-- 待審核申請：只有最高管理員看得到 -->
    <div v-if="isSuperAdmin" class="bg-white p-6 sm:p-8 rounded-2xl border border-lotus-100 shadow-sm space-y-4">
      <h2 class="text-lg font-semibold text-gray-700">待審核申請</h2>

      <div v-if="pendingRequests.length === 0" class="text-center py-8 text-lotus-400">
        目前沒有待審核的申請
      </div>

      <div v-else class="divide-y divide-lotus-100">
        <div
          v-for="req in pendingRequests"
          :key="req.requestId"
          class="flex items-center justify-between py-3 gap-4"
        >
          <div>
            <p class="text-sm font-medium text-gray-700">
              <span :class="req.requestType === 'REGISTER' ? 'text-lotus-500' : 'text-red-400'">
                {{ req.requestType === 'REGISTER' ? '新增帳號' : '刪除帳號' }}
              </span>
              —
              <span v-if="req.requestType === 'REGISTER'">{{ req.newName }}（{{ req.newUsername }}）</span>
              <span v-else>{{ req.targetName }}（{{ req.targetUsername }}）</span>
            </p>
            <p class="text-xs text-gray-400">由 {{ req.requestedByUsername }} 提出申請</p>
          </div>
          <div class="flex gap-2 shrink-0">
            <button
              @click="handleApprove(req)"
              class="px-4 py-1.5 rounded-full text-sm font-medium bg-lotus-50 text-lotus-600 border border-lotus-200 hover:bg-lotus-100 transition-all duration-200"
            >
              核准
            </button>
            <button
              @click="handleReject(req)"
              class="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 transition-all duration-200"
            >
              駁回
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增管理員帳號 -->
    <div class="bg-white p-6 sm:p-8 rounded-2xl border border-lotus-100 shadow-sm space-y-5">
      <h2 class="text-lg font-semibold text-gray-700">新增管理員帳號</h2>
      <p v-if="!isSuperAdmin" class="text-xs text-lotus-500 -mt-3">
        您不是最高管理員，送出後需等最高管理員核准才會生效
      </p>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
          <input v-model="registerForm.name" type="text" required
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lotus-400 focus:border-transparent transition-colors text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">帳號</label>
          <input v-model="registerForm.username" type="text" required
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lotus-400 focus:border-transparent transition-colors text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">密碼</label>
          <input v-model="registerForm.password" type="password" required minlength="6"
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lotus-400 focus:border-transparent transition-colors text-sm" />
        </div>
        <button type="submit" :disabled="registering"
          class="px-5 py-2.5 bg-lotus-400 hover:bg-lotus-500 text-white rounded-xl shadow-sm transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed">
          {{ registering ? '新增中...' : '新增帳號' }}
        </button>
      </form>
    </div>

    <!-- 修改密碼 -->
    <div class="bg-white p-6 sm:p-8 rounded-2xl border border-lotus-100 shadow-sm space-y-5">
      <h2 class="text-lg font-semibold text-gray-700">修改我的密碼</h2>

      <form @submit.prevent="handleChangePassword" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">原密碼</label>
          <input v-model="passwordForm.oldPassword" type="password" required
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lotus-400 focus:border-transparent transition-colors text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">新密碼</label>
          <input v-model="passwordForm.newPassword" type="password" required minlength="6"
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lotus-400 focus:border-transparent transition-colors text-sm" />
        </div>
        <button type="submit" :disabled="changingPassword"
          class="px-5 py-2.5 bg-lotus-400 hover:bg-lotus-500 text-white rounded-xl shadow-sm transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed">
          {{ changingPassword ? '修改中...' : '修改密碼' }}
        </button>
      </form>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import admin from '@/utils/admin'
import { setAuthState } from '@/stores/authState'
import { getUsernameFromToken } from '@/utils/jwt'
import PageTitle from '@/components/common/PageTitle.vue'

const router = useRouter()

// 直接從目前登入的 JWT 解出帳號，用來判斷清單中哪一筆是自己 (不能刪除自己)
const currentUsername = getUsernameFromToken(localStorage.getItem('token'))

const adminList = ref([])
const isSuperAdmin = computed(() =>
  adminList.value.some((a) => a.username === currentUsername && a.role === 'SUPER_ADMIN')
)

const loadAdmins = async () => {
  adminList.value = await admin.getAllAdmins()
}

const pendingRequests = ref([])
const loadPendingRequests = async () => {
  // 不是最高管理員的話後端一定會擋 403，這裡先判斷過就不用多打一次沒意義的 API
  pendingRequests.value = isSuperAdmin.value ? await admin.getPendingRequests() : []
}

onMounted(async () => {
  await loadAdmins()
  await loadPendingRequests()
})

// 新增管理員帳號
const registerForm = ref({ name: '', username: '', password: '' })
const registering = ref(false)
const handleRegister = async () => {
  registering.value = true
  const ok = await admin.register(registerForm.value)
  registering.value = false
  if (!ok) return
  registerForm.value = { name: '', username: '', password: '' }
  await loadAdmins()
  await loadPendingRequests()
}

// 刪除管理員帳號
const handleDelete = async (target) => {
  if (!confirm(`確定要刪除帳號「${target.name}」嗎？`)) return
  const ok = await admin.deleteAdmin(target.adminId)
  if (!ok) return
  await loadAdmins()
  await loadPendingRequests()
}

// 審核申請
const handleApprove = async (req) => {
  if (!confirm(`確定要核准這筆「${req.requestType === 'REGISTER' ? '新增帳號' : '刪除帳號'}」申請嗎？`)) return
  const ok = await admin.approveRequest(req.requestId)
  if (!ok) return
  await loadAdmins()
  await loadPendingRequests()
}

const handleReject = async (req) => {
  if (!confirm('確定要駁回這筆申請嗎？')) return
  const ok = await admin.rejectRequest(req.requestId)
  if (!ok) return
  await loadPendingRequests()
}

// 修改密碼
const passwordForm = ref({ oldPassword: '', newPassword: '' })
const changingPassword = ref(false)
const handleChangePassword = async () => {
  changingPassword.value = true
  const ok = await admin.changePassword(passwordForm.value)
  changingPassword.value = false
  if (!ok) return

  passwordForm.value = { oldPassword: '', newPassword: '' }
  // 密碼已變更，強制登出讓使用者用新密碼重新登入
  localStorage.removeItem('token')
  localStorage.removeItem('userName')
  setAuthState(false, '')
  router.push('/')
}
</script>
