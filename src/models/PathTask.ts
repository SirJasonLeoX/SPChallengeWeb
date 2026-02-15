export interface PathTask {
  name: string;           // 任务名称
  count: number;          // 具体数量
  is_completed: boolean;  // 是否完成
}

export function createEmptyPathTask(): PathTask {
  return {
    name: '',
    count: 0,
    is_completed: false
  };
}