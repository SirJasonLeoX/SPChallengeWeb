import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { GameState, TaskConfig, PathTask } from '../models';
import { PathGenerator } from '../services/pathGenerator';
import { TaskAllocator } from '../services/taskAllocator';
import { DiceLogic } from '../services/diceLogic';
import { DEFAULT_TASKS } from '../models/TaskConfig';

export const useGameStore = defineStore('game', () => {
  // 状态
  const gameState = ref<GameState>({
    current_position: 0,
    total_rolls: 0,
    tasks_completed: 0,
    path_tasks: [],
    is_game_over: false,
    can_roll_dice: true,
    task_completion_counts: {}
  });

  const taskConfig = ref<TaskConfig[]>([...DEFAULT_TASKS]);
  const isGameStarted = ref(false);
  const diceLogic = new DiceLogic();

  // 计算属性
  const currentTask = computed(() =>
    gameState.value.path_tasks[gameState.value.current_position]
  );

  const completionRate = computed(() =>
    gameState.value.path_tasks.length > 0
      ? (gameState.value.tasks_completed / gameState.value.path_tasks.length) * 100
      : 0
  );

  // 任务完成统计 - 累计每项任务的完成数量
  const taskCompletionStats = computed(() => {
    // 直接使用task_completion_counts，因为我们现在允许任务重复完成
    // 并累加任务的数量（例如：任务1×3 + 任务1×5 = 任务1×8）
    return gameState.value.task_completion_counts;
  });

  // 动作
  function initializeGame(config: TaskConfig[]) {
    taskConfig.value = config;

    // 初始化游戏状态
    const pathGenerator = new PathGenerator();
    const allocator = new TaskAllocator(config, pathGenerator.getPathLength());
    gameState.value.path_tasks = allocator.allocateTasks();
    gameState.value.total_rolls = 0;
    gameState.value.tasks_completed = 0;
    gameState.value.current_position = 0;
    gameState.value.is_game_over = false;
    gameState.value.can_roll_dice = true;
    gameState.value.task_completion_counts = {};
    isGameStarted.value = true;
    diceLogic.reset();
  }

  function rollDice(): { result: number; canRollAgain: boolean } {
    const { result, canRollAgain } = diceLogic.rollDice();
    gameState.value.total_rolls++;
    return { result, canRollAgain };
  }

  function movePlayer(steps: number) {
    const diceLogic = new DiceLogic();
    const backwardSteps = diceLogic.calculateBackwardSteps(
      gameState.value.current_position,
      steps,
      gameState.value.path_tasks.length
    );
   
    let newPosition;
    if (backwardSteps > 0) {
      // 后退机制：先前进到终点，然后后退
      // 1. 先前进到终点
      newPosition = gameState.value.path_tasks.length - 1;
      gameState.value.current_position = newPosition;
      // 不要立即设置游戏结束，因为还要后退
      
      // 2. 然后从终点后退
      newPosition = newPosition - backwardSteps;
      gameState.value.current_position = newPosition;
      
      // 执行最终停留格子的任务（如果不是终点）
      if (newPosition < gameState.value.path_tasks.length - 1) {
        // 重置任务状态以允许重复执行
        gameState.value.path_tasks[newPosition].is_completed = false;
      }
    } else {
      // 正常前进
      newPosition = Math.min(
        gameState.value.current_position + steps,
        gameState.value.path_tasks.length - 1
      );
      gameState.value.current_position = newPosition;
      
      // 如果不是终点，重置任务状态以允许重复执行
      if (newPosition < gameState.value.path_tasks.length - 1) {
        gameState.value.path_tasks[newPosition].is_completed = false;
      }
    }
  
    // 检查是否到达任务格，如果到达则禁用掷骰子按钮
    if (newPosition < gameState.value.path_tasks.length - 1) {
      gameState.value.can_roll_dice = false;
    }
   
    // 检查是否游戏结束
    if (newPosition === gameState.value.path_tasks.length - 1) {
      gameState.value.is_game_over = true;
    }
   
    return newPosition;
  }

  function completeTask() {
    const currentPosition = gameState.value.current_position;
    
    // 检查是否在有效的任务格子（不是起点和终点）
    if (currentPosition > 0 && currentPosition < gameState.value.path_tasks.length - 1) {
      const currentTask = gameState.value.path_tasks[currentPosition];
      
      // 更新每项任务的完成数量统计（累加任务数量，不是次数）
      const taskName = currentTask.name;
      gameState.value.task_completion_counts[taskName] = (gameState.value.task_completion_counts[taskName] || 0) + currentTask.count;
      
      // 任务完成后重新启用掷骰子按钮
      gameState.value.can_roll_dice = true;
      
      // 临时标记任务为完成，以便UI显示"已完成"状态
      // 这个标志会在下次移动时被重置
      gameState.value.path_tasks[currentPosition].is_completed = true;
      
      return true;
    }
    return false;
  }

  function resetGame() {
    gameState.value = {
      current_position: 0,
      total_rolls: 0,
      tasks_completed: 0,
      path_tasks: [],
      is_game_over: false,
      can_roll_dice: true,
      task_completion_counts: {}
    };
    isGameStarted.value = false;
    diceLogic.reset();
  }

  function resetConfig() {
    taskConfig.value = [...DEFAULT_TASKS];
  }

  return {
    gameState,
    taskConfig,
    isGameStarted,
    currentTask,
    completionRate,
    taskCompletionStats,
    canRollDice: computed(() => gameState.value.can_roll_dice),
    initializeGame,
    rollDice,
    movePlayer,
    completeTask,
    resetGame,
    resetConfig
  };
});