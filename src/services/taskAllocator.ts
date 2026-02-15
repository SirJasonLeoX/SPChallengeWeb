import type { TaskConfig } from '@/models/TaskConfig';
import type { PathTask } from '@/models/PathTask';

export class TaskAllocator {
  private tasks: TaskConfig[];
  private pathLength: number;

  constructor(tasks: TaskConfig[], pathLength: number = 60) {
    this.tasks = tasks;
    this.pathLength = pathLength;
  }

  allocateTasks(): PathTask[] {
    // 1. 根据配置生成任务池
    const taskPool: string[] = [];
    this.tasks.forEach(task => {
      const count = this.getRandomCount(task.min_count, task.max_count);
      for (let i = 0; i < count; i++) {
        taskPool.push(task.name);
      }
    });
  
    // 2. 如果任务数量超过pathLength，进行智能采样而不是简单截断
    if (taskPool.length > this.pathLength) {
      // 使用分层采样确保所有任务类型都能出现
      const sampledPool: string[] = [];
      const tasksByType: Record<string, string[]> = {};
      
      // 按任务类型分组
      taskPool.forEach(taskName => {
        if (!tasksByType[taskName]) {
          tasksByType[taskName] = [];
        }
        tasksByType[taskName].push(taskName);
      });
      
      // 确保每种任务至少出现一次
      this.tasks.forEach(task => {
        if (tasksByType[task.name] && tasksByType[task.name].length > 0) {
          sampledPool.push(task.name);
        }
      });
      
      // 填充剩余位置，确保公平分配
      while (sampledPool.length < this.pathLength) {
        const randomTask = this.tasks[Math.floor(Math.random() * this.tasks.length)].name;
        sampledPool.push(randomTask);
      }
      
      // 使用采样后的池
      taskPool.length = 0;
      taskPool.push(...sampledPool);
    }
  
    // 3. 如果任务数量不足pathLength，填充到pathLength
    while (taskPool.length < this.pathLength) {
      const randomTask = this.tasks[Math.floor(Math.random() * this.tasks.length)].name;
      taskPool.push(randomTask);
    }
  
    // 4. Fisher-Yates洗牌算法
    for (let i = taskPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [taskPool[i], taskPool[j]] = [taskPool[j], taskPool[i]];
    }
  
    // 5. 生成PathTask数组
    return taskPool.map(name => ({
      name,
      count: this.getCountForTask(name),
      is_completed: false
    }));
  }

  private getRandomCount(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getCountForTask(taskName: string): number {
    const task = this.tasks.find(t => t.name === taskName);
    return task ? this.getRandomCount(task.min_count, task.max_count) : 1;
  }

  // 可重现的随机种子版本（用于调试）
  allocateTasksWithSeed(seed: number): PathTask[] {
    const rng = this.seedRandom(seed);
    
    // 1. 根据配置生成任务池
    const taskPool: string[] = [];
    this.tasks.forEach(task => {
      const count = this.getRandomCountWithRng(task.min_count, task.max_count, rng);
      for (let i = 0; i < count; i++) {
        taskPool.push(task.name);
      }
    });

    // 2. 确保每个格子都有任务
    while (taskPool.length < this.pathLength) {
      const randomTask = this.tasks[Math.floor(rng() * this.tasks.length)].name;
      taskPool.push(randomTask);
    }

    // 3. Fisher-Yates洗牌算法
    for (let i = taskPool.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [taskPool[i], taskPool[j]] = [taskPool[j], taskPool[i]];
    }

    // 4. 生成PathTask数组
    return taskPool.map(name => ({
      name,
      count: this.getCountForTask(name),
      is_completed: false
    }));
  }

  private getRandomCountWithRng(min: number, max: number, rng: () => number): number {
    return Math.floor(rng() * (max - min + 1)) + min;
  }

  private seedRandom(seed: number): () => number {
    let value = seed;
    return () => {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  }
}