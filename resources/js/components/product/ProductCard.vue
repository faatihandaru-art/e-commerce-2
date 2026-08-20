<template>
  <article class="bg-white border border-gray-100 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-3 hover:shadow-xl hover:border-transparent group flex flex-col">
    <div class="h-56 bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center text-7xl relative overflow-hidden group-hover:from-indigo-50 group-hover:to-purple-50 transition-colors">
      <slot name="image">
        <span>{{ emoji }}</span>
      </slot>
    </div>

    <div class="p-5 flex flex-col flex-1">
      <div v-if="category" class="text-[10px] uppercase tracking-widest font-extrabold text-indigo-500 mb-1">
        {{ category }}
      </div>

      <h3 class="text-base font-bold tracking-tight mb-1">
        <router-link v-if="to" :to="to" class="hover:text-indigo-500 transition-colors">{{ name }}</router-link>
        <span v-else>{{ name }}</span>
      </h3>

      <div v-if="rating" class="text-sm text-amber-400 tracking-wide mb-3">
        {{ '★'.repeat(rating) }}{{ '☆'.repeat(5 - rating) }}
        <span class="text-gray-400 text-xs ml-2">({{ reviews }})</span>
      </div>

      <div class="mt-auto flex items-center justify-between pt-2">
        <span class="text-lg font-extrabold tracking-tight">{{ formattedPrice }}</span>
        <button
          class="bg-gray-900 text-white rounded-xl px-4 py-2 text-sm font-bold hover:bg-indigo-500 transition-colors active:scale-95"
          @click="$emit('add-to-cart')"
        >
          + Add
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, default: '' },
    emoji: { type: String, default: '📦' },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    to: { type: String, default: '' },
})

defineEmits(['add-to-cart'])

const formattedPrice = computed(() =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(props.price),
)
</script>
