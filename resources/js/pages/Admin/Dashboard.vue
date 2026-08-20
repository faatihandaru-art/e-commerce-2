<template>
  <div>
    <h1 class="text-2xl font-extrabold tracking-tight mb-6">Dashboard</h1>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-2xl border border-gray-100 p-6">
        <div class="text-2xl mb-2">{{ stat.icon }}</div>
        <div class="text-2xl font-extrabold">{{ stat.value }}</div>
        <div class="text-sm text-gray-400 mt-1">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const stats = [
    { icon: '📦', label: 'Total Products', value: '0' },
    { icon: '🛒', label: 'Total Orders', value: '0' },
    { icon: '💰', label: 'Revenue', value: 'Rp 0' },
]
</script>
