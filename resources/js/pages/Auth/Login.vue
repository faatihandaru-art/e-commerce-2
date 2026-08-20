<template>
  <div>
    <h1 class="text-xl font-extrabold tracking-tight mb-6">Login</h1>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1.5">Email</label>
        <input
          v-model="form.email"
          type="email"
          required
          class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          placeholder="you@example.com"
        >
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1.5">Password</label>
        <input
          v-model="form.password"
          type="password"
          required
          class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          placeholder="••••••••"
        >
      </div>
      <p v-if="error" class="text-red-500 text-xs">{{ error }}</p>
      <button
        type="submit"
        :disabled="auth.loading"
        class="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-500 transition-colors disabled:opacity-50"
      >
        {{ auth.loading ? 'Signing in...' : 'Login' }}
      </button>
    </form>

    <p class="text-center text-xs text-gray-400 mt-6">
      Don't have an account?
      <router-link to="/auth/register" class="text-indigo-500 font-semibold hover:text-indigo-600">Register</router-link>
    </p>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({ email: '', password: '' })
const error = ref('')

async function handleLogin() {
    error.value = ''
    try {
        await auth.login(form.email, form.password)
        router.push('/')
    } catch (e) {
        error.value = e.response?.data?.message || 'Login failed.'
    }
}
</script>
