<template>
  <div class="dice-face">
    <!-- 根据点数显示不同的布局 -->
    <div v-if="value === 1" class="dot center"></div>
    <div v-if="value === 2" class="dots">
      <div class="dot top-left"></div>
      <div class="dot bottom-right"></div>
    </div>
    <div v-if="value === 3" class="dots">
      <div class="dot top-left"></div>
      <div class="dot center"></div>
      <div class="dot bottom-right"></div>
    </div>
    <div v-if="value === 4" class="dots">
      <div class="dot top-left"></div>
      <div class="dot top-right"></div>
      <div class="dot bottom-left"></div>
      <div class="dot bottom-right"></div>
    </div>
    <div v-if="value === 5" class="dots">
      <div class="dot top-left"></div>
      <div class="dot top-right"></div>
      <div class="dot center"></div>
      <div class="dot bottom-left"></div>
      <div class="dot bottom-right"></div>
    </div>
    <div v-if="value === 6" class="dots">
      <div class="dot top-left"></div>
      <div class="dot top-right"></div>
      <div class="dot middle-left"></div>
      <div class="dot middle-right"></div>
      <div class="dot bottom-left"></div>
      <div class="dot bottom-right"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: number;
}>();
</script>

<style scoped>
.dice-face {
  width: 100%;
  height: 100%;
  position: relative;
}

.dots {
  width: 100%;
  height: 100%;
  position: relative;
}

.dot {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #374151;
  box-shadow: inset 1px 1px 2px rgba(255,255,255,0.8);
}

.dot.center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.dot.top-left {
  top: 20%;
  left: 20%;
}

.dot.top-right {
  top: 20%;
  right: 20%;
}

.dot.bottom-left {
  bottom: 20%;
  left: 20%;
}

.dot.bottom-right {
  bottom: 20%;
  right: 20%;
}

.dot.middle-left {
  top: 50%;
  left: 20%;
  transform: translateY(-50%);
}

.dot.middle-right {
  top: 50%;
  right: 20%;
  transform: translateY(-50%);
}
</style>