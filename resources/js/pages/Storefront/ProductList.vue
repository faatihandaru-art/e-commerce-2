<template>
  <div>
    <h1 class="text-3xl font-extrabold tracking-tight mb-2">Products</h1>
    <p class="text-gray-400 text-sm mb-8">Browse our collection.</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        v-bind="product"
        @add-to-cart="cart.addItem(product)"
      />
    </div>
  </div>
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
</script>
