<template>
  <nav class="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-gray-100 shadow-sm">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <router-link to="/" class="text-2xl font-extrabold tracking-tight">
        <span class="bg-gradient-to-r from-indigo-500 to-purple-400 bg-clip-text text-transparent">ShopEase</span>
      </router-link>

      <div class="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
        <router-link to="/" class="hover:text-indigo-500 transition-colors">Home</router-link>
        <router-link to="/products" class="hover:text-indigo-500 transition-colors">Products</router-link>
      </div>

      <div class="flex items-center gap-3">
        <router-link
          to="/cart"
          class="relative w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
        >
          <span class="text-lg">🛒</span>
          <span
            v-if="cart.totalItems > 0"
            class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
          >
            {{ cart.totalItems }}
          </span>
        </router-link>

        <template v-if="auth.isLoggedIn">
          <router-link
            v-if="auth.isAdmin"
            to="/admin"
            class="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-indigo-500 transition-colors"
          >
            Dashboard
          </router-link>
          <router-link
            to="/account"
            class="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-indigo-500 transition-colors"
          >
            Account
          </router-link>
        </template>
        <router-link
          v-else
          to="/auth/login"
          class="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-indigo-500 transition-colors"
        >
          Login
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const auth = useAuthStore()
const cart = useCartStore()
</script>
