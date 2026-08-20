import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '@/lib/http'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const loading = ref(false)

    const isLoggedIn = computed(() => !!user.value)
    const isAdmin = computed(() => user.value?.is_admin ?? false)

    async function fetchUser() {
        try {
            const { data } = await http.get('/user')
            user.value = data
        } catch {
            user.value = null
        }
    }

    async function login(email, password) {
        loading.value = true
        try {
            const { data } = await http.post('/login', { email, password })
            localStorage.setItem('token', data.token)
            user.value = data.user
            return data
        } finally {
            loading.value = false
        }
    }

    async function register(name, email, password, password_confirmation) {
        loading.value = true
        try {
            const { data } = await http.post('/register', {
                name,
                email,
                password,
                password_confirmation,
            })
            localStorage.setItem('token', data.token)
            user.value = data.user
            return data
        } finally {
            loading.value = false
        }
    }

    async function logout() {
        try {
            await http.post('/logout')
        } finally {
            localStorage.removeItem('token')
            user.value = null
        }
    }

    return { user, loading, isLoggedIn, isAdmin, fetchUser, login, register, logout }
})
