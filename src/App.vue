<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-blue-600 text-white p-4 shadow-md">
      <h1 class="text-2xl font-bold text-center">
        <span class="block text-4xl">SP惩罚大挑战</span>
  <span class="block">杰先森@SirJasonLeoX</span>
  <span class="block text-sm font-normal text-orange-500">请确保游戏双方均年满18岁且遵从SCC规则 - 安全，理智，双方自愿参与。</span>
</h1>
    </header>
    <main class="container mx-auto p-4 max-w-6xl">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer class="bg-gray-200 text-center p-4 text-gray-600 text-sm">
      <p>© 2026 @SirJasonLeoX 所有权利保留.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// App component setup
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>