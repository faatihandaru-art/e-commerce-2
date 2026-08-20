<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <Navbar />

    <div class="max-w-7xl mx-auto px-6 py-8 flex gap-8">
      <aside class="w-56 shrink-0">
        <nav class="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-1">
          <router-link
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            active-class="!bg-indigo-50 !text-indigo-600"
          >
            {{ link.label }}
          </router-link>
        </nav>
      </aside>

      <main class="flex-1 min-w-0">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/ui/Navbar.vue'

const links = [
    { to: '/account', label: 'My Profile' },
    { to: '/account/orders', label: 'My Orders' },
]
</script>
