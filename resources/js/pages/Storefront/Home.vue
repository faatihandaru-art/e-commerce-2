<template>
  <section class="rounded-[38px] bg-gradient-to-br from-gray-900 to-gray-800 text-white px-16 py-20 mb-20 relative overflow-hidden">
    <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22white%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] z-0" />
    <div class="relative z-10 max-w-xl">
      <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-bold tracking-widest uppercase mb-6">
        ✨ NEW COLLECTION 2026
      </span>
      <h1 class="text-6xl font-extrabold leading-none tracking-tight mb-6">
        Everything you need.<br>
        <span class="bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">All in one place.</span>
      </h1>
      <p class="text-gray-400 text-base leading-relaxed mb-8 max-w-md">
        Discover products you'll love with a simple, modern and enjoyable shopping experience.
      </p>
      <router-link
        to="/products"
        class="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-extrabold hover:-translate-y-1 hover:shadow-2xl transition-all"
      >
        Shop Now <span class="transition-transform group-hover:translate-x-1">→</span>
      </router-link>
    </div>
  </section>

  <section class="mb-20">
    <div class="flex justify-between items-end mb-8">
      <div>
        <h2 class="text-3xl font-extrabold tracking-tight">Featured Products</h2>
        <p class="text-gray-400 text-sm mt-1">Popular products picked just for you.</p>
      </div>
      <router-link to="/products" class="text-indigo-500 font-bold text-sm hover:text-indigo-600 transition-colors">
        View all →
      </router-link>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        v-bind="product"
        @add-to-cart="cart.addItem(product)"
      />
    </div>
  </section>

  <section class="mb-20">
    <h2 class="text-3xl font-extrabold tracking-tight mb-8">Why ShopEase?</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="bg-white p-7 rounded-3xl border border-gray-100 hover:-translate-y-1 hover:shadow-lg transition-all"
      >
        <div class="text-2xl mb-4 bg-indigo-50 w-fit p-2.5 rounded-xl">{{ feature.icon }}</div>
        <h3 class="font-bold mb-2">{{ feature.title }}</h3>
        <p class="text-gray-400 text-sm leading-relaxed">{{ feature.desc }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import ProductCard from '@/components/product/ProductCard.vue'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

const products = [
    { id: 1, name: 'Wireless Headphone', price: 499000, category: 'Electronics', emoji: '🎧', rating: 5, reviews: 128, to: '/products/wireless-headphone' },
    { id: 2, name: 'Mechanical Keyboard', price: 799000, category: 'Gaming', emoji: '⌨️', rating: 5, reviews: 94, to: '/products/mechanical-keyboard' },
    { id: 3, name: 'Gaming Mouse', price: 349000, category: 'Gaming', emoji: '🖱️', rating: 4, reviews: 76, to: '/products/gaming-mouse' },
    { id: 4, name: 'Smart Watch', price: 899000, category: 'Lifestyle', emoji: '⌚', rating: 5, reviews: 112, to: '/products/smart-watch' },
]

const features = [
    { icon: '🚚', title: 'Fast Delivery', desc: 'Get your products delivered quickly and safely.' },
    { icon: '🔒', title: 'Secure Shopping', desc: 'Your shopping experience is designed with security in mind.' },
    { icon: '💳', title: 'Easy Payment', desc: 'Simple payment with multiple options available.' },
    { icon: '⭐', title: 'Trusted Products', desc: 'Discover products with ratings and reviews.' },
]
</script>
