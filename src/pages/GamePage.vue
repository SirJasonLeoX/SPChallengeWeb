<template>
  <div class="max-w-6xl mx-auto">
    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <h2 class="card-title">挑战进行中</h2>
        <div class="flex space-x-2">
          <button
            @click="goToConfig"
            class="btn-secondary px-3 py-1 text-sm"
            aria-label="返回配置"
          >
            返回配置
          </button>
        </div>
      </div>

      <!-- 侧边布局：路径在左，控制和统计在右 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-[768px]">
        <!-- 左侧：路径可视化 -->
        <div class="bg-gray-100 rounded-lg p-3">
          <canvas
            ref="gameCanvas"
            class="w-full h-auto border border-gray-200 rounded-lg"
            aria-label="游戏路径可视化"
          ></canvas>
        </div>

        <!-- 右侧：控制和统计区域 -->
        <div class="space-y-4">
          <!-- 当前位置 -->
          <div class="text-center">
            <p class="text-lg font-bold text-gray-600 mb-1">当前位置</p>
            <p class="text-xl font-bold text-primary-color">
              {{ gameState.current_position + 1 }} / {{ gameState.path_tasks.length }}
            </p>
          </div>

          <!-- 骰子区域 -->
          <div class="text-center">
            <div class="relative inline-block">
              <DiceComponent
                :value="currentDiceValue || 1"
                :isRolling="isRolling"
                @animation-end="onDiceAnimationEnd"
                class="mx-auto mb-4"
                aria-label="骰子显示"
                role="img"
              />
              <button
                @click="rollDice"
                @keydown.enter="rollDice"
                @keydown.space="rollDice"
                class="btn-primary px-6 py-3 text-lg"
                :disabled="isRolling || gameState.is_game_over || !canRollDice"
                aria-label="掷骰子"
              >
                {{ isRolling ? '掷骰中...' : '掷骰子' }}
              </button>
            </div>
            
            <div v-if="backwardSteps > 0" class="mt-4">
              <p class="text-red-600 font-medium">警告！掷出的点数过大，需要后退{{ backwardSteps }}步！</p>
            </div>
          </div>

          <!-- 当前任务 -->
          <div class="text-center" v-if="gameState.current_position > 0 && gameState.current_position < gameState.path_tasks.length - 1">
            <h3 class="text-lg font-bold mb-2">当前惩罚</h3>
            <div
              class="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block"
              aria-live="polite"
            >
              <p class="text-xl font-semibold text-blue-800">{{ currentTask?.name }}</p>
              <p class="text-gray-600">×{{ currentTask?.count }}</p>
            </div>

            <button
              @click="completeCurrentTask"
              @keydown.enter="completeCurrentTask"
              @keydown.space="completeCurrentTask"
              class="btn-primary px-6 py-2 mt-4"
              :disabled="!currentTask || gameState.is_game_over || currentTask.is_completed"
              aria-label="完成当前任务"
            >
              {{ currentTask?.is_completed ? '已完成' : '完成惩罚' }}
            </button>
          </div>

          <!-- 统计信息 -->
          <div class="space-y-4">
            <div class="card">
              <h3 class="text-lg font-bold mb-3 border-b border-gray-200 pb-2 text-center">惩罚统计</h3>
              <div class="space-y-3 text-center">
                <div>
                  <span class="text-gray-600">总掷骰次数: </span>
                  <span class="font-medium">{{ gameState.total_rolls }}</span>
                </div>
                <div v-for="(count, taskName) in taskCompletionStats" :key="taskName">
                  <span class="text-gray-600">{{ taskName }}: </span>
                  <span class="font-medium text-blue-600">{{ count }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

        <!-- 胜利提示 -->
    <div v-if="gameState.is_game_over" class="modal-overlay">
      <div class="modal-content text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2">恭喜你完成挑战！</h3>
        <p class="text-gray-600 mb-6">你已经到达终点！</p>
        
        <!-- 赞赏码区域 -->
        <div class="mt-8">
          <div class="card">
            <h3 class="text-lg font-bold mb-3 border-b border-gray-200 pb-2 text-center">感谢支持</h3>
            <div class="text-center py-6">
              <p class="text-gray-600 mb-4">觉得好玩？点击保存赞赏码，请作者喝杯咖啡吧！也请留下你的宝贵意见帮助作者不断改进！</p>
              <img src="../assets/reward-code.png" alt="打赏码" class="w-96 h-96 mx-auto mb-4">
            </div>
          </div>
        </div>
        
        <div class="flex justify-center space-x-3">
          <button @click="goToVictory" class="btn-primary px-6 py-2">
            惩罚统计
          </button>
          <button @click="restartGame" class="btn-secondary px-6 py-2">
            再玩一次
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore';
import { PathGenerator } from '../services/pathGenerator';
import { DiceLogic } from '../services/diceLogic';
import DiceComponent from '../components/DiceComponent.vue';

const router = useRouter();
const gameStore = useGameStore();

const gameCanvas = ref<HTMLCanvasElement | null>(null);
const currentDiceValue = ref<number | null>(null);
const isRolling = ref(false);
const backwardSteps = ref<number>(0);

const gameState = computed(() => gameStore.gameState);
const currentTask = computed(() => gameStore.currentTask);
const completionRate = computed(() => gameStore.completionRate);
const taskCompletionStats = computed(() => gameStore.taskCompletionStats);
const canRollDice = computed(() => gameStore.canRollDice);

let pathGenerator: PathGenerator;

onMounted(() => {
  // 初始化路径生成器，确保使用正确的配置（与canvas渲染一致）
  pathGenerator = new PathGenerator({ rows: 10, cols: 6, cellSize: 40, spacing: 10 });
  renderGameCanvas();
  
  // 检查是否有保存的游戏
  if (!gameState.value.path_tasks.length) {
    router.push('/');
  }
});

watch(() => gameState.value.current_position, () => {
  renderGameCanvas();
});

function renderGameCanvas() {
  if (!gameCanvas.value) return;
  
  const canvas = gameCanvas.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // 设置canvas大小 - 紧凑布局，适应屏幕
  const cellSize = 55;
  const spacing = 12;
  const rows = 10;
  const cols = 6;
  
  // 确保canvas足够宽以容纳所有格子
  canvas.width = cols * (cellSize + spacing) + spacing;
  canvas.height = rows * (cellSize + spacing) + spacing;
  
  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 使用紧凑的路径生成器配置，并传递任务信息
  const pathGenerator = new PathGenerator({ rows, cols, cellSize, spacing });
  pathGenerator.render(canvas, gameState.value.current_position, gameState.value.path_tasks);
}

function rollDice() {
  if (isRolling.value || gameState.value.is_game_over) return;
  
  isRolling.value = true;
  currentDiceValue.value = null;
  
  // 立即触发骰子动画，动画结束时会自动调用onDiceAnimationEnd
}

function onDiceAnimationEnd() {
  // 骰子动画结束后执行逻辑
  const { result } = gameStore.rollDice();
  currentDiceValue.value = result;
  isRolling.value = false;
  
  // 计算后退步数
  const diceLogic = new DiceLogic();
  backwardSteps.value = diceLogic.calculateBackwardSteps(
    gameState.value.current_position,
    result,
    gameState.value.path_tasks.length
  );
  
  // 移动当前掷出的步数（内部会处理后退逻辑）
  movePlayer(result);
  
  // 重置后退步数显示
  setTimeout(() => {
    backwardSteps.value = 0;
  }, 3000); // 3秒后清除提示
}

function movePlayer(steps: number) {
  const newPosition = gameStore.movePlayer(steps);
  
  // 检查是否到达终点
  if (newPosition === gameState.value.path_tasks.length - 1) {
    gameStore.gameState.is_game_over = true;
  }
}

function completeCurrentTask() {
  if (!currentTask.value || currentTask.value.is_completed) return;
  
  gameStore.completeTask();
}

function goToConfig() {
  gameStore.resetGame();
  router.push('/');
}

function goToVictory() {
  router.push('/victory');
}

function restartGame() {
  gameStore.resetGame();
  gameStore.initializeGame(gameStore.taskConfig);
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}分 ${secs}秒`;
}
</script>

<style scoped>
.dice-animation {
  transition: all 0.3s ease;
}

.dice-animation.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>