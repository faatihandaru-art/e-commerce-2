<template>
  <div>
    <router-link to="/products" class="text-sm text-gray-400 hover:text-indigo-500 transition-colors mb-6 inline-block">
      ← Back to Products
    </router-link>

    <div class="bg-white rounded-3xl border border-gray-100 overflow-hidden">
      <div class="h-80 bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center text-9xl">
        🎧
      </div>
      <div class="p-8">
        <div class="text-xs uppercase tracking-widest font-extrabold text-indigo-500 mb-2">Electronics</div>
        <h1 class="text-3xl font-extrabold tracking-tight mb-2">Wireless Headphone</h1>
        <div class="text-amber-400 text-lg mb-4">★★★★★ <span class="text-gray-400 text-sm">(128 reviews)</span></div>
        <p class="text-gray-400 text-sm leading-relaxed mb-6 max-w-lg">
          Premium wireless headphone with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.
        </p>
        <div class="flex items-center gap-6">
          <span class="text-3xl font-extrabold">Rp 499.000</span>
          <button class="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-500 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
