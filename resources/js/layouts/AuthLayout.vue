<template>
  <div class="min-h-screen bg-gray-50 font-sans flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <router-link to="/" class="text-3xl font-extrabold tracking-tight inline-block">
          Shop<span class="bg-gradient-to-r from-indigo-500 to-purple-400 bg-clip-text text-transparent">Ease</span>
        </router-link>
      </div>

      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <slot />
      </div>

      <p class="text-center text-xs text-gray-400 mt-6">
        <router-link to="/" class="hover:text-indigo-500 transition-colors">← Back to Store</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
</script>
