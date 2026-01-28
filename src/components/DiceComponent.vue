<template>
  <div class="dice-container">
    <div
      class="dice-3d"
      :class="{ 'rolling': isRolling, [`face-${value}`]: !isRolling }"
      @animationend="onAnimationEnd"
    >
      <!-- 骰子的6个面 -->
      <div class="face front"><DiceFace :value="1" /></div>
      <div class="face back"><DiceFace :value="6" /></div>
      <div class="face left"><DiceFace :value="3" /></div>
      <div class="face right"><DiceFace :value="4" /></div>
      <div class="face top"><DiceFace :value="2" /></div>
      <div class="face bottom"><DiceFace :value="5" /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import DiceFace from './DiceFace.vue';

const props = defineProps<{
  value: number;
  isRolling: boolean;
}>();

const emit = defineEmits(['animation-end']);

function onAnimationEnd() {
  if (props.isRolling) {
    emit('animation-end');
  }
}
</script>

<style scoped>
.dice-container {
  perspective: 1000px;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}

.dice-3d {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
  transform: 
    rotateX(0deg) 
    rotateY(0deg) 
    rotateZ(0deg);
}

.dice-3d.rolling {
  animation: 
    roll 1.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards,
    bounce 0.5s ease-out 1.5s forwards;
}

.face {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #f8f8f8;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
  font-size: 24px;
  font-weight: bold;
  color: #374151;
}

.face.front  { transform: translateZ(50px); }
.face.back   { transform: rotateY(180deg) translateZ(50px); }
.face.left   { transform: rotateY(-90deg) translateZ(50px); }
.face.right  { transform: rotateY(90deg) translateZ(50px); }
.face.top    { transform: rotateX(90deg) translateZ(50px); }
.face.bottom { transform: rotateX(-90deg) translateZ(50px); }

@keyframes roll {
  0% {
    transform: 
      rotateX(0deg) 
      rotateY(0deg) 
      rotateZ(0deg);
  }
  20% {
    transform: 
      rotateX(360deg) 
      rotateY(180deg) 
      rotateZ(90deg);
  }
  40% {
    transform: 
      rotateX(720deg) 
      rotateY(540deg) 
      rotateZ(270deg);
  }
  60% {
    transform: 
      rotateX(1080deg) 
      rotateY(900deg) 
      rotateZ(450deg);
  }
  80% {
    transform: 
      rotateX(1440deg) 
      rotateY(1260deg) 
      rotateZ(630deg);
  }
  100% {
    transform: 
      rotateX(1800deg) 
      rotateY(1620deg) 
      rotateZ(810deg);
  }
}

@keyframes bounce {
  0% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0); }
}

/* 根据骰子值旋转到正确的面 */
.dice-3d.face-1 { transform: rotateX(0deg) rotateY(0deg); }
.dice-3d.face-2 { transform: rotateX(-90deg) rotateY(0deg); }
.dice-3d.face-3 { transform: rotateX(0deg) rotateY(90deg); }
.dice-3d.face-4 { transform: rotateX(0deg) rotateY(-90deg); }
.dice-3d.face-5 { transform: rotateX(90deg) rotateY(0deg); }
.dice-3d.face-6 { transform: rotateX(180deg) rotateY(0deg); }
</style>