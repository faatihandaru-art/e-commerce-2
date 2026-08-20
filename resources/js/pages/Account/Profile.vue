<template>
  <div>
    <h1 class="text-2xl font-extrabold tracking-tight mb-6">My Profile</h1>
    <div class="bg-white rounded-2xl border border-gray-100 p-8">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl font-extrabold text-indigo-500">
          {{ auth.user?.name?.charAt(0) || '?' }}
        </div>
        <div>
          <h2 class="font-bold">{{ auth.user?.name || 'Guest' }}</h2>
          <p class="text-sm text-gray-400">{{ auth.user?.email || '' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>
