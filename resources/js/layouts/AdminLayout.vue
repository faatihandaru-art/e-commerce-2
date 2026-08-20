<template>
  <div class="min-h-screen bg-gray-50 font-sans flex">
    <aside class="w-64 shrink-0 bg-gray-900 text-white p-6 flex flex-col">
      <div class="text-xl font-extrabold mb-8">
        Shop<span class="text-indigo-400">Ease</span>
        <span class="text-[10px] text-gray-500 block font-normal tracking-wider uppercase mt-1">Admin Panel</span>
      </div>

      <nav class="flex flex-col gap-1 flex-1">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          active-class="!bg-indigo-500/20 !text-indigo-300"
        >
          {{ link.label }}
        </router-link>
      </nav>

      <router-link to="/" class="text-xs text-gray-500 hover:text-white transition-colors mt-auto">
        ← Back to Store
      </router-link>
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
      <header class="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <h1 class="text-lg font-bold text-gray-800">Dashboard</h1>
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-500">{{ auth.user?.name }}</span>
          <button
            class="text-sm text-gray-400 hover:text-red-500 transition-colors font-semibold"
            @click="handleLogout"
          >
            Logout
          </button>
        </div>
      </header>

      <main class="flex-1 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const links = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/products', label: 'Products' },
    { to: '/admin/orders', label: 'Orders' },
]

async function handleLogout() {
    await auth.logout()
    router.push('/auth/login')
}
</script>
