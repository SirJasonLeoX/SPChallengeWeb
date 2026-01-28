<template>
  <div class="max-w-4xl mx-auto">
    <div class="card">
      <h2 class="card-title text-center">惩罚配置</h2>
      
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">当前惩罚配置</h3>
          <div class="flex space-x-2">
            <button
              @click="addTask"
              class="btn-secondary px-3 py-1 text-sm"
            >
              添加惩罚
            </button>
            <button
              @click="resetConfig"
              class="btn-secondary px-3 py-1 text-sm"
              :disabled="isDefaultConfig"
            >
              重置为默认
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="task-table">
            <thead>
              <tr>
                <th class="w-1/3">
                  <div class="text-center w-full">惩罚项目</div>
                </th>
                <th class="w-1/6">
                  <div class="text-center w-full">最小数量</div>
                </th>
                <th class="w-1/6">
                  <div class="text-center w-full">最大数量</div>
                </th>
                <th class="w-1/6">
                  <div class="text-center w-full">操作</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(task, index) in taskConfig" :key="index">
                <td>
                  <input
                    v-model="task.name"
                    type="text"
                    class="form-input text-sm"
                    placeholder="输入任务名称"
                    @blur="validateTask(task, index)"
                  />
                </td>
                <td>
                  <input
                    v-model.number="task.min_count"
                    type="number"
                    min="1"
                    class="form-input text-sm text-center"
                    @blur="validateTask(task, index)"
                  />
                </td>
                <td>
                  <input
                    v-model.number="task.max_count"
                    type="number"
                    min="1"
                    class="form-input text-sm text-center"
                    @blur="validateTask(task, index)"
                  />
                </td>
                <td class="text-center">
                  <button
                    @click="removeTask(index)"
                    class="text-red-500 hover:text-red-700"
                    aria-label="删除任务"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="errors.length > 0" class="alert-error mt-4">
          <ul class="list-disc pl-5">
            <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
          </ul>
        </div>
      </div>

      <div class="flex justify-center mt-8">
        <button
          @click="startGame"
          class="btn-primary px-8 py-3 text-lg"
          :disabled="!isConfigValid || isGameStarted"
        >
          开始游戏
        </button>
      </div>
    </div>

    <!-- 确认重置对话框 -->
    <div v-if="showResetConfirm" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">确认重置</h3>
        <p class="mb-6">确定要将配置重置为默认任务吗？这将清除所有当前配置。</p>
        <div class="modal-actions">
          <button @click="showResetConfirm = false" class="btn-secondary px-4 py-2">
            取消
          </button>
          <button @click="confirmReset" class="btn-danger px-4 py-2">
            确认重置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore';
import { DEFAULT_TASKS } from '../models';

const router = useRouter();
const gameStore = useGameStore();

const errors = ref<string[]>([]);
const showResetConfirm = ref(false);

// 加载上次配置
onMounted(() => {
  // 不再加载上次配置
});

const taskConfig = computed(() => gameStore.taskConfig);
const isGameStarted = computed(() => gameStore.isGameStarted);

const isDefaultConfig = computed(() => {
  return JSON.stringify(taskConfig.value) === JSON.stringify(DEFAULT_TASKS);
});

const isConfigValid = computed(() => {
  return taskConfig.value.every(task => 
    task.name.trim().length > 0 &&
    task.min_count >= 1 &&
    task.max_count >= task.min_count
  );
});

function validateTask(task: any, index: number) {
  errors.value = [];
  
  if (task.name.trim().length === 0) {
    errors.value.push(`任务 ${index + 1} 名称不能为空`);
  }
  
  if (task.min_count < 1) {
    errors.value.push(`任务 ${index + 1} 最小数量必须大于等于1`);
  }
  
  if (task.max_count < task.min_count) {
    errors.value.push(`任务 ${index + 1} 最大数量必须大于等于最小数量`);
  }
}

function addTask() {
  taskConfig.value.push({
    name: `新惩罚 ${taskConfig.value.length + 1}`,
    min_count: 10,
    max_count: 30
  });
}

function removeTask(index: number) {
  if (taskConfig.value.length > 1) {
    taskConfig.value.splice(index, 1);
  } else {
    errors.value.push('至少需要保留一个任务');
  }
}

function resetConfig() {
  showResetConfirm.value = true;
}

function confirmReset() {
  gameStore.resetConfig();
  showResetConfirm.value = false;
}

function startGame() {
  if (isConfigValid.value) {
    gameStore.initializeGame(taskConfig.value);
    router.push('/game');
  }
}

</script>

<style scoped>
.task-table input[type="number"]::-webkit-inner-spin-button,
.task-table input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.task-table input[type="number"] {
  -moz-appearance: textfield;
}
</style>