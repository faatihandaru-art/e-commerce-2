<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <Navbar />

    <main class="max-w-7xl mx-auto px-6 py-8">
      <slot />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/ui/Navbar.vue'
import Footer from '@/components/ui/Footer.vue'
</script>
