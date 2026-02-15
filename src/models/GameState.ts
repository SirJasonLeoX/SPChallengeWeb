import type { PathTask } from './PathTask';

export interface GameState {
  current_position: number;    // 当前位置
  total_rolls: number;         // 总掷骰次数
  tasks_completed: number;     // 已完成任务数
  path_tasks: PathTask[];      // 路径任务列表
  is_game_over: boolean;       // 游戏是否结束
  can_roll_dice: boolean;      // 是否可以掷骰子（任务完成状态控制）
  task_completion_counts: Record<string, number>; // 每项任务的完成次数
}

export function createInitialGameState(pathTasks: PathTask[]): GameState {
  return {
    current_position: 0,
    total_rolls: 0,
    tasks_completed: 0,
    path_tasks: pathTasks,
    is_game_over: false,
    can_roll_dice: true,
    task_completion_counts: {}
  };
}