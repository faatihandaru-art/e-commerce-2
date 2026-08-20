import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
    const items = ref(JSON.parse(localStorage.getItem('cart') || '[]'))

    const totalItems = computed(() =>
        items.value.reduce((sum, item) => sum + item.quantity, 0),
    )

    const totalPrice = computed(() =>
        items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
    )

    function persist() {
        localStorage.setItem('cart', JSON.stringify(items.value))
    }

    function addItem(product, quantity = 1) {
        const existing = items.value.find((i) => i.id === product.id)
        if (existing) {
            existing.quantity += quantity
        } else {
            items.value.push({ ...product, quantity })
        }
        persist()
    }

    function removeItem(productId) {
        items.value = items.value.filter((i) => i.id !== productId)
        persist()
    }

    function updateQuantity(productId, quantity) {
        const item = items.value.find((i) => i.id === productId)
        if (item) {
            item.quantity = quantity
            if (item.quantity <= 0) {
                removeItem(productId)
            } else {
                persist()
            }
        }
    }

    function clearCart() {
        items.value = []
        persist()
    }

    return { items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart }
})
