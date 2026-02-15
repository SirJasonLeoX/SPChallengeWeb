<template>
  <div class="max-w-4xl mx-auto">
    <div class="card text-center">
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-600" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
      </div>
      
      <h2 class="text-3xl font-bold text-gray-800 mb-2">🎉 恭喜你完成挑战！ 🎉</h2>
      <p class="text-xl text-gray-600 mb-8">你已经成功到达终点，完成了挑战！</p>

      <!-- 挑战惩罚统计 -->
      <div class="max-w-md mx-auto mb-8">
        <div class="card">
          <h3 class="text-lg font-bold mb-3 border-b border-gray-200 pb-2 text-center">挑战惩罚统计</h3>
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

      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
        <button @click="shareScore" class="btn-secondary px-6 py-3 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          分享成绩
        </button>
        <button @click="restartGame" class="btn-primary px-6 py-3 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
          再玩一次
        </button>
        <button @click="goToConfig" class="btn-secondary px-6 py-3 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          返回配置
        </button>
      </div>

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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore';

const router = useRouter();
const gameStore = useGameStore();

const gameState = computed(() => gameStore.gameState);
const completionRate = computed(() => gameStore.completionRate);
const taskCompletionStats = computed(() => gameStore.taskCompletionStats);

const averageSteps = computed(() => {
  return gameState.value.total_rolls > 0
    ? gameState.value.current_position / gameState.value.total_rolls
    : 0;
});


onMounted(() => {
  // 检查是否有游戏数据
  if (gameState.value.path_tasks.length === 0) {
    router.push('/');
  }
});

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}分 ${secs}秒`;
}

function shareScore() {
  const shareText = `我刚刚完成了SP惩罚大挑战！掷骰次数${gameState.value.total_rolls}，完成率${completionRate.value.toFixed(1)}%！你也来试试吧！`;
 
  if (navigator.share) {
    navigator.share({
      title: 'SP惩罚大挑战成就',
      text: shareText,
      url: window.location.href
    }).catch(error => {
      console.error('分享失败:', error);
      fallbackShare(shareText);
    });
  } else {
    fallbackShare(shareText);
  }
}

function fallbackShare(text: string) {
  const encodedText = encodeURIComponent(text);
  window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
}

function restartGame() {
  gameStore.resetGame();
  gameStore.initializeGame(gameStore.taskConfig);
  router.push('/game');
}

function goToConfig() {
  gameStore.resetGame();
  router.push('/');
}
</script>

<style scoped>
</style>