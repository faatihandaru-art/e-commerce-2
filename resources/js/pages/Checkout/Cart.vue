<template>
  <div>
    <h1 class="text-3xl font-extrabold tracking-tight mb-8">Shopping Cart</h1>

    <div v-if="cart.items.length === 0" class="text-center py-20">
      <div class="text-6xl mb-4">🛒</div>
      <p class="text-gray-400 mb-6">Your cart is empty.</p>
      <router-link to="/products" class="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-500 transition-colors">
        Browse Products
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cart.items"
          :key="item.id"
          class="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-5"
        >
          <div class="w-20 h-20 bg-indigo-50 rounded-xl flex items-center justify-center text-3xl shrink-0">
            {{ item.emoji || '📦' }}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-sm truncate">{{ item.name }}</h3>
            <p class="text-indigo-500 text-xs font-semibold">{{ item.category }}</p>
          </div>
          <div class="flex items-center gap-3">
            <button class="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-sm font-bold hover:bg-gray-50" @click="cart.updateQuantity(item.id, item.quantity - 1)">−</button>
            <span class="w-8 text-center text-sm font-bold">{{ item.quantity }}</span>
            <button class="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-sm font-bold hover:bg-gray-50" @click="cart.updateQuantity(item.id, item.quantity + 1)">+</button>
          </div>
          <div class="font-extrabold text-sm w-28 text-right">{{ formatPrice(item.price * item.quantity) }}</div>
          <button class="text-gray-300 hover:text-red-500 transition-colors text-lg" @click="cart.removeItem(item.id)">✕</button>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 p-6 h-fit">
        <h2 class="font-bold mb-4">Order Summary</h2>
        <div class="flex justify-between text-sm text-gray-500 mb-2">
          <span>Items ({{ cart.totalItems }})</span>
          <span>{{ formatPrice(cart.totalPrice) }}</span>
        </div>
        <div class="flex justify-between text-sm text-gray-500 mb-4">
          <span>Shipping</span>
          <span class="text-green-500 font-semibold">Free</span>
        </div>
        <div class="border-t border-gray-100 pt-4 flex justify-between font-extrabold">
          <span>Total</span>
          <span>{{ formatPrice(cart.totalPrice) }}</span>
        </div>
        <router-link to="/checkout" class="block w-full bg-gray-900 text-white text-center py-3 rounded-2xl font-bold mt-6 hover:bg-indigo-500 transition-colors">
          Checkout
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

function formatPrice(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
}
</script>
