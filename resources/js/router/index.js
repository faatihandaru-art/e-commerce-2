import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import StorefrontLayout from '@/layouts/StorefrontLayout.vue'
import AccountLayout from '@/layouts/AccountLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const routes = [
    {
        path: '/',
        component: StorefrontLayout,
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('@/pages/Storefront/Home.vue'),
            },
            {
                path: 'products',
                name: 'products.index',
                component: () => import('@/pages/Storefront/ProductList.vue'),
            },
            {
                path: 'products/:slug',
                name: 'products.show',
                component: () => import('@/pages/Storefront/ProductDetail.vue'),
            },
        ],
    },
    {
        path: '/cart',
        component: StorefrontLayout,
        children: [
            {
                path: '',
                name: 'cart',
                component: () => import('@/pages/Checkout/Cart.vue'),
            },
        ],
    },
    {
        path: '/checkout',
        component: StorefrontLayout,
        children: [
            {
                path: '',
                name: 'checkout',
                component: () => import('@/pages/Checkout/Checkout.vue'),
            },
            {
                path: 'success',
                name: 'checkout.success',
                component: () => import('@/pages/Checkout/Success.vue'),
            },
        ],
    },
    {
        path: '/account',
        component: AccountLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'account.profile',
                component: () => import('@/pages/Account/Profile.vue'),
            },
            {
                path: 'orders',
                name: 'account.orders',
                component: () => import('@/pages/Account/Orders.vue'),
            },
        ],
    },
    {
        path: '/admin',
        component: AdminLayout,
        meta: { requiresAuth: true, requiresAdmin: true },
        children: [
            {
                path: '',
                name: 'admin.dashboard',
                component: () => import('@/pages/Admin/Dashboard.vue'),
            },
            {
                path: 'products',
                name: 'admin.products',
                component: () => import('@/pages/Admin/Products.vue'),
            },
            {
                path: 'orders',
                name: 'admin.orders',
                component: () => import('@/pages/Admin/Orders.vue'),
            },
        ],
    },
    {
        path: '/auth',
        component: AuthLayout,
        meta: { guestOnly: true },
        children: [
            {
                path: 'login',
                name: 'login',
                component: () => import('@/pages/Auth/Login.vue'),
            },
            {
                path: 'register',
                name: 'register',
                component: () => import('@/pages/Auth/Register.vue'),
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to) => {
    const auth = useAuthStore()

    if (!auth.user && localStorage.getItem('token')) {
        await auth.fetchUser()
    }

    if (to.meta.requiresAuth && !auth.isLoggedIn) {
        return { name: 'login' }
    }

    if (to.meta.requiresAdmin && !auth.isAdmin) {
        return { name: 'home' }
    }

    if (to.meta.guestOnly && auth.isLoggedIn) {
        return { name: 'home' }
    }
})

export default router
