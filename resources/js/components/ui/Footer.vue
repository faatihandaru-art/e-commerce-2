<template>
  <footer class="mt-24 bg-gray-900 text-white rounded-t-[40px] relative overflow-hidden">
    <div class="absolute top-0 right-0 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl" />

    <div class="max-w-7xl mx-auto px-8 pt-16 pb-10 relative z-10">
      <div class="flex flex-wrap justify-between gap-10">
        <div class="max-w-sm">
          <div class="text-3xl font-extrabold mb-4">
            Shop<span class="bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text text-transparent">Ease</span>
          </div>
          <p class="text-gray-400 text-sm leading-relaxed">
            Modern online shopping experience designed to make finding your favorite products easier.
          </p>
        </div>

        <div class="flex flex-wrap gap-14">
          <div class="flex flex-col gap-3">
            <strong class="text-sm">Shop</strong>
            <router-link to="/products" class="text-gray-400 text-sm hover:text-white transition-colors">Products</router-link>
          </div>
          <div class="flex flex-col gap-3">
            <strong class="text-sm">Company</strong>
            <span class="text-gray-400 text-sm">About Us</span>
          </div>
          <div class="flex flex-col gap-3">
            <strong class="text-sm">Help</strong>
            <span class="text-gray-400 text-sm">FAQ</span>
            <span class="text-gray-400 text-sm">Contact</span>
          </div>
        </div>
      </div>

      <div class="mt-12 pt-6 border-t border-white/10 text-gray-500 text-xs flex justify-between flex-wrap gap-2">
        <span>&copy; {{ year }} ShopEase. All rights reserved.</span>
        <span>Made with ♥ for modern shoppers</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>
